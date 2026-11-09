import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Layout } from './components/layout/Layout';
import Home from './pages/home';
import Services from './pages/services';
import ServiceDetail from './pages/service-detail';
import Carriers from './pages/carriers';
import About from './pages/about';
import Contact from './pages/contact';
import Quote from './pages/quote';
import Shippers from './pages/shippers';
import BannerPreview from './pages/banner-preview';
import MapPreview from './pages/map-preview';
import Legal from './pages/legal';
import { SiteAnalytics } from './components/SiteAnalytics';
import ShippersAdmin from './pages/shippers-admin';
import { I18nProvider } from './lib/i18n';
import { useEffect, useRef } from 'react';
import { getGetShipperSessionQueryKey, useGetShipperSession } from '@workspace/api-client-react';

const queryClient = new QueryClient();

function ShipperSessionPrivacy() {
  const client = useQueryClient();
  const session = useGetShipperSession({
    query: { queryKey: getGetShipperSessionQueryKey(), refetchOnMount: 'always', staleTime: 0, gcTime: 0 },
    request: { cache: 'no-store' }
  });
  const previousIdentity = useRef<string | null>(null);
  useEffect(() => {
    if (session.isFetching || session.isError) return;
    const identity = session.data?.authenticated ? session.data.email ?? null : null;
    if (previousIdentity.current !== null && identity !== previousIdentity.current) {
      client.removeQueries({
        predicate: query => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/shipper/') && query.queryKey[0] !== '/api/shipper/session'
      });
    }
    previousIdentity.current = identity;
  }, [client, session.data?.email, session.data?.authenticated, session.isFetching, session.isError]);
  return null;
}

function Router() {
  return (
    <Layout>
      <SiteAnalytics />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/services/refrigerated-freight">{() => <ServiceDetail service="refrigerated" />}</Route>
        <Route path="/services/dry-van-freight">{() => <ServiceDetail service="dry-van" />}</Route>
        <Route path="/services/flatbed-freight">{() => <ServiceDetail service="flatbed" />}</Route>
        <Route path="/shippers/admin" component={ShippersAdmin} />
        <Route path="/shippers" component={Shippers} />
        <Route path="/banner-preview" component={BannerPreview} />
        <Route path="/map-preview" component={MapPreview} />
        <Route path="/carriers" component={Carriers} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/quote" component={Quote} />
        <Route path="/privacy-policy">{() => <Legal kind="privacy" />}</Route>
        <Route path="/terms">{() => <Legal kind="terms" />}</Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
        <ShipperSessionPrivacy />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
