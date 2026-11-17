export type Prefix = "mr" | "mrs" | "miss" | "mrmrs" | "family" | "dear";

export const prefixOptions: { value: Prefix; label: string }[] = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "miss", label: "Miss" },
  { value: "mrmrs", label: "Mr. & Mrs." },
  { value: "family", label: "Family" },
  { value: "dear", label: "Dear" },
];

// "Dear" is only a greeting style: the message already starts with "Dear",
// so the display name is just the guest name.
export function displayName(prefix: Prefix, name: string): string {
  switch (prefix) {
    case "mr": return `Mr. ${name}`;
    case "mrs": return `Mrs. ${name}`;
    case "miss": return `Miss ${name}`;
    case "mrmrs": return `Mr. & Mrs. ${name}`;
    case "family": return `${name} and Family`;
    case "dear": return name;
  }
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 60);
}

// Guest links are {site}/{encoded display name}, e.g. /Mr.%20Sanjaya
export function guestFromParam(param: string): string {
  let name = param;
  try { name = decodeURIComponent(param); } catch { /* already decoded */ }
  return cleanName(name);
}

// Sinhala WhatsApp message. `name` is the display name; the "Dear" prefix is never
// repeated because the greeting (ආදරණීය) already adds it.
export function invitationMessage(name: string, link: string, coupleSi: string): string {
  return [
    `ආදරණීය ${name} ❤️`,
    "අපගේ Homecoming උත්සවයට ඔබව ඉතා ආදරයෙන් ආරාධනා කරන්නෙමු. අපගේ ජීවිතයේ මෙම සුවිශේෂී දිනය ඔබ සමඟ සැමරීමට අපි බලාපොරොත්තු වෙමු.",
    "ඔබගේ පැමිණීම අපට මහත් සතුටක් වනු ඇත.",
    "ආරාධනා පත්‍රය සහ සියලු විස්තර පහත සබැඳියෙන් බලන්න 🌐:",
    link,
    `ආදරයෙන්,\n❤️ ${coupleSi}`,
  ].join("\n\n");
}
