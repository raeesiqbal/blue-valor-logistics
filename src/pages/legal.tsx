import { useEffect, type ReactNode } from 'react';
import { Link } from 'wouter';
import { privacySections, termsSections, type LegalBlock } from './legal-content';

type LegalProps = {
  kind: 'privacy' | 'terms';
};

function inlineContent(text: string, linkPrivacyPolicy = false) {
  const tokenPattern = /https?:\/\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\(\d{3}\) \d{3}-\d{4}|Privacy Policy/gi;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const token = match[0];
    const isUrl = /^https?:\/\//i.test(token);
    const isEmail = /^[A-Z0-9._%+-]+@/i.test(token);
    const isPhone = /^\(\d{3}\)/.test(token);
    const linkedToken = isUrl ? token.replace(/[.,;:!?]+$/, '') : token;
    const trailing = token.slice(linkedToken.length);

    if (token === 'Privacy Policy' && linkPrivacyPolicy) {
      nodes.push(<Link key={`link-${match.index}`} href="/privacy-policy" className="text-primary underline underline-offset-2 hover:opacity-80">Privacy Policy</Link>);
    } else if (isUrl || isEmail || isPhone) {
      const href = isUrl ? linkedToken : isEmail ? `mailto:${token}` : 'tel:+12393085789';
      nodes.push(<a key={`link-${match.index}`} href={href} className="break-all text-primary underline underline-offset-2 hover:opacity-80">{linkedToken}</a>);
      if (trailing) nodes.push(trailing);
    } else {
      nodes.push(token);
    }
    cursor = match.index + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function Block({ block, linkPrivacyPolicy }: { block: LegalBlock; linkPrivacyPolicy: boolean }) {
  if (block.type === 'list') {
    return (
      <ul className="ml-5 list-none space-y-2">
        {block.items.map((item) => (
          <li key={item} className={`relative pl-5 before:absolute before:left-0 before:top-0 before:text-muted-foreground ${block.marker === 'dash' ? "before:content-['-']" : 'before:content-none'}`}>
            {inlineContent(item, linkPrivacyPolicy)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="whitespace-pre-line">
      {block.boldLead && <strong className="font-bold text-foreground">{block.boldLead}</strong>}
      {inlineContent(block.text, linkPrivacyPolicy)}
    </p>
  );
}

export default function Legal({ kind }: LegalProps) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'PRIVACY POLICY' : 'TERMS & CONDITIONS';
  const effectiveDate = isPrivacy ? 'Effective date: November 2026' : 'Effective date: July 2026';
  const pageTitle = `${isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'} | Blue Valor Logistics`;
  const sections = isPrivacy ? privacySections : termsSections;

  useEffect(() => {
    const updates = [
      ['meta[name="description"]', `${title}. ${effectiveDate}`],
      ['meta[property="og:title"]', pageTitle],
      ['meta[property="og:description"]', `${title}. ${effectiveDate}`],
      ['meta[name="twitter:title"]', pageTitle],
      ['meta[name="twitter:description"]', `${title}. ${effectiveDate}`],
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
  }, [effectiveDate, pageTitle, title]);

  return (
    <main className="w-full bg-background px-4 pb-16 pt-28 sm:px-6 sm:pt-32 md:pb-20">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 sm:mb-10">
          <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[.18em] text-primary">LEGAL</p>
          <h1 className="font-display text-2xl font-bold uppercase leading-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 font-sans text-sm text-muted-foreground">{effectiveDate}</p>
        </header>

        {isPrivacy && (
          <p className="mb-8 max-w-3xl font-sans text-sm leading-7 text-muted-foreground sm:mb-9">
            Blue Valor Logistics, LLC ("Blue Valor," "we," "us") respects your privacy. This policy explains what information we collect through this website, how we use it, and the choices you have.
          </p>
        )}

        <div className="divide-y divide-border border-y border-border">
          {sections.map((section, index) => (
            <details key={section.title} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-[15px] font-bold uppercase leading-6 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:py-[18px] sm:text-base">
                <span>{index + 1}. {section.title}</span>
                <span aria-hidden="true" className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary transition-transform duration-200 group-open:rotate-45">
                  <span className="absolute h-[1.5px] w-3 bg-current" />
                  <span className="absolute h-3 w-[1.5px] bg-current" />
                </span>
              </summary>
              <div className="max-w-3xl space-y-4 pb-5 pr-1 font-sans text-sm leading-7 text-muted-foreground sm:pr-10">
                {section.blocks.map((block, blockIndex) => (
                  <Block key={`${section.title}-${blockIndex}`} block={block} linkPrivacyPolicy={!isPrivacy && index === 14} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
