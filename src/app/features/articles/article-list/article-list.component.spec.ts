import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ArticlesListComponent } from './article-list.component';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../models/article.model';
import { of, throwError } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

describe('ArticlesListComponent', () => {
  let component: ArticlesListComponent;
  let fixture: ComponentFixture<ArticlesListComponent>;

  let articleService: {
    getPublishedArticles: ReturnType<typeof vi.fn>;
  };

  let mockWorker: {
    onmessage: ((event: MessageEvent) => void) | null;
    postMessage: ReturnType<typeof vi.fn>;
    terminate: ReturnType<typeof vi.fn>;
  };

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
      publishedAt: '2026-09-03',
      createdAt: '2026-09-03',
      status: 'PUBLISHED',
      featured: false,
      editorPick: false,
      likes: 50,
      views: 200,
      tags: ['Firebase', 'Authentication'],
    },
    {
      id: '3',
      title: 'Angular Testing',
      description: 'Learn Vitest testing',
      content: 'Testing content',
      thumbnail: 'testing.jpg',
      category: 'Testing',
      authorId: 'author3',
      authorName: 'Priya Shah',
      publishedAt: '2026-09-02',
      createdAt: '2026-09-02',
      status: 'PUBLISHED',
      featured: false,
      editorPick: true,
      likes: 150,
      views: 800,
      tags: ['Angular', 'Vitest'],
    },
  ];

  beforeEach(async () => {
    // ---------------------------------------------------------
    // Mock ArticleService
    // ---------------------------------------------------------

    articleService = {
      getPublishedArticles: vi.fn().mockReturnValue(of(mockArticles)),
    };

    // ---------------------------------------------------------
    // Mock Web Worker
    // ---------------------------------------------------------

    mockWorker = {
      onmessage: null,
      postMessage: vi.fn(),
      terminate: vi.fn(),
    };

    vi.stubGlobal(
      'Worker',
      vi.fn(function WorkerMock() {
        return mockWorker;
      }),
    );

    // ---------------------------------------------------------
    // Configure TestBed
    // ---------------------------------------------------------

    await TestBed.configureTestingModule({
      imports: [ArticlesListComponent],
      providers: [
        {
          provide: ArticleService,
          useValue: articleService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Restore Vitest timers in case a test enabled fake timers
    vi.useRealTimers();

    // Restore all spies and mocks
    vi.restoreAllMocks();
  });

  // =========================================================
  // Component creation
  // =========================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // =========================================================
  // ngOnInit / loadArticles
  // =========================================================

  it('should call loadArticles on ngOnInit', () => {
    const loadArticlesSpy = vi.spyOn(component, 'loadArticles');

    component.ngOnInit();

    expect(loadArticlesSpy).toHaveBeenCalled();
  });

  it('should load published articles successfully', () => {
    component.loadArticles();

    expect(articleService.getPublishedArticles).toHaveBeenCalled();

    expect(component.articles()).toEqual(mockArticles);

    expect(component.searchedArticles()).toEqual(mockArticles);
  });

  it('should handle error while loading articles', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    articleService.getPublishedArticles.mockReturnValue(throwError(() => new Error('API error')));

    component.loadArticles();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load articles', expect.any(Error));
  });

  // =========================================================
  // filteredArticles - latest
  // =========================================================

  it('should sort articles by latest by default', () => {
    component.searchedArticles.set(mockArticles);

    const result = component.filteredArticles();

    expect(result.map((article) => article.id)).toEqual(['2', '3', '1']);
  });

  // =========================================================
  // filteredArticles - popular
  // =========================================================

  it('should sort articles by popularity', () => {
    component.searchedArticles.set(mockArticles);

    component.sortBy.set('popular');

    const result = component.filteredArticles();

    expect(result.map((article) => article.id)).toEqual(['3', '1', '2']);
  });

  // =========================================================
  // filteredArticles - editor
  // =========================================================

  it('should return only editor pick articles', () => {
    component.searchedArticles.set(mockArticles);

    component.sortBy.set('editor');

    const result = component.filteredArticles();

    expect(result.map((article) => article.id)).toEqual(['1', '3']);
  });

  // =========================================================
  // paginatedArticles
  // =========================================================

  it('should return first page of articles', () => {
    component.searchedArticles.set(mockArticles);

    component.pageSize.set(2);
    component.pageIndex.set(0);

    const result = component.paginatedArticles();

    expect(result.length).toBe(2);

    expect(result.map((article) => article.id)).toEqual(['2', '3']);
  });

  it('should return second page of articles', () => {
    component.searchedArticles.set(mockArticles);

    component.pageSize.set(2);
    component.pageIndex.set(1);

    const result = component.paginatedArticles();

    expect(result.length).toBe(1);

    expect(result[0].id).toBe('1');
  });

  // =========================================================
  // onSearch
  // =========================================================

  it('should update search text when searching', () => {
    const event = {
      target: {
        value: 'Angular',
      },
    } as unknown as Event;

    component.onSearch(event);

    expect(component.searchText()).toBe('Angular');
  });

  it('should reset page index when searching', () => {
    component.pageIndex.set(3);

    const event = {
      target: {
        value: 'Angular',
      },
    } as unknown as Event;

    component.onSearch(event);

    expect(component.pageIndex()).toBe(0);
  });

  // =========================================================
  // Web Worker + debounce
  // =========================================================

  it('should send search request to worker after debounce', () => {
    vi.useFakeTimers();

    const event = {
      target: {
        value: 'Angular',
      },
    } as unknown as Event;

    component.articles.set(mockArticles);

    component.onSearch(event);

    // 300ms debounce has not completed yet.
    expect(mockWorker.postMessage).not.toHaveBeenCalled();

    // Move Vitest timer forward by 300ms.
    vi.advanceTimersByTime(300);

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      articles: mockArticles,
      search: 'Angular',
    });
  });

  it('should not send duplicate search requests because of distinctUntilChanged', () => {
    vi.useFakeTimers();

    component.articles.set(mockArticles);

    const event1 = {
      target: {
        value: 'Angular',
      },
    } as unknown as Event;

    const event2 = {
      target: {
        value: 'Angular',
      },
    } as unknown as Event;

    component.onSearch(event1);

    vi.advanceTimersByTime(300);

    component.onSearch(event2);

    vi.advanceTimersByTime(300);

    expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
  });

  // =========================================================
  // Web Worker message
  // =========================================================

  it('should update searchedArticles when worker returns results', () => {
    const workerResults = [mockArticles[0], mockArticles[2]];

    expect(mockWorker.onmessage).toBeTruthy();

    mockWorker.onmessage?.({
      data: workerResults,
    } as MessageEvent);

    expect(component.searchedArticles()).toEqual(workerResults);

    expect(component.pageIndex()).toBe(0);
  });

  // =========================================================
  // onSortChange
  // =========================================================

  it('should change sort option', () => {
    component.onSortChange('popular');

    expect(component.sortBy()).toBe('popular');
  });

  it('should reset page index when sort changes', () => {
    component.pageIndex.set(3);

    component.onSortChange('editor');

    expect(component.sortBy()).toBe('editor');

    expect(component.pageIndex()).toBe(0);
  });

  // =========================================================
  // onPageChange
  // =========================================================

  it('should update page index and page size', () => {
    const event: PageEvent = {
      pageIndex: 2,
      pageSize: 10,
      length: 30,
      previousPageIndex: 1,
    };

    component.onPageChange(event);

    expect(component.pageIndex()).toBe(2);

    expect(component.pageSize()).toBe(10);
  });

  it('should scroll to top when page changes', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    const event: PageEvent = {
      pageIndex: 1,
      pageSize: 5,
      length: 20,
      previousPageIndex: 0,
    };

    component.onPageChange(event);

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  // =========================================================
  // clearSearch
  // =========================================================

  it('should clear search text', () => {
    component.searchText.set('Angular');

    component.clearSearch();

    expect(component.searchText()).toBe('');
  });

  it('should reset page index when search is cleared', () => {
    component.pageIndex.set(3);

    component.clearSearch();

    expect(component.pageIndex()).toBe(0);
  });

  it('should restore all articles when search is cleared', () => {
    component.articles.set(mockArticles);

    component.searchedArticles.set([mockArticles[0]]);

    component.clearSearch();

    expect(component.searchedArticles()).toEqual(mockArticles);
  });

  // =========================================================
  // ngOnDestroy
  // =========================================================

  it('should terminate the worker on destroy', () => {
    component.ngOnDestroy();

    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should complete the search subject on destroy', () => {
    /*
     * Access private property only for testing purposes.
     */
    const searchSubject = (
      component as unknown as {
        searchSubject: {
          isStopped: boolean;
        };
      }
    ).searchSubject;

    component.ngOnDestroy();

    expect(searchSubject.isStopped).toBe(true);
  });
});
