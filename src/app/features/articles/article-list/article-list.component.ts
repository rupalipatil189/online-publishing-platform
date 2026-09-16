import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Article } from '../../../models/article.model';
import { ArticleService } from '../../../core/services/article.service';
import { PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ArticleCardComponent } from '../../../shared/components/article-card/article-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-article-list',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    ArticleCardComponent,
    PaginationComponent,
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  private readonly articleService = inject(ArticleService);

  articles = signal<Article[]>([]);

  searchText = signal('');
  searchedArticles = signal<Article[]>([]);
  sortBy = signal<'latest' | 'popular' | 'editor'>('latest');

  pageIndex = signal(0);

  pageSize = signal(5);
  private worker?: Worker;
  private searchSubject = new Subject<string>();

  constructor() {
    if (typeof Worker !== 'undefined') {
      //web worker
      this.worker = new Worker(new URL('../../../workers/article-search.worker', import.meta.url));

      this.worker.onmessage = ({ data }) => {
        this.searchedArticles.set(data);
        this.pageIndex.set(0);
      };
    }

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((search) => {
      this.worker?.postMessage({
        articles: this.articles(),
        search,
      });
    });
  }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getPublishedArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.searchedArticles.set(articles);
      },
      error: (error) => {
        console.error('Failed to load articles', error);
      },
    });
  }

  filteredArticles = computed(() => {
    let result = [...this.searchedArticles()]; //web worker

    switch (this.sortBy()) {
      case 'latest':
        result.sort(
          (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
        );
        break;

      case 'popular':
        result.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        break;

      case 'editor':
        result = result.filter((article) => article.editorPick);
        break;
    }

    return result;
  });

  paginatedArticles = computed(() => {
    const start = this.pageIndex() * this.pageSize();

    return this.filteredArticles().slice(start, start + this.pageSize());
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchText.set(input.value);
    this.pageIndex.set(0);

    this.searchSubject.next(input.value);
  }

  onSortChange(value: 'latest' | 'popular' | 'editor'): void {
    this.sortBy.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  clearSearch(): void {
    this.searchText.set('');
    this.pageIndex.set(0);

    this.searchedArticles.set(this.articles());
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
    this.searchSubject.complete();
  }
}
