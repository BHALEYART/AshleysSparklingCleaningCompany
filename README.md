# Ashley's Sparkling Cleaning Company

Static website for Ashley's Sparkling Cleaning Company. Plain HTML, one CSS file, two small JS files — no build step, no frameworks. Works on GitHub Pages now and Vercel later with no changes.

## Pages

| Path | Purpose |
|---|---|
| `/` | Home: hero with quick-quote card, services, how it works, $25 referral offer |
| `/services/` | Service details, estimated pricing table (`#pricing`), FAQ (`#faq`) |
| `/quote/` | Free quote form with checkboxes and a live estimate |
| `/thank-you/` | Form confirmation (noindex) |
| `/accessibility/`, `/privacy/` | Statements |
| `404.html` | Not-found page (works under the GitHub Pages project path and on Vercel) |

## Placeholders to fill in before launch

Search the repo for **`example.com`** — every placeholder uses it.

| Placeholder | Replace with | Where |
|---|---|---|
| `hello@example.com` | Ashley's business email | Footer, accessibility/privacy pages, and the quote form's `action` (`https://formsubmit.co/hello@example.com`) |
| `https://www.example.com` | The real domain | `<link rel="canonical">`, Open Graph tags, JSON-LD, the form's `_next` field, `sitemap.xml`, `robots.txt`, `llms.txt` |
| `https://www.facebook.com/` | Facebook page URL | Footer social links (every page) |
| `https://www.instagram.com/` | Instagram profile URL | Footer social links (every page) |

While the form email is still the placeholder, the form will **not** try to send; it tells visitors to call or text instead.

Once the email and social links are real, add `"email"` and `"sameAs": ["<facebook>", "<instagram>"]` to the `LocalBusiness` block in each page's JSON-LD.

**Also confirm with Ashley:** the service area (currently "Southeast Michigan" in the footer), what each service includes (the lists on `/services/`), which add-ons she offers, and how the $25 referral discount is applied.

## Pricing (estimates)

All prices live in **`assets/js/pricing.js`** — base price by square footage, bathroom add-on, service multipliers (deep ×1.6, move-in/out ×1.8), recurring discounts, pets, condition, add-ons, windows, carpet per room, and the range shown (−10% / +15%).

Editing that one file updates the live estimate on `/quote/`, the "starting at" prices on Home and Services, and the Services pricing table. The HTML also contains the current numbers as a no-JavaScript fallback; if prices change a lot, update those too (search for `from $`).

**The current numbers are placeholders for Ashley to review.** The site labels every price as an estimate, and the submitted estimate is included in the email so Ashley sees what the customer saw.

## Quote form

Requests are emailed through [FormSubmit](https://formsubmit.co) (no account or key).

1. Replace `hello@example.com` in the form `action` on `quote/index.html`.
2. Submit one test request. FormSubmit emails a one-time **activation link** to that inbox; click it before launch or requests won't be delivered.
3. Optional: after activating, swap the email in `action` for the random alias FormSubmit gives you so the address isn't in the page source.

The email arrives as a table with every answer, including the online estimate, add-ons, rooms, and who referred them.

## Deploy

**GitHub Pages (now):** Settings → Pages → Source: *Deploy from a branch* → `main` / root. The site is at `https://bhaleyart.github.io/AshleysSparklingCleaningCompany/`. All links are relative, so it works under that sub-path. `.nojekyll` makes Pages serve files as-is.

**Vercel (later):** Import the repo (framework *Other*, no build command, output directory `.`), add the domain, update DNS. `vercel.json` sets clean URLs, security headers (including a CSP that allows FormSubmit), and caching.

**After the domain is live:** verify it in Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`. Set up a Google Business Profile with the same name and phone (248-924-4573).

## Editing

Edit the HTML directly. Header, footer, and JSON-LD are repeated in each page, so change them everywhere. When you change `site.css`, `site.js`, or `pricing.js`, bump its `?v=` value on every page so browsers fetch the new copy. Update `<lastmod>` in `sitemap.xml` when page content changes.

## Accessibility

Targets WCAG 2.2 AA: skip link, landmarks, logical headings, keyboard-operable menu (Esc closes), visible focus, AA contrast, 44px+ touch targets, labelled and grouped form fields, an error summary plus inline errors announced to screen readers, a live-region estimate, follow-up questions that are disabled when hidden, reduced-motion and forced-colors support, and decorative sparkles hidden from assistive tech.

## Credits

Accent font: Dancing Script, self-hosted, SIL Open Font License (`assets/fonts/OFL.txt`).
