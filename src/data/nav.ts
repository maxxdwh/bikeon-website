import { getCollection } from 'astro:content';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  children?: NavLink[];
}

export async function getGuideLinks(): Promise<NavLink[]> {
  const guides = await getCollection('guide');
  return guides
    .sort((a, b) => a.data.order - b.data.order)
    .map((guide) => ({ label: guide.data.title, href: `/guide/${guide.id}` }));
}

export async function getNavItems(): Promise<NavGroup[]> {
  const guideLinks = await getGuideLinks();
  return [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Guide", href: guideLinks[0].href, children: guideLinks },
    { label: "Resources", href: "/resources" },
    { label: "Map of Schools", href: "/map" },
    { label: "Media", href: "/media" },
    { label: "Contact", href: "/contact" },
  ];
}

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
