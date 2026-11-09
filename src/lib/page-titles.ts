export const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/services': 'Services',
  '/services/refrigerated-freight': 'Refrigerated Freight',
  '/services/dry-van-freight': 'Dry Van Freight',
  '/services/flatbed-freight': 'Flatbed Freight',
  '/shippers': 'Shippers',
  '/carriers': 'Carriers',
  '/about': 'About',
  '/contact': 'Contact',
  '/quote': 'Request a Quote',
  '/privacy-policy': 'Privacy Policy',
  '/terms': 'Terms & Conditions',
  '/banner-preview': 'Banner Preview',
  '/map-preview': 'Map Size Preview',
  '/shippers/admin': 'Shipper Administration',
};

export function getPageTitle(path: string) {
  const cleanPath = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return `${pageTitles[cleanPath] ?? 'Page Not Found'} | Blue Valor Logistics`;
}
