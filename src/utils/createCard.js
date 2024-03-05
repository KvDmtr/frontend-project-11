const createCard = (container, title) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h4');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = title;
  cardBody.prepend(cardTitle);
  card.prepend(cardBody);
  container.prepend(card);
  const listOfElem = document.createElement('ul');
  listOfElem.classList.add('list-group', 'border-0', 'rounded-0', `${title === 'Посты' ? 'posts' : 'feeds'}`);
  card.append(listOfElem);
};

export default createCard;
