import { useI18n } from '../lib/i18n';

export default function About() {
  const { t } = useI18n();
  return (
    <div className="w-full bg-background pt-36 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-center mb-12">
          <h1 className="inline-block bg-primary/10 text-primary px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-lg border border-primary/20">
            {t('aboutBadge')}
          </h1>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="space-y-8 text-lg md:text-xl text-gray-600 font-sans leading-relaxed">
            <p>{t('aboutPara1')}</p>
            <p>{t('aboutPara2')}</p>
            <p>{t('aboutPara3')}</p>
            <p>{t('aboutPara4')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
