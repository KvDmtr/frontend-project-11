import onChange from 'on-change';

const input = document.querySelector('input');
const feedBackElem = document.querySelector('.feedback');
const staticElements = {
  rssAggregatorTitle: document.querySelector('#title'),
  rssAggregatorDesc: document.querySelector('#description'),
  formPlaceholder: document.querySelector('#placeholder'),
  formButton: document.querySelector('button[aria-label="add"]'),
  formExample: document.querySelector('#example'),
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

  const watchedState = onChange(state, (path) => {
    // eslint-disable-next-line default-case
    switch (path) {
      case 'errors':
        renderErrors(watchedState);
        break;
      case 'isValid':
        renderErrors(watchedState);
        break;
    }
  });

  renderTexts();

  return watchedState;
};
