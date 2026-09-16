import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AuthorService } from '../../../core/services/author.service';
import { ArticleService } from '../../../core/services/article.service';

import { Author } from '../../../models/author.model';
import { Article } from '../../../models/article.model';

import { ArticleCardComponent } from '../../../shared/components/article-card/article-card.component';

@Component({
  selector: 'app-author-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ArticleCardComponent,
  ],
  templateUrl: './author-details.component.html',
  styleUrl: './author-details.component.scss',
})
export class AuthorDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authorService = inject(AuthorService);
  private readonly articleService = inject(ArticleService);

  author = signal<Author | null>(null);

  articles = signal<Article[]>([]);

  loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const authorId = params.get('id');

      if (authorId) {
        this.loadAuthor(authorId);
        this.loadAuthorArticles(authorId);
      }
    });
  }

  loadAuthor(authorId: string): void {
    this.authorService.getAuthorById(authorId).subscribe({
      next: (author) => {
        this.author.set(author);
      },

      error: (error) => {
        console.error('Failed to load author', error);

        this.author.set(null);
        this.loading.set(false);
      },
    });
  }

  loadAuthorArticles(authorId: string): void {
    this.articleService.getPublishedArticles().subscribe({
      next: (articles) => {
        const authorArticles = articles.filter((article) => article.authorId === authorId);

        this.articles.set(authorArticles);

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load author articles', error);

        this.loading.set(false);
      },
    });
  }

  articleCount = computed(() => this.articles().length);
}
