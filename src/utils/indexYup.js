import * as yup from 'yup';

yup.setLocale({
  mixed: {
    url: () => ({ key: 'feedBackTexts.invalidUrlError' }),
    notOneOf: () => ({ key: 'feedBackTexts.existRssError' }),
  },
});

const validate = (url, urlUniqueLinks) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url('feedBackTexts.invalidUrlError')
      .notOneOf(urlUniqueLinks, 'feedBackTexts.existRssError')
      .required(),
  });
  return schema.validate({ url });
};

export default validate;
