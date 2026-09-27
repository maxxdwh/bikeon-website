export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  children?: NavLink[];
}

export const navItems: NavGroup[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Guide",
    href: "/guide/introduction",
    children: [
      { label: "Start here", href: "/guide/introduction" },
      { label: "Bikes", href: "/guide/bikes" },
      { label: "Helmets", href: "/guide/helmets" },
      { label: "Bike storage", href: "/guide/bike-storage" },
      { label: "Bike tracks", href: "/guide/bike-tracks" },
      { label: "Cycle skills training", href: "/guide/cycle-skills-training" },
      { label: "Costs and funding", href: "/guide/costs-and-funding" },
      { label: "Maintenance", href: "/guide/maintenance" },
    ],
  },
  { label: "Resources", href: "/resources" },
  { label: "Map of Schools", href: "/map" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export const guideLinks: NavLink[] = [
  { label: "Start here", href: "/guide/introduction" },
  { label: "Bikes", href: "/guide/bikes" },
  { label: "Helmets", href: "/guide/helmets" },
  { label: "Bike storage", href: "/guide/bike-storage" },
  { label: "Bike tracks", href: "/guide/bike-tracks" },
  { label: "Cycle skills training", href: "/guide/cycle-skills-training" },
  { label: "Costs and funding", href: "/guide/costs-and-funding" },
  { label: "Maintenance", href: "/guide/maintenance" },
];

export const quickLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Map of Schools", href: "/map" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: NavLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/bikesinschools/" },
  { label: "YouTube", href: "https://www.youtube.com/@bikesinschoolsnz" },
];
