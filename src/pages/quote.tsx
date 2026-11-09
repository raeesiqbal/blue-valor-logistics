import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, MapPin, Package, Truck, Weight } from "lucide-react";
import { useI18n } from '../lib/i18n';
import { useEffect, useRef, useState } from 'react';
import { useSearch } from 'wouter';
import { useSubmitQuote } from '@workspace/api-client-react';
import { calculatorQuoteDefaults } from '../lib/calculator-quote';
import { submitTrackedQuote } from '../lib/analytics-events';
import { HeroImage } from '../components/BannerMedia';

export default function Quote() {
  const search = useSearch();
  const calculatorDefaults = calculatorQuoteDefaults(search);
  const { toast } = useToast();
  const { t, language } = useI18n();
  const returningCopy = language === 'es'
    ? { question: '¿Ha enviado carga con nosotros antes?', yes: 'Sí', no: 'No', reference: 'Número de carga anterior o referencia (Opcional)', example: 'p. ej., BV-1024' }
    : { question: 'Have you shipped with us before?', yes: 'Yes', no: 'No', reference: 'Previous load or reference number (Optional)', example: 'e.g. BV-1024' };
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const sending = useRef(false);
  const quoteRequest = useSubmitQuote({ request: { headers: { 'Idempotency-Key': requestKey } } });
  const quoteSchema = z.object({
    shipperName: z.string().trim().min(2, t('nameRequired')).max(150),
    company: z.string().trim().min(2, t('nameRequired')).max(150),
    email: z.string().trim().email(t('emailRequired')).max(254),
    phone: z.string().trim().min(10, t('validPhone')).max(40),
    origin: z.string().trim().min(2, t('originCity')).max(200),
    destination: z.string().trim().min(2, t('destinationCity')).max(200),
    equipmentType: z.string().refine(value => ['reefer', 'dryvan', 'flatbed'].includes(value), t('equipmentNeeded')),
    freightDescription: z.string().trim().min(2, t('commodityDescription')).max(4000),
    weight: z.string().min(1, t('estimatedWeight')).max(30),
    pickupDate: z.string().min(1, t('pickupPreferred')).max(30),
    temperature: z.string().refine(value => value === '' || Number.isFinite(Number(value)), t('temperatureOptional')),
    reeferMode: z.union([z.literal(''), z.enum(['continuous', 'start-stop', 'not-sure'])]),
    returningShipper: z.enum(['', 'yes', 'no']),
    previousLoadReference: z.string().trim().max(100),
  });
  
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      shipperName: "",
      company: "",
      email: "",
      phone: "",
      origin: "",
      destination: "",
      equipmentType: calculatorDefaults.equipmentType,
      freightDescription: calculatorDefaults.freightDescription,
      weight: calculatorDefaults.weight,
      pickupDate: "",
      temperature: calculatorDefaults.temperature,
      reeferMode: calculatorDefaults.reeferMode,
      returningShipper: "",
      previousLoadReference: "",
    },
  });

  const equipment = form.watch('equipmentType');
  useEffect(() => {
    const defaults = calculatorQuoteDefaults(search);
    for (const key of ['equipmentType', 'weight', 'temperature', 'reeferMode', 'freightDescription'] as const) {
      form.setValue(key, defaults[key]);
    }
  }, [search, form]);
  const returningShipper = form.watch('returningShipper');
  useEffect(() => {
    if (returningShipper !== 'yes') form.setValue('previousLoadReference', '');
  }, [returningShipper, form]);
  useEffect(() => {
    if (equipment !== 'reefer') {
      form.setValue('temperature', '');
      form.setValue('reeferMode', '');
    }
  }, [equipment, form]);

  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    if (sending.current) return;
    sending.current = true;
    const { temperature, reeferMode, equipmentType, returningShipper, previousLoadReference, ...details } = values;
    try {
      await submitTrackedQuote(quoteRequest.mutateAsync({ data: {
        ...details,
        ...(returningShipper !== '' ? { returningShipper: returningShipper === 'yes' } : {}),
        ...(returningShipper === 'yes' && previousLoadReference ? { previousLoadReference } : {}),
        equipmentType: equipmentType === 'reefer' ? 'reefer' : equipmentType === 'flatbed' ? 'flatbed' : 'dryvan',
        ...(equipmentType === 'reefer' && temperature !== '' ? { temperature: Number(temperature) } : {}),
        ...(equipmentType === 'reefer' && reeferMode !== '' ? { reeferMode } : {}),
      } }), equipmentType);
      toast({ title: t('quoteReceived'), description: t('quoteSuccess') });
      form.reset();
      setRequestKey(crypto.randomUUID());
    } catch {
      toast({ title: t('quoteSubmitError'), variant: 'destructive' });
    } finally {
      sending.current = false;
    }
  }

  return (
    <div className="w-full bg-[#0A0E14] pt-32 pb-24 relative isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <HeroImage src={`${import.meta.env.BASE_URL}hero-quote.webp`} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#0A0E14]/60" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Text */}
          <div className="w-full lg:w-5/12 pt-8">
            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight text-white mb-6">
              {t('requestAQuote')}
            </h1>
            <p className="text-xl text-gray-100 font-sans mb-8">
              {t('quoteIntro')}
            </p>
            
            <div className="bg-white p-6 rounded shadow-md border-l-4 border-accent mt-12">
              <h4 className="font-display font-bold uppercase tracking-wider text-lg mb-2 text-foreground">{t('urgent')}</h4>
              <p className="text-gray-600 mb-4 font-sans">{t('urgentIntro')}</p>
              <a href="tel:+12393085789" className="inline-block bg-[#0A0E14] text-white px-6 py-2 rounded font-bold tracking-wider hover:bg-accent hover:text-[#0A0E14] transition-colors">
                {t('call')}
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-8 md:p-10 rounded shadow-2xl border-t-4 border-primary">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <fieldset disabled={quoteRequest.isPending} className="space-y-8">
                  
                  {/* Section 1: Contact Info */}
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-gray-100 pb-2 mb-6">{t('shipperInformation')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField control={form.control} name="shipperName" render={({ field }) => (
                        <FormItem><FormLabel>{t('fullName')}</FormLabel><FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem><FormLabel>{t('company')}</FormLabel><FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>{t('emailAddress')}</FormLabel><FormControl><input type="email" className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>{t('phone')}</FormLabel><FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="returningShipper" render={({ field }) => (
                      <FormItem className="mt-6">
                        <fieldset>
                          <legend className="text-sm font-medium mb-3">{returningCopy.question}</legend>
                          <div className="flex gap-6">
                            {(['yes', 'no'] as const).map(value => (
                              <label key={value} className="inline-flex items-center gap-2 cursor-pointer py-2">
                                <input type="radio" name={field.name} value={value} checked={field.value === value}
                                  onChange={() => field.onChange(value)} onBlur={field.onBlur} ref={value === 'yes' ? field.ref : undefined}
                                  className="h-4 w-4 accent-[#3b82bb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82bb]" />
                                <span>{value === 'yes' ? returningCopy.yes : returningCopy.no}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {returningShipper === 'yes' && <FormField control={form.control} name="previousLoadReference" render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>{returningCopy.reference}</FormLabel>
                        <FormControl><input maxLength={100} placeholder={returningCopy.example} className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />}
                  </div>

                  {/* Section 2: Route */}
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-gray-100 pb-2 mb-6">{t('route')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="origin" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary"/>{t('originCity')}</FormLabel>
                          <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" placeholder={t('originCity')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="destination" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-accent"/>{t('destinationCity')}</FormLabel>
                          <FormControl><input className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" placeholder={t('destinationCity')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Section 3: Freight Details */}
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-gray-100 pb-2 mb-6">{t('freightDetails')}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField control={form.control} name="equipmentType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Truck className="w-4 h-4 mr-2 text-primary"/>{t('equipmentNeeded')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full p-3 h-auto border-gray-300 rounded text-base"><SelectValue placeholder={t('selectEquipment')} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="reefer">{t('reeferEquipment')}</SelectItem>
                              <SelectItem value="dryvan">{t('dryVanEquipment')}</SelectItem>
                              <SelectItem value="flatbed">{t('flatbed')}</SelectItem>
                            </SelectContent>
                          </Select>
                          {field.value && <button type="button" onClick={() => field.onChange('')} className="text-xs text-primary underline underline-offset-2">
                            {language === 'es' ? 'Borrar selección' : 'Clear selection'}
                          </button>}
                          <FormMessage />
                        </FormItem>
                      )} />

                      {equipment === 'reefer' && <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="quote-reefer-fields">
                        <FormField control={form.control} name="temperature" render={({ field }) => (
                          <FormItem><FormLabel>{t('temperatureOptional')}</FormLabel><FormControl><input type="number" step="any" placeholder={t('temperaturePlaceholder')} className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="reeferMode" render={({ field }) => (
                          <FormItem><FormLabel>{t('reeferModeOptional')}</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl><SelectTrigger className="w-full p-3 h-auto border-gray-300 rounded text-base"><SelectValue placeholder={t('selectMode')} /></SelectTrigger></FormControl>
                              <SelectContent><SelectItem value="continuous">{t('continuous')}</SelectItem><SelectItem value="start-stop">{t('startStopCycle')}</SelectItem><SelectItem value="not-sure">{t('notSure')}</SelectItem></SelectContent>
                            </Select>
                            {field.value && <button type="button" onClick={() => field.onChange('')} className="text-xs text-primary underline underline-offset-2">
                              {language === 'es' ? 'Borrar selección' : 'Clear selection'}
                            </button>}
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>}

                      <FormField control={form.control} name="pickupDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-primary"/>{t('pickupPreferred')}</FormLabel>
                          <FormControl><input type="date" className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField control={form.control} name="weight" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Weight className="w-4 h-4 mr-2 text-primary"/>{t('estimatedWeight')}</FormLabel>
                          <FormControl><input type="number" className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none" placeholder="42000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="freightDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Package className="w-4 h-4 mr-2 text-primary"/>{t('commodityDescription')}</FormLabel>
                        <FormControl><textarea rows={3} className="w-full p-3 border border-gray-300 rounded focus:border-primary outline-none resize-y" placeholder={t('freightExample')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <button type="submit" disabled={quoteRequest.isPending} className="w-full bg-accent hover:bg-[#73c9e3] text-white font-display font-bold uppercase tracking-widest text-lg py-4 rounded shadow-lg transition-transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-wait">
                    {quoteRequest.isPending ? t('quoteSubmitPending') : t('pricing')}
                  </button>
                  </fieldset>
                </form>
              </Form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
