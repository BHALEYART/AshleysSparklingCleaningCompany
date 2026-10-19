/* Ashley's Sparkling Cleaning Company — progressive enhancement only.
   Every page works without this file. It adds the mobile menu, price
   display from pricing.js, the live quote estimate, and accessible form
   validation and submission. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  var P = window.ASCC_PRICING;

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  /* ---------- Pricing helpers ---------- */
  function roundTo(n, step) { return Math.round(n / step) * step; }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  // "Starting at" price for a service on the smallest home size.
  function startingAt(service) {
    var sizes = Object.keys(P.base).map(function (k) { return P.base[k]; });
    var smallest = Math.min.apply(null, sizes);
    var mult = (P.service[service] || { multiplier: 1 }).multiplier;
    return Math.max(P.minimum, roundTo(smallest * mult, P.range.roundTo));
  }

  /* Fill "starting at" prices and the size table from pricing.js. The HTML
     ships with the same numbers as a fallback, so this only matters after
     prices are edited. */
  if (P) {
    document.querySelectorAll("[data-price-from]").forEach(function (el) {
      el.textContent = money(startingAt(el.dataset.priceFrom));
    });
    document.querySelectorAll("[data-addon-price]").forEach(function (el) {
      var k = el.dataset.addonPrice, n;
      if (k === "Interior windows") n = "from " + money(Math.min.apply(null, Object.keys(P.windows).map(function (w) { return P.windows[w]; })));
      else if (k === "Carpet shampoo") n = money(P.carpet.perRoom) + " per room";
      else if (P.addons[k] != null) n = money(P.addons[k]);
      if (n) el.textContent = "+" + n;
    });
    var tbody = document.querySelector("[data-price-table]");
    if (tbody) {
      var services = ["Routine cleaning", "Deep cleaning", "Move-in / move-out cleaning"];
      tbody.innerHTML = "";
      Object.keys(P.base).forEach(function (size) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.scope = "row";
        th.textContent = size;
        tr.appendChild(th);
        services.forEach(function (s) {
          var td = document.createElement("td");
          td.textContent = "from " + money(Math.max(P.minimum, roundTo(P.base[size] * P.service[s].multiplier, P.range.roundTo)));
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById("quote-form");
  if (!form) return;

  form.noValidate = true; // we take over validation so errors are announced consistently
  var summary = document.getElementById("error-summary");
  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('[type="submit"]');
  var DEFAULT_LABEL = submitBtn.textContent;
  var PHONE = form.dataset.phone || "";

  /* Prefill from the quick-quote card on the home page (?service=…&size=…) */
  var params = new URLSearchParams(location.search);
  ["service", "size", "bedrooms"].forEach(function (key) {
    var v = params.get(key);
    if (!v) return;
    var el = form.querySelector('[data-prefill="' + key + '"]');
    if (!el) return;
    if (el.tagName === "SELECT") {
      if (Array.prototype.some.call(el.options, function (o) { return o.value === v; })) el.value = v;
    } else {
      var radio = el.querySelector('input[value="' + CSS.escape(v) + '"]');
      if (radio) radio.checked = true;
    }
  });

  /* Follow-up questions shown when a checkbox is ticked (windows, carpet).
     Hidden follow-ups are disabled so they're skipped and not sent. */
  form.querySelectorAll("[data-reveal]").forEach(function (box) {
    var target = document.getElementById(box.dataset.reveal);
    if (!target) return;
    box.setAttribute("aria-controls", target.id);
    var sync = function () {
      target.hidden = !box.checked;
      target.querySelectorAll("select, input").forEach(function (f) { f.disabled = !box.checked; });
      box.setAttribute("aria-expanded", String(box.checked));
    };
    box.addEventListener("change", sync);
    sync();
  });

  /* ---------- Live estimate ---------- */
  var estimateBoxes = document.querySelectorAll("[data-estimate]");
  var estimateField = form.querySelector('input[name="Online estimate"]');

  function val(name) {
    var els = form.elements[name];
    if (!els) return "";
    if (els.length !== undefined && els.tagName !== "SELECT") {
      for (var i = 0; i < els.length; i++) if (els[i].checked) return els[i].value;
      return "";
    }
    return els.disabled ? "" : els.value;
  }
  function checkedValues(name) {
    return Array.prototype.filter.call(form.querySelectorAll('input[name="' + name + '"]'), function (i) { return i.checked; })
      .map(function (i) { return i.value; });
  }

  function calculate() {
    if (!P) return null;
    var service = val("Service type") || "Routine cleaning";
    var size = val("Square footage");
    if (!P.base[size]) size = P.sizeFromBedrooms[val("Bedrooms")] || "";
    if (!P.base[size]) return { needs: "Choose your home’s size or number of bedrooms to see an estimate." };

    var svc = P.service[service] || { multiplier: 1 };
    var lines = [];
    var cleaning = (P.base[size] + (P.bathrooms[val("Bathrooms")] || 0)) * svc.multiplier;
    lines.push([service.indexOf("Not sure") === 0 ? "Routine cleaning (estimate)" : service, cleaning]);

    var included = P.includedIn[service] || [];
    var addons = 0;
    checkedValues("Add-ons[]").forEach(function (a) {
      if (included.indexOf(a) > -1) return;
      if (a === "Interior windows") addons += P.windows[val("Number of windows")] || P.windows[Object.keys(P.windows)[0]];
      else if (a === "Carpet shampoo") addons += P.carpet.perRoom * (P.carpet.rooms[val("Carpeted rooms")] || 1);
      else addons += P.addons[a] || 0;
    });
    if (addons) lines.push(["Add-ons", addons]);

    var pets = P.pets[val("Pets")] || 0;
    if (pets) lines.push(["Pets", pets]);

    var subtotal = cleaning + addons + pets;
    var cond = P.condition[val("Home condition")] || 0;
    if (cond) { lines.push(["Extra attention (+" + cond + "%)", subtotal * cond / 100]); subtotal *= 1 + cond / 100; }

    var freq = val("How often");
    var off = (service === "Routine cleaning" || service.indexOf("Not sure") === 0) ? (P.frequency[freq] || 0) : 0;
    if (off) { lines.push(["Recurring discount (" + off + "% off)", -subtotal * off / 100]); subtotal *= 1 - off / 100; }

    var total = Math.max(P.minimum, subtotal);
    return {
      low: Math.max(P.minimum, roundTo(total * P.range.low, P.range.roundTo)),
      high: roundTo(total * P.range.high, P.range.roundTo),
      lines: lines,
      recurring: off > 0
    };
  }

  function renderEstimate() {
    var r = calculate();
    if (!r) return;
    var text, unit;
    if (r.needs) {
      text = "—";
      unit = r.needs;
      if (estimateField) estimateField.value = "";
    } else {
      text = money(r.low) + "–" + money(r.high);
      unit = r.recurring ? "per visit, with your recurring discount" : "per visit";
      if (estimateField) estimateField.value = text + " " + unit + " (online estimate, not final)";
    }
    estimateBoxes.forEach(function (box) {
      box.querySelector(".est-range").textContent = text;
      box.querySelector(".est-unit").textContent = unit;
      var list = box.querySelector(".est-detail");
      list.innerHTML = "";
      list.hidden = !!r.needs;
      (r.lines || []).forEach(function (l) {
        var li = document.createElement("li");
        var a = document.createElement("span"); a.textContent = l[0];
        var b = document.createElement("span"); b.textContent = (l[1] < 0 ? "−" : "") + money(Math.abs(l[1]));
        li.appendChild(a); li.appendChild(b); list.appendChild(li);
      });
    });
  }
  form.addEventListener("change", renderEstimate);
  renderEstimate();

  /* ---------- Validation ---------- */
  function errorEl(id) { return document.getElementById(id + "-error"); }

  function labelText(el) {
    var group = el.closest("fieldset[data-group]");
    if (group) return group.querySelector("legend").textContent.replace("*", "").replace(/\s*\(required\)\s*/i, "").trim();
    var label = form.querySelector('label[for="' + el.id + '"]');
    return label ? label.childNodes[0].textContent.replace("*", "").trim() : el.name;
  }

  function validateField(el) {
    var msg = "";
    var v = (el.value || "").trim();
    if (el.required && !v) {
      msg = el.tagName === "SELECT" ? "Please choose an option." : "This field is required.";
    } else if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      msg = "Enter an email address like name@example.com.";
    } else if (v && el.type === "tel" && v.replace(/\D/g, "").length < 10) {
      msg = "Enter a 10-digit phone number, including area code.";
    } else if (v && el.dataset.zip !== undefined && !/^\d{5}(-\d{4})?$/.test(v)) {
      msg = "Enter a 5-digit ZIP code.";
    }
    setError(el, el.id, msg);
    return msg;
  }

  function validateGroup(fs) {
    var checked = fs.querySelector("input:checked");
    var msg = checked ? "" : (fs.dataset.groupMsg || "Please choose at least one option.");
    fs.classList.toggle("fieldset-invalid", !!msg);
    var first = fs.querySelector("input");
    fs.querySelectorAll("input").forEach(function (i) { i.setAttribute("aria-invalid", msg ? "true" : "false"); });
    writeError(errorEl(fs.dataset.group), msg);
    return msg ? { el: first, msg: msg, name: labelText(first) } : null;
  }

  function validateConsent(el) {
    var msg = el.checked ? "" : "Please check this box so we can contact you.";
    setError(el, el.id, msg);
    return msg;
  }

  // Keep the line height when an error clears so the form doesn't jump.
  function writeError(err, msg) {
    if (!err) return;
    err.textContent = msg || (err.textContent ? " " : "");
  }
  function setError(el, id, msg) {
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    writeError(errorEl(id), msg);
  }

  // Re-validate as people fix things, but don't nag while they first type.
  form.addEventListener("change", function (e) {
    var t = e.target;
    var fs = t.closest("fieldset[data-group]");
    if (fs && fs.classList.contains("fieldset-invalid")) validateGroup(fs);
    else if (t.type === "checkbox" && t.required) validateConsent(t);
    else if (t.getAttribute("aria-invalid") === "true") validateField(t);
  });
  form.addEventListener("blur", function (e) {
    var t = e.target;
    if (t.matches("input[type=text], input[type=email], input[type=tel], select, textarea") && t.getAttribute("aria-invalid") === "true") validateField(t);
  }, true);

  function runValidation() {
    var problems = [];
    form.querySelectorAll("input[type=text], input[type=email], input[type=tel], select[required], textarea[required]").forEach(function (el) {
      if (el.closest(".hp") || el.matches(":disabled")) return;
      var m = validateField(el);
      if (m) problems.push({ el: el, msg: m, name: labelText(el) });
    });
    form.querySelectorAll("fieldset[data-group][data-required]").forEach(function (fs) {
      if (fs.matches(":disabled")) return;
      var p = validateGroup(fs);
      if (p) problems.push(p);
    });
    var consent = document.getElementById("consent");
    if (consent && validateConsent(consent)) problems.push({ el: consent, msg: "Please check the box to agree to be contacted.", name: "Permission to contact you" });

    problems.sort(function (a, b) {
      return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    return problems;
  }

  function showSummary(problems) {
    var list = summary.querySelector("ul");
    list.innerHTML = "";
    problems.forEach(function (p) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + p.el.id;
      a.textContent = p.name + ": " + p.msg;
      a.addEventListener("click", function (e) { e.preventDefault(); p.el.focus(); p.el.scrollIntoView({ block: "center" }); });
      li.appendChild(a);
      list.appendChild(li);
    });
    summary.querySelector("h2").textContent =
      problems.length === 1 ? "There is 1 problem with your form" : "There are " + problems.length + " problems with your form";
    summary.hidden = false;
    summary.focus();
  }

  /* ---------- Submit ---------- */
  function collect() {
    // Combine checkbox groups into one readable line per question.
    var data = {};
    new FormData(form).forEach(function (value, key) {
      var k = key.replace(/\[\]$/, "");
      data[k] = data[k] ? data[k] + ", " + value : value;
    });
    return data;
  }

  var sending = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    var problems = runValidation();
    if (problems.length) { showSummary(problems); return; }
    summary.hidden = true;

    var data = collect();
    if (data._honey || sending) return;

    // Until the real business email is set (see README), don't pretend to send.
    if (/@example\.com/i.test(form.action)) {
      status.className = "form-status is-error";
      status.textContent = "Online quote requests aren’t switched on yet. Please call or text " + PHONE + " for your free quote.";
      return;
    }

    sending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    status.textContent = "Sending your quote request…";

    // FormSubmit's AJAX endpoint returns JSON instead of redirecting.
    fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.body.success) !== "false") {
          window.location.href = form.dataset.thanks || "../thank-you/";
        } else {
          throw new Error(res.body && res.body.message);
        }
      })
      .catch(function (err) {
        sending = false;
        var reason = (err && err.message) || "";
        status.className = "form-status is-error";
        if (/activat/i.test(reason)) {
          status.textContent = "This form isn’t activated yet. An activation email has been sent to the business inbox. Once its “Activate Form” link is clicked, please try again, or call " + PHONE + ".";
        } else {
          status.textContent = "Sorry, your request didn’t go through" + (reason && !/fetch|network|load failed/i.test(reason) ? " (" + reason + ")" : "") + ". Please try again, or call " + PHONE + ".";
        }
        submitBtn.disabled = false;
        submitBtn.textContent = DEFAULT_LABEL;
      });
  });
})();
