import * as yup from 'yup';

yup.setLocale({
  mixed: {
    url: () => ({ key: 'Ссылка должна быть валидным URL.' }),
    notOneOf: () => ({ key: 'RSS уже существует' }),
  },
});

const validate = (url, urlUniqueLinks) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url('Ссылка должна быть валидным URL!')
      .notOneOf(urlUniqueLinks, 'RSS уже существует')
      .required(),
  });
  return schema.validate({ url });
};

export default validate;
