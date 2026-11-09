import { Link } from 'wouter';
import { HeroImage } from '../components/BannerMedia';
const ctaImg = `${import.meta.env.BASE_URL}cta-band.jpg`;
const reeferImg = `${import.meta.env.BASE_URL}hero-reefer.webp`;
const dryVanImg = `${import.meta.env.BASE_URL}hero-dryvan.webp`;
const flatbedImg = '/flatbed.jpg';
import { AnimatedBeam } from '../components/AnimatedBeam';
import { ArrowDown, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import './home.css';

export default function Home() {
  const { t, language } = useI18n();
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex flex-col w-full">
      {/* Section A - Hero */}
      <section className="relative min-h-screen flex items-center pt-20 bg-[#0A0E14]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0A0E14]/70 z-10" />
          <HeroImage
            src={`${import.meta.env.BASE_URL}hero-home.webp`}
            alt={t('truckAlt')}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="home-hero-copy max-w-5xl">
            <motion.h1 
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start gap-1 font-display text-[clamp(1.75rem,7.8vw,5.625rem)] font-bold leading-[.98] text-white uppercase tracking-tight mb-4 text-left"
            >
              <span className="home-hero-headline text-[60px]">{t('homeHeadline')}</span>
              <span className="text-[#62c0de] text-[55px]">{t('homeSubheadline')}</span>
            </motion.h1>
            
            <motion.p 
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="whitespace-pre-line text-[18px] md:text-[22px] leading-snug text-[#F2EDE4] font-sans max-w-2xl mb-5 border-l-4 border-accent pl-6"
            >
              {t('homeIntro')}
            </motion.p>
            
            <motion.div 
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/quote" className="inline-flex h-12 w-44 max-w-full shrink-0 items-center justify-center border-2 border-transparent bg-accent hover:bg-white text-[#0A0E14] px-3 rounded font-display font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 text-center shadow-lg">
                {t('quote')}
              </Link>
              <Link href="/services" className="inline-flex h-12 w-44 max-w-full shrink-0 items-center justify-center bg-transparent border-2 border-white hover:bg-white/10 text-white px-3 rounded font-display font-bold uppercase tracking-widest text-sm transition-all hover:-translate-y-1 text-center backdrop-blur-sm">
                {t('ourServices')}
              </Link>
            </motion.div>
          </div>
        </div>

      </section>
      {/* Section B - Animated Route Beam */}
      <AnimatedBeam height={900} framing="cover" zoom={1} />
      {/* Section C - Services Cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground uppercase mb-4">{t('capabilities')}</h2>
              <p className="text-lg text-muted-foreground font-sans">{t('capabilitiesIntro')}</p>
            </div>
            <Link href="/services">
              <span className="hidden md:flex items-center text-primary font-bold uppercase tracking-wider hover:text-accent transition-colors cursor-pointer group mt-4 md:mt-0">
                {t('ourServices')}
                <Navigation className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 auto-rows-fr md:grid-cols-3 gap-8">
            {[
              {
                title: t('refrigeratedFreight'),
                desc: t('refrigeratedHomeDescription'),
                img: reeferImg,
                href: '/services/refrigerated-freight',
                accent: 'hsl(var(--primary))'
              },
              {
                title: t('dryVan'),
                desc: t('dryVanDescription'),
                img: dryVanImg,
                href: '/services/dry-van-freight',
                accent: 'hsl(var(--primary))'
              },
              {
                title: t('flatbed'),
                desc: t('flatbedDescription'),
                img: flatbedImg,
                href: '/services/flatbed-freight',
                accent: 'hsl(var(--primary))'
              }
            ].map((service, i) => (
              <div key={i} className="group flex h-full flex-col bg-white shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 relative border border-gray-100 rounded">
                <div className="absolute top-0 bottom-0 left-0 w-2 z-20 bg-[f07167] border-t-[#0a0e14] border-r-[#0a0e14] border-b-[#0a0e14] border-l-[#0a0e14]" style={{ backgroundColor: service.accent }}></div>
                <div className="h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#0A0E14]/20 group-hover:bg-transparent transition-all z-10"></div>
                  <img src={service.img} alt={service.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 pl-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-display font-bold uppercase mb-3">{service.title}</h3>
                  <p className="text-gray-600 font-sans mb-8 flex-1 leading-relaxed">{service.desc}</p>
                  <Link href={service.href} className="text-left font-bold uppercase text-sm tracking-wider flex items-center group/btn text-foreground hover:text-primary transition-colors mt-auto">
                    {t('learnMore')}
                    <ArrowDown className="w-4 h-4 ml-2 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section E - CTA Band */}
      <section className="relative py-32 flex items-center justify-center border-t border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0A0E14]/85 z-10" />
          <img 
            src={ctaImg}
            loading="lazy"
            decoding="async"
              alt={t('warehouseAlt')}
            className="w-full h-full object-cover grayscale opacity-50"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase mb-6 tracking-tight">
            {t('readyMove')}
          </h2>
          <p className="text-xl text-gray-300 font-sans max-w-2xl mx-auto mb-10 font-light">{t('homeCtaBody')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/quote">
              <button className="bg-accent hover:bg-white text-[#0A0E14] px-8 py-4 rounded font-display font-bold uppercase tracking-widest text-lg transition-all hover:-translate-y-1 shadow-lg w-full sm:w-auto">
                {t('quote')}
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-transparent border-2 border-white hover:bg-white text-white hover:text-[#0A0E14] px-8 py-4 rounded font-display font-bold uppercase tracking-widest text-lg transition-all w-full sm:w-auto">
                {t('contactUs')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
