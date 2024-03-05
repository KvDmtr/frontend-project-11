const parseData = (data) => {
  const feeds = [];
  const posts = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const parserErrors = doc.querySelector('parsererror');

  if (parserErrors !== null) {
    const error = new Error();
    error.name = 'parserError';
    throw error;
  }

  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;
  feeds.push({ title: feedTitle, description: feedDescription });

  const items = doc.querySelectorAll('item');
  Array.from(items).forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    posts.push({ title: postTitle, link: postLink, description: postDescription });
  });

  return { posts, feeds };
};

export default parseData;
