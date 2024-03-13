import * as yup from 'yup';

yup.setLocale({
  mixed: {
    url: () => ({ key: 'feedBackTexts.invalidUrlError' }),
    notOneOf: () => ({ key: 'feedBackTexts.existRssError' }),
  },
});
