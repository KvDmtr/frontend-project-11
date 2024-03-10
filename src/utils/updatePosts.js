import axios from 'axios';
import { uniqueId } from 'lodash';
import createUrl from './createUrl.js';
import parseData from './parser.js';

const updatePosts = (watchedState) => {
  const { urlUniqueLinks } = watchedState;
  const postPromises = urlUniqueLinks.map((link) => axios.get(createUrl(link))
    .then((response) => {
      const responseData = response.data.contents;
      const { posts } = parseData(responseData);

      posts.forEach((post) => {
        const isDuplicate = watchedState.posts
          .some((loadedPost) => loadedPost.title === post.title);
        if (!isDuplicate) {
          watchedState.posts.unshift({ ...post, id: uniqueId() });
        }
      });
    })
    .catch((error) => {
      throw error;
    }));

  Promise.all(postPromises)
    .finally(() => {
      setTimeout(() => updatePosts(watchedState), 5000);
    });
};

export default updatePosts;
