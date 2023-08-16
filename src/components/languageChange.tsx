import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function LanguageChangeButton () {
    const { t } = useTranslation();
	const router = useRouter();
	const { pathname, asPath, query } = router;
    return (<>
    {t('settings.change.language')}
    <button
        type="button"
        onClick={() => {
            router.push({ pathname, query }, asPath, {
                locale: router.locale === 'pl' ? 'en' : 'pl',
            });
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
        {router.locale === 'pl' ? 'English' : 'Polski'}
    </button>
    </>)
}