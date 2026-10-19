/* =====================================================================
   ESTIMATED PRICING — the only place prices live.
   Edit the numbers below and every price on the site updates:
   the "starting at" prices on Home and Services, the price table on
   Services, and the live estimate on the Quote page.

   These are STARTING ESTIMATES, not final prices. Ashley confirms the
   final price after reviewing each request.
   ===================================================================== */
window.ASCC_PRICING = {
  /* Routine (standard) cleaning, one visit, by home size.
     Keys match the "Approximate square footage" choices on the Quote page. */
  base: {
    "Under 1,000 sq ft":   110,
    "1,000–1,499 sq ft":   135,
    "1,500–1,999 sq ft":   160,
    "2,000–2,499 sq ft":   190,
    "2,500–2,999 sq ft":   220,
    "3,000–3,999 sq ft":   270,
    "4,000+ sq ft":        330
  },

  /* If someone picks "Not sure" for size, estimate from bedrooms. */
  sizeFromBedrooms: {
    "Studio":      "Under 1,000 sq ft",
    "1 bedroom":   "Under 1,000 sq ft",
    "2 bedrooms":  "1,000–1,499 sq ft",
    "3 bedrooms":  "1,500–1,999 sq ft",
    "4 bedrooms":  "2,000–2,499 sq ft",
    "5+ bedrooms": "3,000–3,999 sq ft"
  },

  /* Bathrooms: the first full bath is included in the base price. */
  bathrooms: {
    "1": 0, "1.5": 10, "2": 20, "2.5": 30, "3": 40, "3.5": 50, "4+": 65
  },

  /* Service type multiplies the base price. */
  service: {
    "Routine cleaning":            { multiplier: 1.0 },
    "Deep cleaning":               { multiplier: 1.6 },
    "Move-in / move-out cleaning": { multiplier: 1.8 },
    "Not sure, help me choose":    { multiplier: 1.0 }   /* estimated as routine */
  },

  /* Recurring discounts (percent off each visit). */
  frequency: {
    "One time":       0,
    "Every week":     15,
    "Every 2 weeks":  10,
    "Every 4 weeks":  5
  },

  /* Home condition adjustment (percent added). */
  condition: {
    "Well kept":               0,
    "Average":                 0,
    "Needs extra attention":   20
  },

  /* Pets (flat amount added). */
  pets: {
    "No pets": 0, "1 pet": 10, "2 or more pets": 20
  },

  /* Add-ons (flat amount added per visit). Keys match the Quote page checkboxes. */
  addons: {
    "Inside oven":              30,
    "Inside refrigerator":      30,
    "Inside cabinets":          40,
    "Baseboards":               25,
    "Blinds":                   25,
    "Walls (spot cleaning)":    30,
    "Laundry (wash & fold)":    25,
    "Garage sweep-out":         25,
    "Porch or patio sweep":     20
  },

  /* Add-ons priced by how many. */
  windows: {          /* interior windows, glass + sills */
    "1–5 windows":    25,
    "6–10 windows":   45,
    "11–20 windows":  80,
    "21+ windows":    120
  },
  carpet: {           /* carpet shampoo, per room */
    perRoom: 35,
    rooms: { "1 room": 1, "2 rooms": 2, "3 rooms": 3, "4 rooms": 4, "5+ rooms": 5 }
  },

  /* Deep and move-in/move-out cleans already include these. */
  includedIn: {
    "Deep cleaning":               ["Baseboards", "Blinds"],
    "Move-in / move-out cleaning": ["Baseboards", "Blinds", "Inside cabinets", "Inside oven", "Inside refrigerator"]
  },

  /* The estimate shows a range around the calculated price. */
  range: { low: 0.9, high: 1.15, roundTo: 5 },

  /* Smallest price shown for any visit. */
  minimum: 100
};
