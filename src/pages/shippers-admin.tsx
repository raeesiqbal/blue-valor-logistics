import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, FileText, LoaderCircle, ShieldAlert, Truck, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import {
  getGetAdminCreditApplicationQueryKey, getGetShipperSessionQueryKey, getListAdminCreditApplicationsQueryKey, getListAdminShipperLoadsQueryKey,
  useGetAdminCreditApplication, useGetShipperSession, useListAdminCreditApplications, useListAdminShipperLoads,
  useLogoutAllShipperDevices, useLogoutShipper
} from '@workspace/api-client-react';
import type { SubmissionReceipt } from '@workspace/api-client-react';
import { useI18n } from '../lib/i18n';

const noCache = { cache: 'no-store' as RequestCache };
const date = (value: string) => new Date(value).toLocaleString();
const errStatus = (error: unknown) => error && typeof error === 'object' && 'status' in error ? Number(error.status) : 0;

export default function ShippersAdmin() {
  const { t, language } = useI18n();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const session = useGetShipperSession({ query: { queryKey: getGetShipperSessionQueryKey(), refetchOnMount: 'always', staleTime: 0, gcTime: 0 }, request: noCache });
  const canAdmin = !session.isFetching && !session.isError && !!session.data?.authenticated && !!session.data.isAdmin;
  const applications = useListAdminCreditApplications({ query: { queryKey: getListAdminCreditApplicationsQueryKey(), enabled: canAdmin, staleTime: 0, gcTime: 0 }, request: noCache });
  const loads = useListAdminShipperLoads({ query: { queryKey: getListAdminShipperLoadsQueryKey(), enabled: canAdmin, staleTime: 0, gcTime: 0 }, request: noCache });
  const [selected, setSelected] = useState<SubmissionReceipt | null>(null);
  const [signOutError, setSignOutError] = useState(false);
  const detail = useGetAdminCreditApplication(selected?.id ?? '', { query: { queryKey: getGetAdminCreditApplicationQueryKey(selected?.id ?? ''), enabled: canAdmin && !!selected, staleTime: 0, gcTime: 0 }, request: noCache });
  const jsonPost = { headers: { 'Content-Type': 'application/json' }, body: '{}' };
  const logout = useLogoutShipper({ request: jsonPost });
  const logoutAll = useLogoutAllShipperDevices({ request: jsonPost });
  const unauthorized = errStatus(applications.error) === 403 || errStatus(loads.error) === 403 || errStatus(detail.error) === 403;
  const expired = session.isError || !session.data?.authenticated;
  if (session.isPending || session.isFetching) return <main className="min-h-[70vh] bg-[#f2f1ed] px-4 pt-36"><div className="container mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-10 w-64 rounded bg-[#dce2e4]" /><div className="h-56 rounded bg-[#e4e8e8]" /></div></main>;
  if (session.isError) return <main className="min-h-[70vh] bg-[#f2f1ed] px-4 pb-20 pt-36"><section role="alert" className="mx-auto max-w-xl rounded border border-[#e5c7c2] bg-[#fff5f2] p-8 text-center text-sm text-[#8e342b]">{t('sessionError')} <button className="ml-2 font-bold underline" onClick={() => void session.refetch()}>{t('retry')}</button></section></main>;
  if (!canAdmin || unauthorized || expired) return <main className="min-h-[70vh] bg-[#f2f1ed] px-4 pb-20 pt-36"><section className="mx-auto max-w-xl rounded border border-[#d8dfe2] bg-[#fffefa] p-8 text-center shadow"><ShieldAlert className="mx-auto mb-4 h-10 w-10 text-[#a35442]" /><h1 className="mb-3 text-3xl font-bold">{t('status403')}</h1><p className="mb-6 text-sm text-[#65747f]">{t('status403')}</p><Link href="/shippers" className="inline-flex items-center gap-2 font-bold text-[#275d87] hover:underline"><ArrowLeft size={16} />{t('shippers')}</Link></section></main>;
  const signOut = (all = false) => {
    setSignOutError(false);
    (all ? logoutAll : logout).mutate(undefined, {
      onSuccess: () => { queryClient.clear(); setLocation('/shippers'); },
      onError: () => setSignOutError(true)
    });
  };
  return <main className="min-h-[70vh] bg-[#f2f1ed] pb-20 pt-32 sm:pt-40">
    <div className="container mx-auto max-w-7xl px-4 md:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#cbd3d7] pb-6"><div><Link href="/shippers" className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#536573] hover:text-[#275d87]"><ArrowLeft size={14} />{t('shippers')}</Link><p className="text-xs font-bold uppercase tracking-[.2em] text-[#326f9f]">{t('admin')}</p><h1 className="mt-1 text-4xl font-bold">{t('adminLink')}</h1></div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-[#c6d2d8] bg-[#fffefa] px-4 py-2 text-sm text-[#4f606c]">{session.data.email}</span><button onClick={() => signOut(false)} className="rounded border border-[#bbc5cc] px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-[#fffefa]" disabled={logout.isPending}>{t('signOut')}</button><button onClick={() => window.confirm(t('allDevicesConfirm')) && signOut(true)} className="rounded border border-[#bbc5cc] px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-[#fffefa]" disabled={logoutAll.isPending}>{t('signOutAll')}</button>{signOutError && <p role="alert" className="basis-full text-right text-xs text-[#8e342b]">{t('signOutError')}</p>}</div></header>
      {(applications.isError || loads.isError) && <div role="alert" className="mb-6 rounded border border-[#e5c7c2] bg-[#fff5f2] p-4 text-sm text-[#8e342b]">{t('adminError')} <button className="ml-2 font-bold underline" onClick={() => { void applications.refetch(); void loads.refetch(); }}>{t('retry')}</button></div>}
      <div className="grid gap-7 xl:grid-cols-[.8fr_1.2fr]">
        <section className="rounded border border-[#d7dfe2] bg-[#fffefa] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3"><FileText className="h-5 w-5 text-[#326f9f]" /><h2 className="text-2xl font-bold">{t('adminApplications')}</h2></div>
          {applications.isPending ? <div className="space-y-3">{[1,2,3].map(item => <div key={item} className="h-16 animate-pulse rounded bg-[#edf0f0]" />)}</div>
            : !applications.data?.length ? <p className="rounded border border-dashed border-[#cbd4d9] p-7 text-center text-sm text-[#65747f]">{t('noAdminData')}</p>
            : <div className="space-y-2">{applications.data.map(application => <button key={application.id} onClick={() => setSelected(application)} className={`flex w-full items-center justify-between gap-3 rounded border p-4 text-left transition hover:border-[#326f9f] hover:bg-[#f4f8f9] ${selected?.id === application.id ? 'border-[#326f9f] bg-[#f1f7f9]' : 'border-[#e0e5e7]'}`}><span className="min-w-0"><span className="block truncate text-sm font-bold text-[#1b2b38]">{application.id}</span><span className="mt-1 block text-xs text-[#6c7a84]">{date(application.createdAt)}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-[#326f9f]" /></button>)}</div>}
        </section>
        <section className="rounded border border-[#d7dfe2] bg-[#fffefa] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3"><Truck className="h-5 w-5 text-[#326f9f]" /><h2 className="text-2xl font-bold">{t('adminLoads')}</h2></div>
          {loads.isPending ? <div className="space-y-3">{[1,2,3].map(item => <div key={item} className="h-16 animate-pulse rounded bg-[#edf0f0]" />)}</div>
            : !loads.data?.length ? <p className="rounded border border-dashed border-[#cbd4d9] p-7 text-center text-sm text-[#65747f]">{t('noAdminData')}</p>
            : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-[#dfe4e6] text-[10px] uppercase tracking-wider text-[#71808a]"><tr><th className="pb-3 pr-3">{t('company')}</th><th className="pb-3 pr-3">{t('lane')}</th><th className="pb-3 pr-3">{t('pickupDate')}</th><th className="pb-3">{t('created')}</th></tr></thead><tbody>{loads.data.map(load => <tr key={load.id} className="border-b border-[#edf0f0]"><td className="py-3 pr-3 font-semibold">{load.companyName}<span className="block max-w-48 truncate text-xs font-normal text-[#72808a]">{load.email}</span></td><td className="py-3 pr-3">{load.origin} <ArrowRight className="inline h-3 w-3" /> {load.destination}</td><td className="py-3 pr-3">{new Date(`${load.pickupDate}T00:00:00`).toLocaleDateString(language)}</td><td className="py-3">{date(load.createdAt)}</td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </div>
    {selected && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#08111bd9] p-4" role="presentation" onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="application-detail-title" className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded bg-[#fffefa] p-6 shadow-2xl sm:p-9">
        <header className="mb-6 flex items-start justify-between border-b border-[#e0e5e7] pb-5"><div><p className="text-xs font-bold uppercase tracking-wider text-[#326f9f]">{t('detail')}</p><h2 id="application-detail-title" className="mt-1 text-3xl font-bold">{detail.data?.application.legalName ?? selected.id}</h2><p className="mt-1 text-sm text-[#687782]">{detail.data?.email ?? ''} · {date(selected.createdAt)}</p></div><button aria-label={t('close')} onClick={() => setSelected(null)} className="rounded p-2 text-[#526270] hover:bg-[#eef1f1]"><X size={20} /></button></header>
        {detail.isPending ? <div className="flex items-center gap-2 py-12 text-sm text-[#62717c]"><LoaderCircle className="h-4 w-4 animate-spin" />{t('loading')}</div> : detail.isError ? <div role="alert" className="rounded bg-[#fff3f1] p-4 text-sm text-[#8e342b]">{errStatus(detail.error) === 403 ? t('status403') : t('adminError')}</div> : detail.data && <div className="space-y-6 text-sm">
          <DetailGroup title={t('legalName')} items={[[t('legalName'),detail.data.application.legalName],[t('dba'),detail.data.application.dba],[t('address'),detail.data.application.address],[t('ein'),detail.data.application.ein],[t('years'),String(detail.data.application.yearsInBusiness)],[t('volume'),detail.data.application.monthlyVolume]]} />
          <DetailGroup title={t('contactName')} items={[[t('contactName'),detail.data.application.contactName],[t('contactTitle'),detail.data.application.contactTitle],[t('contactPhone'),detail.data.application.contactPhone],[t('contactEmail'),detail.data.application.contactEmail]]} />
          <DetailGroup title={t('apName')} items={[[t('apName'),detail.data.application.apName],[t('apPhone'),detail.data.application.apPhone],[t('apEmail'),detail.data.application.apEmail]]} />
          <div><h3 className="mb-2 font-bold uppercase tracking-wider">{t('references')}</h3><div className="grid gap-3 sm:grid-cols-2">{detail.data.application.tradeReferences.map((ref,index)=><div key={index} className="rounded border border-[#e0e5e7] p-3"><strong>{ref.company}</strong><p>{ref.contact} · {ref.phone}</p><p>{ref.email}</p></div>)}</div></div>
          <DetailGroup title={t('signature')} items={[[t('signature'),detail.data.application.signatureName],[t('signatureDate'),detail.data.application.signatureDate],[t('authorized'),detail.data.application.authorized ? t('affirmative') : t('negative')]]} />
        </div>}
        <div className="mt-7 flex justify-end"><button onClick={() => setSelected(null)} className="rounded border border-[#bbc5cc] px-5 py-2.5 text-sm font-semibold hover:bg-[#f2f5f6]">{t('close')}</button></div>
      </section>
    </div>}
  </main>;
}

function DetailGroup({ title, items }: { title: string; items: [string,string][] }) {
  return <section><h3 className="mb-2 font-bold uppercase tracking-wider">{title}</h3><div className="grid gap-x-6 gap-y-3 rounded border border-[#e0e5e7] bg-[#fafaf7] p-4 sm:grid-cols-2">{items.map(([label,value])=><div key={label}><p className="text-[10px] font-bold uppercase tracking-wider text-[#71808a]">{label}</p><p className="mt-1 break-words text-[#1a2b38]">{value}</p></div>)}</div></section>;
}
