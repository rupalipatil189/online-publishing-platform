import { TestBed } from '@angular/core/testing';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';

import { ArticleService } from './article.service';
import { Article } from '../../models/article.model';
import { environment } from '../../../environments/environment';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  const API_URL = environment.apiUrl+'/articles';

  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'Angular Signals',
      description: 'Learn Angular signals',
      content: 'Angular signals content',
      thumbnail: 'angular.jpg',
      category: 'Angular',
      authorId: 'author1',
      authorName: 'Rupali Patil',
      publishedAt: '2026-09-01',
      createdAt: '2026-09-01',
      status: 'PUBLISHED',
      featured: true,
      editorPick: true,
      likes: 100,
      views: 500,
      tags: ['Angular', 'Signals'],
    },
    {
      id: '2',
      title: 'Firebase Authentication',
      description: 'Learn Firebase',
      content: 'Firebase content',
      thumbnail: 'firebase.jpg',
      category: 'Firebase',
      authorId: 'author2',
      authorName: 'Amit Sharma',
      publishedAt: '2026-09-02',
      createdAt: '2026-09-02',
      status: 'DRAFT',
      featured: false,
      editorPick: false,
      likes: 50,
      views: 200,
      tags: ['Firebase', 'Authentication'],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all articles', () => {
    service.getAllArticles().subscribe((articles) => {
      expect(articles).toEqual(mockArticles);
      expect(articles.length).toBe(2);
    });

    const req = httpMock.expectOne(API_URL);

    expect(req.request.method).toBe('GET');

    req.flush(mockArticles);
  });

  it('should return only published articles', () => {
    service.getPublishedArticles().subscribe((articles) => {
      expect(articles.length).toBe(1);
      expect(articles[0].status).toBe('PUBLISHED');
      expect(articles[0].id).toBe('1');
    });

    const req = httpMock.expectOne(API_URL);

    expect(req.request.method).toBe('GET');

    req.flush(mockArticles);
  });

  it('should get article by id', () => {
    service.getArticleById('1').subscribe((article) => {
      expect(article).toEqual(mockArticles[0]);
      expect(article.id).toBe('1');
    });

    const req = httpMock.expectOne(`${API_URL}/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockArticles[0]);
  });

  it('should get articles by author id', () => {
    service.getArticlesByAuthor('author1').subscribe((articles) => {
      expect(articles.length).toBe(1);
      expect(articles[0].authorId).toBe('author1');
    });

    const req = httpMock.expectOne(`${API_URL}?authorId=author1`);

    expect(req.request.method).toBe('GET');

    req.flush([mockArticles[0]]);
  });

  it('should create an article', () => {
    const newArticle = mockArticles[0];

    service.createArticle(newArticle).subscribe((article) => {
      expect(article).toEqual(newArticle);
    });

    const req = httpMock.expectOne(API_URL);

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(newArticle);

    req.flush(newArticle);
  });

  it('should update an article', () => {
    const updateData: Partial<Article> = {
      title: 'Updated Angular Signals',
      likes: 150,
    };

    const updatedArticle = {
      ...mockArticles[0],
      ...updateData,
    };

    service.updateArticle('1', updateData).subscribe((article) => {
      expect(article).toEqual(updatedArticle);
      expect(article.title).toBe('Updated Angular Signals');
    });

    const req = httpMock.expectOne(`${API_URL}/1`);

    expect(req.request.method).toBe('PATCH');

    expect(req.request.body).toEqual(updateData);

    req.flush(updatedArticle);
  });

  it('should delete an article', () => {
    service.deleteArticle('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${API_URL}/1`);

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
