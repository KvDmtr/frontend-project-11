import onChange from 'on-change';
import createCard from './utils/createCard.js';

const input = document.querySelector('input');
const feedBackElem = document.querySelector('.feedback');
const postsContainer = document.querySelector('.posts');
const feedsContainer = document.querySelector('.feeds');
const staticElements = {
  rssAggregatorTitle: document.querySelector('#title'),
  rssAggregatorDesc: document.querySelector('#description'),
  formPlaceholder: document.querySelector('#placeholder'),
  formButton: document.querySelector('button[aria-label="add"]'),
  formExample: document.querySelector('#example'),
};
const modalElements = {
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  readMoreBtn: document.querySelector('.full-article'),
  modalCloseBtn: document.querySelector('.btn-secondary'),
};

export default (i18n, state) => {
  const renderTexts = () => {
    const arrayOfElements = Object.entries(staticElements);
    arrayOfElements.forEach(([key, value]) => {
      const element = value;
      element.textContent = i18n.t(`interfaceTexts.${key}`);
    });
  };

  const renderErrors = (watchedState) => {
    input.classList.remove('is-invalid');
    feedBackElem.classList.remove('text-danger', 'text-success');
    if (watchedState.isValid) {
      feedBackElem.classList.add('text-success');
      feedBackElem.textContent = i18n.t('feedBackTexts.correctUrl');
      input.value = '';
      input.focus();
    } else {
      feedBackElem.classList.add('text-danger');
      feedBackElem.textContent = i18n.t(watchedState.errors);
      input.classList.add('is-invalid');
    }
  };

  const renderPosts = (watchedState) => {
    if (!postsContainer.childNodes.length) {
      createCard(postsContainer, i18n.t('posts'));
    }
    const listForPosts = document.querySelector('ul.posts');
    listForPosts.innerHTML = '';
    watchedState.posts.forEach(({
      title, link, id,
    }) => {
      const itemLi = document.createElement('li');
      itemLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const buttonPost = document.createElement('button');
      buttonPost.setAttribute('type', 'button');
      buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      buttonPost.dataset.bsToggle = 'modal';
      buttonPost.dataset.bsTarget = '#modal';
      buttonPost.dataset.postId = id;
      buttonPost.textContent = `${i18n.t('interfaceTexts.view')}`;
      const linkToPost = document.createElement('a');
      linkToPost.textContent = title;
      linkToPost.setAttribute('href', link);
      linkToPost.setAttribute('id', id);
      linkToPost.setAttribute('target', '_blank');
      linkToPost.classList.add('fw-bold');
      itemLi.append(linkToPost, buttonPost);
      listForPosts.append(itemLi);
    });
  };

  const renderFeeds = (watchedState) => {
    if (!feedsContainer.childNodes.length) {
      createCard(feedsContainer, i18n.t('feeds'));
    }
    const listForFeeds = document.querySelector('ul.feeds');
    watchedState.feeds.forEach(({
      title, description,
    }) => {
      const itemLi = document.createElement('li');
      itemLi.classList.add('list-group-item', 'border-0', 'border-end-0');
      const feedTitle = document.createElement('h6');
      feedTitle.classList.add('m-0');
      feedTitle.textContent = title;
      const feedDesc = document.createElement('p');
      feedDesc.classList.add('m-0', 'small', 'text-black-50');
      feedDesc.textContent = description;
      itemLi.append(feedTitle);
      itemLi.append(feedDesc);
      listForFeeds.prepend(itemLi);
    });
  };

  const renderModal = (watchedState) => {
    const activePost = watchedState.posts
      .find((post) => post.id === watchedState.uiState.touchedPostId);
    const { title, link, description } = activePost;
    const {
      modalTitle,
      modalBody,
      readMoreBtn,
      modalCloseBtn,
    } = modalElements;

    modalTitle.textContent = title;
    modalBody.textContent = description;
    readMoreBtn.textContent = i18n.t('interfaceTexts.readBtn');
    readMoreBtn.href = link;
    modalCloseBtn.textContent = i18n.t('interfaceTexts.closeBtn');
  };

  const renderTouchedPosts = (watchedState) => {
    const { touchedPostsIds } = watchedState.uiState;
    touchedPostsIds.forEach((postId) => {
      const post = document.getElementById(postId);
      if (!post.classList.contains('fw-normal')) {
        post.classList.remove('fw-bold');
        post.classList.add('fw-normal', 'link-secondary');
      }
    });
  };

  const watchedState = onChange(state, (path) => {
    // eslint-disable-next-line default-case
    switch (path) {
      case 'errors':
        renderErrors(watchedState);
        break;
      case 'isValid':
        renderErrors(watchedState);
        break;
      case 'posts':
        renderPosts(watchedState);
        break;
      case 'feeds':
        renderFeeds(watchedState);
        break;
      case 'uiState.touchedPostId':
        renderModal(watchedState);
        break;
      case 'uiState.touchedPostsIds':
        renderTouchedPosts(watchedState);
        break;
    }
  });

  renderTexts();

  return watchedState;
};
