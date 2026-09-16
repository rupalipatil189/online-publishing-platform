import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../models/article.model';
import { ArticleCardComponent } from '../../../shared/components/article-card/article-card.component';
import { CommentComponent } from '../../comments/comment-section';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ArticleCardComponent,
    CommentComponent,
  ],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss',
})
export class ArticleDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService);

  article = signal<Article | null>(null);
  articles = signal<Article[]>([]);
  loading = signal(true);
  articleIdTest = signal<string>('');

  ngOnInit(): void {
    // Load all articles once
    this.loadArticles();

    this.route.paramMap.subscribe((params) => {
      const articleId = params.get('id');
      this.articleIdTest.set(articleId || '');
      if (articleId) {
        this.loadArticleById(articleId);
      }
    });
  }

  loadArticles(): void {
    this.articleService.getPublishedArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles);
      },

      error: (error) => {
        this.loading.set(false);
      },
    });
  }

  loadArticleById(articleId: string): void {
    this.loading.set(true);
    const selectedArticle = this.articles().find((article) => article.id === articleId);

    if (selectedArticle) {
      this.article.set(selectedArticle);
      this.loading.set(false);
    } else {
      // In case articles API hasn't completed yet
      this.articleService.getPublishedArticles().subscribe({
        next: (articles) => {
          this.articles.set(articles);

          const selectedArticle = articles.find((article) => article.id === articleId);

          this.article.set(selectedArticle ?? null);
          this.loading.set(false);
        },

        error: (error) => {
          this.article.set(null);
          this.loading.set(false);
        },
      });
    }
  }

  authorArticles = computed(() => {
    const currentArticle = this.article();

    if (!currentArticle) {
      return [];
    }

    return this.articles().filter(
      (article) => article.authorId === currentArticle.authorId && article.id !== currentArticle.id,
    );
  });

  relatedArticles = computed(() => {
    const currentArticle = this.article();

    if (!currentArticle) {
      return [];
    }

    const articles = this.articles().filter((article) => article.id !== currentArticle.id);
    const sameCategory = articles.filter((article) => article.category === currentArticle.category);
    const currentTags = currentArticle.tags ?? [];

    const sameTags = articles.filter((article) => {
      const articleTags = article.tags ?? [];

      return articleTags.some((tag) => currentTags.includes(tag));
    });

    const combined = [...sameCategory, ...sameTags];

    const uniqueArticles = combined.filter(
      (article, index, self) => self.findIndex((item) => item.id === article.id) === index,
    );

    return uniqueArticles;
  });
}
