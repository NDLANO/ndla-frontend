import { WithTranslation, withTranslation } from 'react-i18next';

const MoreAboutNdlaFilm = ({ t }: WithTranslation) => (
  <>
    <h1>{t('filmfrontpage.moreAboutNdlaFilm.header')}</h1>
    <hr />
    <p>{t('filmfrontpage.moreAboutNdlaFilm.firstParagraph')}</p>
    <p>{t('filmfrontpage.moreAboutNdlaFilm.secondParagraph')}</p>
    <p>{t('filmfrontpage.moreAboutNdlaFilm.thirdParagraph')}</p>
    <h2>{t('filmfrontpage.moreAboutNdlaFilm.secondHeading')}</h2>
    <p>{t('filmfrontpage.moreAboutNdlaFilm.fourthParagraph')}</p>
    <p>{t('filmfrontpage.moreAboutNdlaFilm.fifthParagraph')}</p>
    <p>
      {t('filmfrontpage.moreAboutNdlaFilm.tipSectionPt1')}{' '}
      <a
        href="https://www.facebook.com/NDLAfilm/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('filmfrontpage.moreAboutNdlaFilm.ariaLabel')}>
        {t('filmfrontpage.moreAboutNdlaFilm.tipSectionPt2')}
      </a>{' '}
      {t('filmfrontpage.moreAboutNdlaFilm.tipSectionPt3')}
    </p>
    <p>
      <strong>{t('filmfrontpage.moreAboutNdlaFilm.ending')}</strong>
    </p>
  </>
);

export default withTranslation()(MoreAboutNdlaFilm);
