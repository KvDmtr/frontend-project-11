import watch from './view.js';
import validate from './utils/indexYup.js';

export default () => {
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

  const watchedState = watch(state);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { value } = input;
    state.url = value;
    validate(state.url, state.urlUniqueLinks)
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
