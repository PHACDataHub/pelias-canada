import { useTranslation } from 'react-i18next';

export default function Colon() {
  const { i18n } = useTranslation();
  const nbsp = '\u00A0';

  return <>{i18n.language === 'en' ? ':' + nbsp : nbsp + ':' + nbsp}</>;
}
