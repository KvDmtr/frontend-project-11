import i18next from 'i18next';
import resources from './locales/ru.js';
import watch from './view.js';
import validate from './utils/indexYup.js';

export default async () => {
  const defaultLang = 'ru';

  const form = document.querySelector('form');
  const input = form.querySelector('input');

  const state = {
    url: '',
    errors: '',
    isValid: false,
    urlUniqueLinks: [],
    posts: [],
    feeds: [],
  };

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  const watchedState = watch(i18n, state);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { value } = input;
    watchedState.url = value;
    validate(state.url, watchedState.urlUniqueLinks)
      .then(() => {
        watchedState.isValid = true;
        watchedState.urlUniqueLinks.push(value);
        watchedState.errors = '';
        watchedState.url = '';
      })
      .catch((error) => {
        watchedState.isValid = false;
        watchedState.errors = error.message;
      });
  });
};
