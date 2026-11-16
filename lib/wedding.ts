// All invitation content lives here: edit this file to customise the site.

export const wedding = {
  partner1: "Zeinab",
  partner2: "Ranil",
  monogram: ["Z", "R"] as const,

  // Public address of the site, used for guest links and link previews.
  // Leave empty to use whatever domain the admin page is opened on.
  baseUrl: "",

  eventName: "Engagement Ceremony",
  dateShort: "11 . 12 . 26",
  dateLong: "11 December 2026",
  start: "2026-12-11T09:00:00+05:30",
  end: "2026-12-11T14:00:00+05:30",

  parents: [
    // Entries left empty are hidden on the site
    { label: "Parent of Zeinab", names: "Gangani Nadeeka" },
    { label: "Parent of Ranil", names: "Jennifer" },
  ],

  venue: {
    name: "Green Court",
    area: "Homagama",
    address: "Homagama, Sri Lanka",
    mapQuery: "Green Court, Homagama, Sri Lanka",
  },

  // Order of the day, shown as cards in the Details section
  events: [
    { title: "Arrival & Welcome", time: "9:00 AM", icon: "pin", note: "Green Court, Homagama" },
    { title: "Engagement Ceremony", time: "To follow", icon: "rings", note: "The exchange of rings" },
    { title: "Celebration", time: "To follow", icon: "heart", note: "Celebrate with us" },
  ],

  // Add phone numbers like { label: "Zeinab · 07X XXX XXXX", href: "tel:07XXXXXXXX", whatsapp: false }
  contacts: [] as { label: string; href: string; whatsapp: boolean }[],

  // Dress code shown under the Details cards
  dressCode: {
    title: "Our theme colours & white",
    note: "We'd love to see you in soft lavender, mauve, plum, blush or white.",
    colors: [
      { name: "Lavender", hex: "#CFC5D8" },
      { name: "Mauve", hex: "#A497B0" },
      { name: "Plum", hex: "#6E5684" },
      { name: "Blush", hex: "#E8D9CF" },
      { name: "Taupe", hex: "#C8AA98" },
      { name: "White", hex: "#FFFFFF" },
    ],
  },

  maxGuests: 6,

  // Google Apps Script web app that saves RSVPs to the sheet (google-apps-script/Code.gs).
  // The RSVP_SCRIPT_URL environment variable overrides this.
  rsvpScriptUrl: "",
};

export const coupleNames = `${wedding.partner1} & ${wedding.partner2}`;

// Link-preview image for WhatsApp, Facebook, etc.
export const ogImage = { url: "/assets/og-image.jpg", width: 1200, height: 1200, alt: `${coupleNames} · ${wedding.eventName}` };

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(wedding.venue.mapQuery);

export const mapsEmbed =
  "https://maps.google.com/maps?q=" + encodeURIComponent(wedding.venue.mapQuery) + "&z=14&output=embed";
