import i18next from 'i18next';
import 'bootstrap';
import axios from 'axios';
import { uniqueId } from 'lodash';
import resources from './locales/ru.js';
import watch from './view.js';
import validate from './utils/validate.js';
import createURL from './utils/createUrl.js';
import parseData from './utils/parser.js';
import updatePosts from './utils/updatePosts.js';

const delay = 5000;

const form = document.querySelector('form');
const elements = {
  input: document.querySelector('input'),
  postsContainer: document.querySelector('.posts'),
  feedBackElem: document.querySelector('.feedback'),
  feedsContainer: document.querySelector('.feeds'),
  staticElements: {
    rssAggregatorTitle: document.querySelector('#title'),
    rssAggregatorDesc: document.querySelector('#description'),
    formPlaceholder: document.querySelector('#placeholder'),
    formButton: document.querySelector('button[aria-label="add"]'),
    formExample: document.querySelector('#example'),
  },
  modalElements: {
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    readMoreBtn: document.querySelector('.full-article'),
    modalCloseBtn: document.querySelector('.btn-secondary'),
  },
};

export default async () => {
  const defaultLang = 'ru';

  const state = {
    errors: '',
    isValid: false,
    posts: [],
    feeds: [],
    uiState: {
      touchedPostsIds: new Set(),
      touchedPostId: '',
    },
  };

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  const watchedState = watch(i18n, state, elements);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    validate(url, watchedState.feeds)
      .then(() => axios.get(createURL(url)))
      .then((response) => {
        const responseData = response.data.contents;
        const { posts, feeds } = parseData(responseData);
        const postsWithId = posts.map((post) => ({ ...post, id: uniqueId() }));
        const feedsWithId = feeds.map((feed) => ({ ...feed, link: url, id: uniqueId() }));
        watchedState.isValid = true;
        watchedState.posts.unshift(...postsWithId);
        watchedState.feeds.unshift(...feedsWithId);
        watchedState.errors = '';
      })
      .catch((error) => {
        watchedState.isValid = false;
        switch (error.name) {
          case 'AxiosError':
            watchedState.errors = 'feedBackTexts.networkError';
            break;
          case 'parserError':
            watchedState.errors = 'feedBackTexts.invalidRSSResource';
            break;
          default:
            watchedState.errors = error.message;
            break;
        }
      });
  });

  setTimeout(() => updatePosts(watchedState), delay);

  elements.postsContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      const postId = e.target.id;
      watchedState.uiState.touchedPostsIds.add(postId);
    }

    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const { postId } = button.dataset;
      watchedState.uiState.touchedPostsIds.add(postId);
      watchedState.uiState.touchedPostId = postId;
    }
  });
};
