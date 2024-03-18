import * as yup from 'yup';
import yupLocales from '../locales/yupLocales.js';

yup.setLocale(yupLocales);

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
