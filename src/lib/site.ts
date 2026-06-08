export const SITE = {
  name: "Fooliosity",
  title: "Fooliosity",
  description: "Ian Rastall's public personal publication site for long-form writing.",
  url: "https://ianrastall.github.io",
  author: "Ian Rastall",
  locale: "en-US",
  timezone: "America/Chicago"
} as const;

export const NAV_ITEMS = [
  { href: "/archive/", label: "Archive" },
  { href: "/categories/", label: "Categories" },
  { href: "/tags/", label: "Tags" },
  { href: "/search/", label: "Search" },
  { href: "/about/", label: "About" }
] as const;
