import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: t('home'), href: '/' },
    { name: t('services'), href: '/services' },
    { name: t('shippers'), href: '/shippers' },
    { name: t('carriers'), href: '/carriers' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  };
  const serviceLinks = [
    { name: t('refrigeratedFreight'), href: '/services/refrigerated-freight' },
    { name: t('dryVanFreight'), href: '/services/dry-van-freight' },
    { name: t('flatbedFreight'), href: '/services/flatbed-freight' },
  ];
  const isActive = (href: string) => location === href || (href === '/services' && location.startsWith('/services/'));

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main Nav */}
      <nav 
        className={`relative z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0A0E14]/95 backdrop-blur-md shadow-md py-3' 
            : 'bg-gradient-to-b from-[#0A0E14]/80 to-transparent py-5'
        }`}
      >
        <div className="w-full px-4 md:px-8 flex items-center justify-between xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* Logo */}
          <Link href="/" onClick={handleLinkClick} aria-label="Blue Valor Logistics home" className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <img src={`${import.meta.env.BASE_URL}blue-valor-logo.png`} alt="Blue Valor Logistics" className="w-[156px] sm:w-[184px] h-auto" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center justify-center gap-9 2xl:gap-12">
            {links.map((link) => (
              link.href === '/services' ? (
                <div key={link.href} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { setServicesOpen(false); event.currentTarget.querySelector('button')?.focus(); } }}>
                  <div className="flex items-center gap-1">
                    <Link href={link.href} onClick={handleLinkClick} className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${isActive(link.href) ? 'text-primary' : 'text-[#F2EDE4]'}`}>{link.name}</Link>
                    <button type="button" aria-label={language === 'es' ? 'Mostrar servicios' : 'Show service pages'} aria-expanded={servicesOpen} aria-controls="desktop-service-links" onClick={() => setServicesOpen(open => !open)} className="p-1 text-white hover:text-primary"><ChevronDown size={12} /></button>
                  </div>
                  {servicesOpen && <div id="desktop-service-links" className="absolute -left-[25px] top-full w-64 pt-3"><div className="rounded border border-white/10 bg-[#0A0E14] p-2 shadow-xl">
                    {serviceLinks.map(service => <Link key={service.href} href={service.href} onClick={handleLinkClick} className={`block rounded px-4 py-3 text-sm hover:bg-white/5 hover:text-primary focus-visible:text-primary ${location === service.href ? 'text-primary' : 'text-white'}`}>{service.name}</Link>)}
                  </div></div>}
                </div>
              ) : <Link key={link.name} href={link.href} onClick={handleLinkClick}>
                <span className={`text-sm font-medium uppercase tracking-wider cursor-pointer transition-colors hover:text-primary ${
                  isActive(link.href) ? 'text-primary' : 'text-[#F2EDE4]'
                }`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center justify-self-end gap-3">
            <a href="tel:+12393085789" aria-label="(239) 308-5789" className="flex items-center text-[#F2EDE4] hover:text-accent transition-colors">
              <Phone className="w-4 h-4 2xl:mr-2" />
              <span className="hidden 2xl:inline text-sm font-bold whitespace-nowrap">(239) 308-5789</span>
            </a>
            <Link href="/quote" onClick={handleLinkClick} className="flex h-10 items-center whitespace-nowrap rounded bg-accent px-4 py-2.5 font-display font-bold uppercase tracking-wider text-sm text-white shadow-md hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{t('quote')}</Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="xl:hidden text-[#F2EDE4] hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 right-0 bg-[#0A0E14] border-t border-white/10 shadow-xl flex flex-col p-4 animate-in slide-in-from-top-2">
            {links.map((link) => (
              <div key={link.name}>
              <Link href={link.href} onClick={handleLinkClick}>
                <span className={`block py-4 border-b border-white/5 text-lg font-display uppercase tracking-wider ${
                  isActive(link.href) ? 'text-primary' : 'text-[#F2EDE4]'
                }`}>
                  {link.name}
                </span>
              </Link>
              {link.href === '/services' && <details className="border-b border-white/5 text-white">
                <summary className="cursor-pointer py-2 pl-3 text-sm text-primary">{language === 'es' ? 'Ver servicios' : 'Explore services'}</summary>
                {serviceLinks.map(service => <Link key={service.href} href={service.href} onClick={handleLinkClick} className={`block py-3 pl-6 text-sm hover:text-primary ${location === service.href ? 'text-primary' : 'text-white'}`}>{service.name}</Link>)}
              </details>}
              </div>
            ))}
            <div className="mt-6 flex flex-col gap-4">
            <a href="tel:+12393085789" className="flex items-center justify-center text-[#F2EDE4] bg-white/5 py-3 rounded">
                <Phone className="w-5 h-5 mr-2" />
                <span className="font-bold">(239) 308-5789</span>
              </a>
              <Link href="/quote" onClick={handleLinkClick} className="flex h-14 w-full items-center justify-center bg-accent text-white rounded font-display font-bold uppercase tracking-wider text-base text-center">
                  {t('quote')}
              </Link>
            </div>
          </div>
        )}
      </nav>
      </div>
    </>
  );
}
