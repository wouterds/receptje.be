import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="text-black/50 text-sm py-6 px-6 sm:px-10 flex items-center gap-1.5">
      {t('components.footer.copyright', { year: new Date().getFullYear() })}
    </footer>
  );
};
