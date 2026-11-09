import { Link } from 'wouter';
import { useEffect } from 'react';
import { HeroVideo } from '../components/BannerMedia';
import { ArrowRight, ClipboardCheck, FileCheck2, Mail, MapPinned, MessageCircle, PhoneCall, ShieldCheck, UserRound } from 'lucide-react';
import { useI18n } from '../lib/i18n';

const copy = {
  en: {
    heroLabel: 'SHIP WITH US',
    heroTitle: 'THE PERSONAL SIDE OF FREIGHT.',
    heroIntro: "From your very first quote to the signed delivery receipt, one dedicated contact will know your freight and care about your business. We're here to make shipping easier and more personal. We don't measure success by loads moved. We measure it by how happy you are working with us.",
    whyTitle: 'WHAT YOU CAN COUNT ON',
    whyIntro: "Here's what comes standard with every load we handle.",
    benefits: [
      { title: 'ONE POINT OF CONTACT', body: 'The person who quotes your freight is the same person who manages it through delivery. No call centers, scripts, or handoffs.', icon: UserRound },
      { title: 'YOUR PROCESS, NOT OURS', body: 'Your update schedule, your paperwork, your appointment rules. We learn how you operate and work around it.', icon: ClipboardCheck },
      { title: 'VETTED CARRIERS', body: 'Every carrier is checked for active authority, verified insurance, and safety history before they touch your freight.', icon: ShieldCheck },
      { title: 'CLEAR RATES, NO SURPRISES', body: 'Your rate and any accessorials are confirmed in writing before pickup, and your invoice matches what you agreed to.', icon: FileCheck2 },
    ],
    quoteTitle: 'WHAT WE NEED TO QUOTE',
    quoteIntro: 'Have these details ready and we can get you a rate quickly:',
    details: [
      'Pickup and delivery locations',
      'Pickup date and delivery window',
      'Equipment type (refrigerated, dry van, or flatbed)',
      'Commodity and approximate weight',
      'Special requirements (temperature, tarps, appointments)',
    ],
    requestQuote: 'REQUEST A QUOTE',
    talkTitle: 'PREFER TO TALK IT THROUGH?',
    talkBody: "Call or email and we'll walk through your freight together.",
    phone: '(239) 308-5789',
    email: 'info@bluevalorlogistics.com',
    returningTitle: 'SHIP THE SAME LANE REGULARLY?',
    returningBody: "Let's build a consistent plan around your recurring freight, with the same contact, dependable capacity, and rates you can plan around.",
    contact: "LET'S TALK",
    faqTitle: 'SHIPPER FAQ',
    faqs: [
      { q: 'Are you a broker or a carrier?', a: "Blue Valor Logistics is a licensed freight broker, not a carrier. As your broker, we don't own trucks. Instead, we find the right carrier for your freight, arrange the shipment, and manage it for you from pickup to delivery." },
      { q: 'What kind of freight do you move?', a: "We arrange flatbed, dry van, and refrigerated freight nationwide, including building materials, lumber, steel, machinery, packaged and consumer goods, fresh produce, frozen and chilled freight, dairy, meat and seafood, and beverages. If your freight isn't listed here, reach out and let us know. We'd be glad to see how we can work with you." },
      { q: 'What areas do you cover?', a: "Wherever your freight needs to go in the lower 48, we can get it there. Jacksonville to Seattle, Chicago to Dallas, big cities and small towns alike. And yes, even Topeka. Especially Topeka." },
      { q: 'How do I get set up as a new shipper?', a: "Getting started is simple. Request a quote with your lane and freight details, and we'll come back with a rate. Once you're ready to book, we'll email you our shipper onboarding packet, which includes our shipper agreement, terms and conditions, and a quick credit setup. As soon as your packet is returned and approved, we'll schedule your first load and take it from there." },
      { q: 'How will I get updates on my shipment?', a: "You'll never have to wonder where your freight is. Consistent communication is our standard on every load, with updates at pickup, while in transit, at key points along the route, and at delivery. If you have a preferred way to stay in touch, whether that's calls, texts, or emails, or you'd like updates more often, just let us know. We'll tailor our updates to fit your preferences, but our commitment to keeping you updated and fully informed from start to finish never changes." },
       { q: 'How do refrigerated loads work?', a: "Before booking, we confirm your set temperature, pre-cool requirements, and whether the unit runs continuous or start-stop, and all of it is written on the rate confirmation. Not sure what your freight needs? We'll help you figure it out." },
    ],
  },
  es: {
    heroLabel: 'ENVÍE CON NOSOTROS',
    heroTitle: 'EL LADO PERSONAL DEL TRANSPORTE.',
    heroIntro: 'Desde su primera cotización hasta el comprobante de entrega firmado, trabajará con una persona dedicada que conoce su carga y su empresa. Creemos que enviar carga debe sentirse como una colaboración, no una transacción. Eso significa responder cuando llama, decirle la verdad cuando cambian los planes y tratar cada carga como si llevara nuestro nombre. Cuando su carga llega a tiempo y sus clientes están satisfechos, así medimos el éxito.',
    whyTitle: 'LO QUE PUEDE ESPERAR',
    whyIntro: 'Trabajar con nosotros debe ser fácil. Estos son los compromisos detrás de cada carga que gestionamos para usted.',
    benefits: [
      { title: 'UN SOLO CONTACTO', body: 'La persona que cotiza su carga es la misma que la gestiona hasta la entrega. Sin centros de llamadas ni transferencias.', icon: UserRound },
      { title: 'SU PROCESO, NO EL NUESTRO', body: 'Su frecuencia de actualizaciones, sus documentos y sus reglas para citas. Aprendemos cómo opera y trabajamos a su manera.', icon: ClipboardCheck },
      { title: 'TRANSPORTISTAS VERIFICADOS', body: 'Verificamos la autoridad activa, el seguro y el historial de seguridad de cada transportista antes de asignarle su carga.', icon: ShieldCheck },
      { title: 'TARIFAS CLARAS, SIN SORPRESAS', body: 'Confirmamos por escrito la tarifa y cualquier cargo adicional antes de la recolección. Su factura coincide con lo acordado.', icon: FileCheck2 },
    ],
    quoteTitle: 'QUÉ NECESITAMOS PARA COTIZAR',
    quoteIntro: 'Tenga estos detalles a mano y podremos ofrecerle una tarifa rápidamente:',
    details: [
      'Lugares de recolección y entrega',
      'Fecha de recolección y ventana de entrega',
      'Tipo de equipo (refrigerado, caja seca o plataforma)',
      'Mercancía y peso aproximado',
      'Requisitos especiales (temperatura, lonas, citas)',
    ],
    requestQuote: 'SOLICITAR UNA COTIZACIÓN',
    talkTitle: '¿PREFIERE CONVERSARLO?',
    talkBody: 'Llámenos o escríbanos y revisaremos juntos los detalles de su carga.',
    phone: '(239) 308-5789',
    email: 'info@bluevalorlogistics.com',
    returningTitle: '¿ENVÍA POR LA MISMA RUTA CON REGULARIDAD?',
    returningBody: 'Creemos un plan constante para sus envíos recurrentes, con el mismo contacto, capacidad confiable y tarifas que le permitan planificar.',
    contact: 'HABLEMOS',
    faqTitle: 'PREGUNTAS FRECUENTES',
    faqs: [
      { q: '¿Son una agencia o una empresa transportista?', a: 'Blue Valor Logistics es una agencia de carga autorizada. No tenemos camiones propios. Coordinamos su envío con transportistas autorizados y verificados, y lo gestionamos desde la recolección hasta la entrega.' },
      { q: '¿Qué tipo de carga transportan?', a: 'Carga completa refrigerada, en caja seca y plataforma, incluidos productos agrícolas, congelados y refrigerados, productos empacados y de consumo, materiales de construcción, acero y maquinaria.' },
      { q: '¿Qué zonas cubren?', a: 'Coordinamos cargas de camión completo en todo el territorio continental de Estados Unidos, desde rutas regionales hasta recorridos de costa a costa.' },
      { q: '¿Cómo puedo registrarme como nuevo embarcador?', a: 'Solicite una cotización y, cuando esté listo para reservar, le enviaremos por correo electrónico un sencillo proceso de crédito antes de su primer envío.' },
      { q: '¿Cómo recibiré actualizaciones sobre mi envío?', a: 'Como usted prefiera. Díganos si desea llamadas, mensajes de texto o correos electrónicos, y con qué frecuencia, y así le mantendremos informado.' },
      { q: '¿Cómo funcionan los envíos refrigerados?', a: 'Antes de la recolección, confirmamos por escrito en la confirmación de tarifa la temperatura requerida, el preenfriamiento y el modo de la unidad (continuo o de arranque y parada).' },
    ],
  },
} as const;

export default function Shippers() {
  const { language } = useI18n();
  const t = copy[language];
  useEffect(() => {
    const updates = [
      ['meta[name="description"]', t.heroIntro],
      ['meta[property="og:title"]', document.title],
      ['meta[property="og:description"]', t.heroIntro],
      ['meta[name="twitter:title"]', document.title],
      ['meta[name="twitter:description"]', t.heroIntro],
    ].map(([selector, content]) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previous = element?.content;
      if (element) element.content = content;
      return { element, previous };
    });
    return () => {
      for (const { element, previous } of updates) {
        if (element && previous !== undefined) element.content = previous;
      }
    };
  }, [language, t.heroIntro]);

  return (
    <div className="w-full bg-background">
      <section className="relative isolate flex min-h-[400px] items-center overflow-hidden bg-[#0A0E14] pt-28 pb-16 text-white sm:min-h-[440px] sm:pt-32 md:min-h-[480px] md:pb-20">
        <HeroVideo
          poster={`${import.meta.env.BASE_URL}shipper-video-poster.webp`}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          aria-hidden="true"
          className="absolute -left-[10%] top-[85%] -z-20 h-auto min-h-[152%] w-[120%] max-w-none -translate-y-[56.2%] object-cover"
        >
          <source src={`${import.meta.env.BASE_URL}shipper-banner.webm`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}shipper-banner.mp4`} type="video/mp4" />
        </HeroVideo>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
        <div className="container relative z-10 mx-auto px-4 text-center md:px-8">
          <p className="mb-3 font-display text-[18px] font-bold uppercase tracking-[.2em] text-white sm:text-[20px]">{t.heroLabel}</p>
          <h1 className="mx-auto mb-4 max-w-5xl font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl">{t.heroTitle}</h1>
          <p className="mx-auto max-w-3xl font-sans text-base leading-7 text-white sm:text-xl sm:leading-8">{t.heroIntro}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="w-full lg:w-5/12">
            <h2 className="mb-5 font-display text-3xl font-bold uppercase text-primary sm:text-4xl">{t.whyTitle}</h2>
            <p className="mb-8 max-w-xl font-sans text-lg leading-relaxed text-muted-foreground">{t.whyIntro}</p>
            <div className="space-y-5">
              {t.benefits.map((benefit, index) => (
                <article key={benefit.title} data-testid={`benefit-shipper-${index + 1}`} className="group flex rounded border border-border/70 bg-card p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[#275d87] transition-colors group-hover:bg-accent/30">
                    <benefit.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-sans text-lg font-bold text-foreground">{benefit.title}</h3>
                    <p className="font-sans text-sm leading-6 text-muted-foreground">{benefit.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-7/12">
            <section className="h-full rounded border border-border/70 border-t-4 border-t-primary bg-card p-6 shadow-xl sm:p-8 md:p-10">
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-accent/15 text-primary">
                  <MapPinned className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mb-3 font-display text-4xl font-bold uppercase leading-tight text-foreground sm:text-[2.65rem]">{t.quoteTitle}</h2>
                <p className="font-sans text-lg leading-7 text-muted-foreground">{t.quoteIntro}</p>
              </div>
              <ul className="mb-8 space-y-5">
                {t.details.map((detail, index) => (
                  <li key={detail} className="flex items-start gap-4 font-sans text-base leading-7 text-foreground sm:text-[17px]">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-primary">
                      <span className="sr-only">{language === 'es' ? 'Listo:' : 'Included:'}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span data-testid={`quote-detail-${index + 1}`}>{detail}</span>
                  </li>
                ))}
              </ul>
              <Link href="/quote" data-testid="link-request-quote" className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded bg-primary px-6 py-4 text-center font-display text-base font-bold uppercase tracking-[.12em] text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#275d87] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                {t.requestQuote}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-2 font-display text-lg font-bold uppercase tracking-[.12em] text-primary">{t.talkTitle}</h3>
                <p className="mb-4 font-sans text-sm leading-6 text-muted-foreground sm:text-base">{t.talkBody}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
                  <a href="tel:+12393085789" data-testid="link-quote-card-phone" className="inline-flex items-center gap-2 font-sans text-base font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <PhoneCall className="h-4 w-4 text-primary" aria-hidden="true" />{t.phone}
                  </a>
                  <a href="mailto:info@bluevalorlogistics.com" data-testid="link-quote-card-email" className="inline-flex items-center gap-2 break-all font-sans text-base font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{t.email}
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-9">
          <div className="max-w-3xl">
            <h2 className="mb-2 font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">{t.returningTitle}</h2>
            <p className="font-sans text-sm leading-6 text-white/90 sm:text-base">{t.returningBody}</p>
          </div>
          <Link href="/contact" data-testid="link-talk-shippers" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded bg-white px-6 py-3 text-center font-display text-sm font-bold uppercase tracking-wider text-[#142331] transition-colors hover:bg-[#e8f3f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
            {t.contact}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="faq" className="container mx-auto scroll-mt-24 px-4 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-7 flex items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="mb-2 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[.18em] text-primary">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {language === 'es' ? 'Respuestas rápidas' : 'Quick answers'}
              </p>
              <h2 className="font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">{t.faqTitle}</h2>
            </div>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {t.faqs.map((faq, index) => (
              <details key={faq.q} data-testid={`faq-item-${index + 1}`} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-display text-lg font-bold uppercase text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:text-xl">
                  <span>{faq.q}</span>
                  <span aria-hidden="true" className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary transition-transform duration-200 group-open:rotate-45">
                    <span className="absolute h-[1.5px] w-3 bg-current" />
                    <span className="absolute h-3 w-[1.5px] bg-current" />
                  </span>
                </summary>
                <div className="max-w-3xl pb-5 pr-10 font-sans text-[15px] leading-7 text-muted-foreground">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
