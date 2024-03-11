import i18next from 'i18next';
import 'bootstrap';
import axios from 'axios';
import { uniqueId } from 'lodash';
import resources from './locales/ru.js';
import watch from './view.js';
import validate from './utils/indexYup.js';
import createURL from './utils/createUrl.js';
import parseData from './utils/parser.js';
import updatePosts from './utils/updatePosts.js';

export default async () => {
  const defaultLang = 'ru';

  const form = document.querySelector('form');
  const postsContainer = document.querySelector('.posts');

  const state = {
    errors: '',
    isValid: false,
    urlUniqueLinks: [],
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

  const watchedState = watch(i18n, state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    validate(url, watchedState.urlUniqueLinks)
      .then(() => axios.get(createURL(url)))
      .then((response) => {
        const responseData = response.data.contents;
        const { posts, feeds } = parseData(responseData);
        const postsWithId = posts.map((post) => ({ ...post, id: uniqueId() }));
        const feedsWithId = feeds.map((feed) => ({ ...feed, id: uniqueId() }));
        watchedState.isValid = true;
        watchedState.urlUniqueLinks.push(url);
        watchedState.posts.unshift(...postsWithId);
        watchedState.feeds = feedsWithId;
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

  updatePosts(watchedState);

  postsContainer.addEventListener('click', (e) => {
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
