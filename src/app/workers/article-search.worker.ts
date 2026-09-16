import { Article } from '../models/article.model';

addEventListener('message', ({ data }) => {
  const { articles, search } = data as {
    articles: Article[];
    search: string;
  };

  const searchTerm = search.trim().toLowerCase();

  if (!searchTerm) {
    postMessage(articles);
    return;
  }

  const result = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.authorName.toLowerCase().includes(searchTerm) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
  );

  postMessage(result);
});
