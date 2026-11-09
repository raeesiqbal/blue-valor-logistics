import { Link } from 'wouter';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export function Footer() {
  const { t, language } = useI18n();
  return (
    <footer className="bg-[#0A0E14] text-[#F2EDE4] pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="flex flex-col">
            <Link href="/" aria-label="Blue Valor Logistics home" className="inline-flex w-fit mb-5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <img src={`${import.meta.env.BASE_URL}blue-valor-logo.png`} alt="Blue Valor Logistics" className="w-[190px] h-auto" />
            </Link>
            <p className="text-sm text-gray-400 mb-6 font-sans">
              {t('footerAbout')}
            </p>
            <div className="space-y-3">
              <div className="flex items-start text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Fort Myers, FL</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-accent shrink-0" />
                <a className="text-sm hover:text-accent transition-colors" href="tel:+12393085789">(239) 308-5789</a>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-accent shrink-0" />
                <a className="text-sm hover:text-accent transition-colors" href="mailto:info@bluevalorlogistics.com">info@bluevalorlogistics.com</a>
              </div>
              <a href="https://www.linkedin.com/company/blue-valor-logistics" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-accent transition-colors w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Blue Valor Logistics on LinkedIn (opens in a new tab)">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 text-accent fill-current"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.74H4.96V9.18h2.97v9.56ZM6.45 7.87a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.29 10.87h-2.96v-4.65c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.48V9.18h2.84v1.31h.04c.4-.75 1.36-1.55 2.8-1.55 2.99 0 3.55 1.97 3.55 4.54v5.26Z"/></svg>
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div>
            <h4 className="font-display text-lg font-bold uppercase tracking-wider mb-6 text-white">{t('services')}</h4>
            <ul className="space-y-3">
              <li><Link href="/services/refrigerated-freight" className="text-gray-400 hover:text-accent transition-colors text-sm">{t('refrigeratedFreight')}</Link></li>
              <li><Link href="/services/dry-van-freight"><span className="text-gray-400 hover:text-accent transition-colors cursor-pointer text-sm">{t('dryVanFreight')}</span></Link></li>
              <li><Link href="/services/flatbed-freight"><span className="text-gray-400 hover:text-accent transition-colors cursor-pointer text-sm">{t('flatbedFreight')}</span></Link></li>
              <li><Link href="/quote"><span className="text-gray-400 hover:text-accent transition-colors cursor-pointer text-sm">{t('requestAQuote')}</span></Link></li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div>
            <h4 className="font-display text-lg font-bold uppercase tracking-wider mb-6 text-white">{language === 'es' ? 'Empresa' : 'Company'}</h4>
            <ul className="space-y-3">
              <li><Link href="/about"><span className="text-gray-400 hover:text-accent transition-colors cursor-pointer text-sm">{t('about')}</span></Link></li>
              <li><Link href="/shippers"><span className="text-gray-400 hover:text-accent transition-colors cursor-pointer text-sm">{t('shippers')}</span></Link></li>
              <li><Link href="/carriers"><span className="text-gray-400 hover:text-accent transition-colors cursor-pointer text-sm">{t('carriers')}</span></Link></li>
              <li><Link href="/contact"><span className="text-gray-400 hover:text-accent transition-colors cursor-pointer text-sm">{t('contact')}</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold uppercase tracking-wider mb-6 text-white">{language === 'es' ? 'Recursos' : 'Resources'}</h4>
            <ul className="space-y-3">
              <li><Link href="/shippers#faq" className="text-gray-400 hover:text-accent transition-colors text-sm">{language === 'es' ? 'Preguntas de transportadores' : 'Shipper FAQ'}</Link></li>
              <li><Link href="/carriers#requirements" className="text-gray-400 hover:text-accent transition-colors text-sm">{language === 'es' ? 'Requisitos para transportistas' : 'Carrier Requirements'}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Blue Valor Logistics LLC. {t('rightsReserved')}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <span aria-hidden="true" className="text-xs text-gray-500">·</span>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link href="/404"><span className="text-xs text-gray-500 hover:text-white cursor-pointer transition-colors">{t('accessibility')}</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
