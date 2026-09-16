import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Article } from '../../models/article.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly http = inject(HttpClient);

  private readonly API_URL = environment.apiUrl+'/articles';

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.API_URL);
  }

  getPublishedArticles(): Observable<Article[]> {
    return this.http
      .get<Article[]>(this.API_URL)
      .pipe(map((articles) => articles.filter((article) => article.status === 'PUBLISHED')));
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.API_URL}/${id}`);
  }

  getArticlesByAuthor(authorId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.API_URL}?authorId=${authorId}`);
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.API_URL, article);
  }

  updateArticle(id: string, article: Partial<Article>): Observable<Article> {
    return this.http.patch<Article>(`${this.API_URL}/${id}`, article);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
