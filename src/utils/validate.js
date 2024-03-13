import * as yup from 'yup';

const validate = (url, urlUniqueLinks) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url('feedBackTexts.invalidUrlError')
      .notOneOf(urlUniqueLinks.map(({ link }) => link), 'feedBackTexts.existRssError')
      .required(),
  });
  return schema.validate({ url });
};

export default validate;
