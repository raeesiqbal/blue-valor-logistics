import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from '../lib/i18n';
import { useRef, useState } from 'react';
import { useSubmitContact } from '@workspace/api-client-react';
import { trackContactRequest } from '../lib/analytics-events';

export default function Contact() {
  const { toast } = useToast();
  const { t, language } = useI18n();
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const [backgroundReady, setBackgroundReady] = useState(false);
  const sending = useRef(false);
  const contactRequest = useSubmitContact({ request: { headers: { 'Idempotency-Key': requestKey } } });
  const formSchema = z.object({
    name: z.string().trim().min(2, t('nameRequired')).max(150),
    email: z.string().trim().email(t('emailRequired')).max(254),
    phone: z.string().trim().min(10, t('validPhone')).max(40),
    company: z.string().trim().max(150).optional(),
    message: z.string().trim().min(10, t('messageShort')).max(4000),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (sending.current) return;
    sending.current = true;
    try {
      await contactRequest.mutateAsync({ data: values });
      trackContactRequest();
      toast({ title: t('messageSent'), description: t('contactSuccess') });
      form.reset();
      setRequestKey(crypto.randomUUID());
    } catch {
      toast({
        title: language === 'es' ? 'No se pudo enviar el mensaje.' : 'Your message could not be sent.',
        description: language === 'es' ? 'Su información sigue aquí. Inténtelo de nuevo o llámenos.' : 'Your information is still here. Please try again or call us.',
        variant: 'destructive',
      });
    } finally {
      sending.current = false;
    }
  }

  return (
    <div
      className="w-full pt-32 pb-24 relative bg-[#0A0E14]"
    >
      <img src={`${import.meta.env.BASE_URL}hero-contact.webp`} alt="" aria-hidden="true"
        loading="eager" fetchPriority="high" className="hidden" onLoad={() => setBackgroundReady(true)} />
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-200 motion-reduce:transition-none"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}hero-contact.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundAttachment: 'fixed',
          opacity: backgroundReady ? 1 : 0,
        }} />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0A0E14]/72 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight text-white mb-6">
            {t('getInTouch')}
          </h1>
          <p className="text-xl text-gray-300 font-sans">
            {t('contactIntro')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Info Side */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-[#0A0E14] text-white p-8 rounded shadow-xl border-t-4 border-accent">
              <h3 className="font-display text-2xl font-bold uppercase tracking-wider mb-6">{t('contactInfo')}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-accent mr-4 shrink-0" />
                  <div>
                    <p className="font-bold uppercase text-sm tracking-wider text-gray-400 mb-1">{t('phone')}</p>
                    <a href="tel:+12393085789" className="text-xl font-bold hover:text-accent transition-colors">(239) 308-5789</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-accent mr-4 shrink-0" />
                  <div>
                    <p className="font-bold uppercase text-sm tracking-wider text-gray-400 mb-1">{t('email')}</p>
                    <a href="mailto:info@bluevalorlogistics.com" className="text-lg hover:text-accent transition-colors">info@bluevalorlogistics.com</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-accent mr-4 shrink-0" />
                  <div>
                    <p className="font-bold uppercase text-sm tracking-wider text-gray-400 mb-1">{t('mailingAddress')}</p>
                    <p className="text-gray-300">3236 Forum Blvd #1016<br/>Fort Myers, FL 33905<br/>United States</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-accent mr-4 shrink-0" />
                  <div>
                    <p className="font-bold uppercase text-sm tracking-wider text-gray-400 mb-1">{t('hours')}</p>
                    <p className="text-gray-300 text-[18px]">{t('alwaysAvailable')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fort Myers map */}
            <div className="bg-gray-200 h-64 rounded overflow-hidden relative shadow-inner border border-gray-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57071.00221665216!2d-81.87369278972248!3d26.618445591951794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88db420189a85429%3A0xc62908530aba258a!2sFort%20Myers%2C%20FL!5e0!3m2!1sen!2sus!4v1793369581975!5m2!1sen!2sus"
                title="Fort Myers, FL"
                className="block h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-2/3 bg-white p-8 md:p-10 rounded shadow-xl border border-gray-100 text-[22px]">
            <h2 className="text-3xl font-display font-bold uppercase text-foreground mb-8">{t('sendMessage')}</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <fieldset disabled={contactRequest.isPending} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fullName')}</FormLabel>
                      <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('companyOptional')}</FormLabel>
                      <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50" placeholder={t('businessPlaceholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('emailAddress')}</FormLabel>
                      <FormControl><input type="email" className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phoneNumber')}</FormLabel>
                      <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50" placeholder="(555) 000-0000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('message')}</FormLabel>
                    <FormControl><textarea rows={5} className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 resize-y" placeholder={t('helpPlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <button type="submit" disabled={contactRequest.isPending} className="bg-action hover:bg-action/90 text-white font-display font-bold uppercase tracking-widest text-lg px-8 py-4 rounded shadow-lg transition-transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-wait">
                  {t('send')}
                </button>
                </fieldset>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </div>
  );
}
