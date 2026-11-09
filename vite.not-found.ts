import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, ResolvedConfig } from 'vite';

// Keep this list aligned with the public routes in App.tsx and static rewrites.
export const PAGE_PATHS = ['/', '/services', '/services/refrigerated-freight', '/services/dry-van-freight', '/services/flatbed-freight', '/shippers/admin', '/shippers', '/carriers', '/about', '/contact', '/quote', '/banner-preview', '/map-preview', '/privacy-policy', '/terms'];

export function isMissingPage(url: string, base = '/'): boolean {
  const pathname = new URL(url, 'http://routing.local').pathname;
  const prefix = base.replace(/\/$/, '');
  if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) return false;
  const relative = pathname.slice(prefix.length) || '/';
  const canonical = relative.replace(/\/$/, '') || '/';
  return !PAGE_PATHS.includes(canonical);
}

function missingPageHtml(html: string): string {
  return html
    .replace(/<title>.*?<\/title>/, '<title>Page Not Found | Blue Valor Logistics</title>')
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
}

function bannerPreviewHtml(html: string): string {
  return html
    .replace(/<title>.*?<\/title>/, '<title>Banner Comparison | Blue Valor Logistics</title>')
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow" />');
}

function mapPreviewHtml(html: string): string {
  return html
    .replace(/<title>.*?<\/title>/, '<title>Map Size Preview | Blue Valor Logistics</title>')
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow" />');
}

function isFileWithin(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

export function customNotFound(): Plugin {
  let config: ResolvedConfig;
  const middleware = (preview: boolean, transform?: (url: string, html: string) => Promise<string>) =>
    async (req: IncomingMessage, res: ServerResponse, next: (error?: unknown) => void) => {
      const accept = req.headers.accept ?? '*/*';
      const pathname = new URL(req.url ?? '/', 'http://routing.local').pathname.replace(/\/$/, '');
      if (['/banner-preview', '/map-preview'].some(route => pathname === `${config.base.replace(/\/$/, '')}${route}`)) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      }
      const internalResource = /(?:^|\/)(?:@vite|@react-refresh|@fs|@id|node_modules|__vite|__replit)(?:\/|$)/.test(req.url ?? '');
      if (!['GET', 'HEAD'].includes(req.method ?? '') || internalResource || !(accept.includes('text/html') || accept === '*/*') || !isMissingPage(req.url ?? '/', config.base)) {
        next(); return;
      }
      try {
        const pathname = decodeURIComponent(new URL(req.url!, 'http://routing.local').pathname);
        const relative = pathname.slice(config.base.replace(/\/$/, '').length);
        const publicRoot = path.resolve(preview ? config.build.outDir : config.publicDir);
        const assetPath = path.resolve(publicRoot, `.${relative}`);
        const sourceRoot = path.resolve(config.root);
        const sourcePath = path.resolve(sourceRoot, `.${relative}`);
        const publicFile = isFileWithin(publicRoot, assetPath) && (await stat(assetPath).catch(() => null))?.isFile();
        const sourceFile = !preview && isFileWithin(sourceRoot, sourcePath) && (await stat(sourcePath).catch(() => null))?.isFile();
        if (publicFile || sourceFile) {
          next(); return;
        }
        const template = await readFile(path.resolve(preview ? config.build.outDir : config.root, preview ? '404.html' : 'index.html'), 'utf8');
        const html = transform ? await transform(req.url!, missingPageHtml(template)) : template;
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex',
        });
        res.end(req.method === 'HEAD' ? undefined : html);
      } catch (error) {
        next(error);
      }
    };
  return {
    name: 'blue-valor-real-404',
    enforce: 'post',
    configResolved(resolved) { config = resolved; },
    transformIndexHtml(html, context) {
      const pathname = new URL(context.originalUrl ?? context.path, 'http://routing.local').pathname.replace(/\/$/, '');
      if (pathname === `${config.base.replace(/\/$/, '')}/map-preview`) return mapPreviewHtml(html);
      return pathname === `${config.base.replace(/\/$/, '')}/banner-preview`
        ? bannerPreviewHtml(html)
        : html;
    },
    configureServer(server) {
      server.middlewares.use(middleware(false, (url, html) => server.transformIndexHtml(url, html)));
    },
    configurePreviewServer(server) { server.middlewares.use(middleware(true)); },
    async writeBundle() {
      const output = path.resolve(config.build.outDir);
      const html = await readFile(path.join(output, 'index.html'), 'utf8');
      await writeFile(path.join(output, '404.html'), missingPageHtml(html));
      await writeFile(path.join(output, 'banner-preview.html'), bannerPreviewHtml(html));
      await writeFile(path.join(output, 'map-preview.html'), mapPreviewHtml(html));
    },
  };
}
