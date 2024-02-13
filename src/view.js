import onChange from 'on-change';

export default (state) => {
  const input = document.querySelector('input');
  const feedBackElem = document.querySelector('.feedback');

  const renderErrors = (watchedState) => {
    input.classList.remove('is-invalid');
    feedBackElem.classList.remove('text-danger', 'text-success');
    if (watchedState.isValid) {
      feedBackElem.classList.add('text-success');
      feedBackElem.textContent = 'RSS успешно загружен';
      input.value = '';
      input.focus();
    } else {
      feedBackElem.classList.add('text-danger');
      feedBackElem.textContent = state.errors;
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
  return watchedState;
};
