import { Link } from 'wouter';
import { HeroImage } from '../components/BannerMedia';
const refrigeratedImg = `${import.meta.env.BASE_URL}hero-reefer.webp`;
const dryVanImg = `${import.meta.env.BASE_URL}hero-dryvan.webp`;
const flatbedImg = `${import.meta.env.BASE_URL}hero-flatbed.webp`;
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export default function Services() {
  const { t, language } = useI18n();
  const services = [
    {
      id: "refrigerated",
      title: t('refrigeratedFreight'),
      desc: t('refrigeratedService'),
      img: refrigeratedImg,
      reverse: false
    },
    {
      id: "dry-van",
      title: t('dryVanFreight'),
      desc: t('dryVanService'),
      img: dryVanImg,
      reverse: true
    },
    {
      id: "flatbed",
      title: t('flatbedFreight'),
      desc: t('flatbedService'),
      img: flatbedImg,
      reverse: false
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0A0E14] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0A0E14]/55 z-10" />
          <HeroImage src={`${import.meta.env.BASE_URL}hero-services.webp`} alt="Freight truck at a truck stop at dusk" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tight mb-6">
              {t('ourCapabilities')}
            </h1>
            <p className="text-xl text-gray-300 font-sans border-l-4 border-accent pl-6 mb-8">
              {t('serviceIntro')}
            </p>
          </div>
        </div>
      </section>
      {/* Services List */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 space-y-32">
          {services.map((service, idx) => (
              <div key={service.id} id={service.id} className={`flex flex-col ${service.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center scroll-mt-32`}>
              {/* Image side */}
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 translate-x-4 translate-y-4 bg-[#62c0de] z-0 rounded"></div>
                  <Link href={`/services/${service.id}-freight`} aria-label={service.title} className="block relative z-10 aspect-[4/3] bg-gray-200 overflow-hidden shadow-2xl rounded">
                    <img src={service.img} alt={service.title} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </Link>
                </div>
              </div>
              
              {/* Content side */}
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px bg-[#62c0de] flex-1"></div>
                  <span className="font-display font-bold uppercase tracking-widest text-sm text-muted-foreground">0{idx + 1}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-5 text-foreground"><Link href={`/services/${service.id}-freight`} className="hover:text-primary transition-colors">{service.title}</Link></h2>
                <p className="text-lg text-gray-600 font-sans mb-8 leading-relaxed">
                  {service.desc}
                </p>

                <Link href={`/services/${service.id}-freight`} className="flex items-center text-foreground font-display font-bold uppercase tracking-wider border-b-2 border-[#62c0de] pb-1 hover:text-[#275d87] transition-colors group w-fit">
                    {t('learnMore')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Mini CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-6">{t('specializedNeed')}</h2>
          <Link href="/contact" className="inline-flex bg-[#0A0E14] text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-white hover:text-[#0A0E14] transition-colors shadow-lg">
            {t('contactUs')}
          </Link>
        </div>
      </section>
    </div>
  );
}
