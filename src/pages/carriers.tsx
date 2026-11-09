import { HeroVideo } from '../components/BannerMedia';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building2, FileText, Truck, User, Phone, Mail, DollarSign, Clock } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from '../lib/i18n';

export default function Carriers() {
  const { toast } = useToast();
  const { t } = useI18n();
  const formSchema = z.object({
    companyName: z.string().min(2, t('nameRequired')),
    mcNumber: z.string().min(4, t('validPhone')),
    equipmentType: z.string().min(1, t('selectEquipment')),
    contactName: z.string().min(2, t('nameRequired')),
    phone: z.string().min(10, t('validPhone')),
    email: z.string().email(t('emailRequired')),
    insurance: z.string().min(2, t('insuranceProvider')),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      mcNumber: "",
      equipmentType: "",
      contactName: "",
      phone: "",
      email: "",
      insurance: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: t('applicationReceived'),
      description: t('carrierSuccess'),
    });
    form.reset();
  }

  return (
    <div className="w-full bg-background pb-20">
      {/* Header */}
      <div className="bg-[#0A0E14] text-white pt-32 pb-16 md:pt-40 md:pb-20 min-h-[400px] md:min-h-[440px] lg:min-h-[480px] mb-16 relative overflow-hidden flex items-center">
        <HeroVideo
          poster={`${import.meta.env.BASE_URL}carrier-video-poster.webp`}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={`${import.meta.env.BASE_URL}carrier-landscape.webm`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}carrier-landscape.mp4`} type="video/mp4" />
        </HeroVideo>
        <div className="absolute inset-0 bg-[#0A0E14]/45 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="font-display font-bold uppercase tracking-widest text-white mb-3 text-[20px]">{t('joinNetwork')}</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight mb-4">{t('carrierPartnerships')}</h1>
          <p className="text-xl text-white font-sans max-w-2xl mx-auto">{t('carrierIntro')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Pitch Side */}
          <div className="w-full lg:w-5/12">
            <h2 className="text-3xl font-display font-bold uppercase text-primary mb-6">{t('whyHaul')}</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t('carrierWhy')}</p>
            
            <div className="space-y-6">
              {[
                { title: t('fastPay'), desc: t('fastPayDesc'), icon: DollarSign },
                { title: t('supportOnRoad'), desc: t('supportOnRoadDesc'), icon: Truck },
                { title: t('realCommunication'), desc: t('communicationDesc'), icon: Phone },
                { title: t('respectForTime'), desc: t('respectForTimeDesc'), icon: Clock }
              ].map((prop, i) => (
                <div key={i} className="flex bg-white p-5 rounded border border-gray-100 shadow-sm">
                  <div className="bg-accent/10 text-[#275d87] p-3 rounded-full h-fit mr-4">
                    <prop.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground mb-1 font-sans">{prop.title}</h4>
                    <p className="text-gray-600 text-sm">{prop.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div id="requirements" className="mt-12 scroll-mt-24 p-6 text-white rounded bg-[#c1121f]">
              <h3 className="font-display text-xl font-bold uppercase mb-2 text-popover">{t('minimumRequirements')}</h3>
              <ul className="list-disc pl-5 text-sm text-white space-y-2 font-sans">
                <li>{t('authorityRequirement')}</li>
                <li>{t('autoInsurance')}</li>
                <li>{t('cargoInsurance')}</li>
                <li>{t('safetyRating')}</li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-8 md:p-10 rounded shadow-2xl border-t-4 border-primary">
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold uppercase text-foreground mb-2">{t('getSetup')}</h2>
                <p className="text-gray-500 font-sans">{t('setupIntro')}</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Building2 className="w-4 h-4 mr-2 text-primary" />{t('companyName')}</FormLabel>
                        <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={t('companyName')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="mcNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><FileText className="w-4 h-4 mr-2 text-primary" />{t('mcDot')}</FormLabel>
                        <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. 1234567" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="equipmentType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Truck className="w-4 h-4 mr-2 text-primary" />{t('equipmentType')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full p-3 h-auto border-gray-300 rounded text-base">
                            <SelectValue placeholder={t('selectEquipment')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dryvan">{t('dryVanFreight')}</SelectItem>
                          <SelectItem value="flatbed">{t('flatbedFreight')}</SelectItem>
                          <SelectItem value="stepdeck">{t('stepDeck')}</SelectItem>
                          <SelectItem value="both">{t('bothEquipment')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="border-t border-gray-100 py-4 my-4">
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">{t('contactInformation')}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField control={form.control} name="contactName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><User className="w-4 h-4 mr-2 text-primary" />{t('contactNameLabel')}</FormLabel>
                          <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={t('contactNameLabel')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Phone className="w-4 h-4 mr-2 text-primary" />{t('phoneNumber')}</FormLabel>
                          <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="(555) 000-0000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Mail className="w-4 h-4 mr-2 text-primary" />{t('emailAddress')}</FormLabel>
                          <FormControl><input type="email" className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="dispatch@company.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="insurance" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><FileText className="w-4 h-4 mr-2 text-primary" />{t('insuranceProvider')}</FormLabel>
                          <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={t('insurancePlaceholder')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <button type="submit" className="w-full hover:bg-[#73c9e3] font-display font-bold uppercase tracking-widest text-lg py-4 rounded shadow-lg transition-transform hover:-translate-y-1 bg-ring text-white">
                    {t('submitApplication')}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4">{t('carrierTerms')}</p>
                </form>
              </Form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
