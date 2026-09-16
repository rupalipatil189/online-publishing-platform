import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { ArticleService } from '../../../core/services/article.service';
import { AuthService } from '../../../core/services/auth.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-my-listing',
  standalone: true,

  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],

  templateUrl: './my-articles.component.html',
  styleUrl: './my-articles.component.scss',
})
export class MyArticlesComponent implements OnInit {
  private readonly articleService = inject(ArticleService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  articles = signal<Article[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadMyArticles();
  }

  loadMyArticles(): void {
    const user = this.authService.currentUser();

    // User is not logged in
    if (!user) {
      return;
    }

    this.loading.set(true);

    this.articleService.getAllArticles().subscribe({
      next: (articles) => {
        const myArticles = articles.filter(
          (article) => String(article.authorId) === String(user.uid),
        );

        // Latest first
        myArticles.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        this.articles.set(myArticles);

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading articles:', error);

        this.errorMessage.set('Unable to load your articles.');

        this.loading.set(false);
      },
    });
  }

  editArticle(article: Article): void {
    if (!article.id) {
      console.error('Article ID is missing');
      return;
    }

    this.router.navigate(['write/edit', article.id]);
  }

  deleteArticle(article: Article): void {
    if (!article.id) {
      console.error('Article ID is missing');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete "${article.title}"?`);

    if (!confirmed) {
      return;
    }

    this.articleService.deleteArticle(article.id).subscribe({
      next: () => {
        this.articles.update((articles) => articles.filter((item) => item.id !== article.id));

        this.successMessage.set('Article deleted successfully.');
      },

      error: (error) => {
        console.error('Delete article error:', error);

        this.errorMessage.set('Unable to delete article.');
      },
    });
  }

  viewArticle(article: Article): void {
    if (!article.id) {
      console.error('Article ID is missing');
      return;
    }

    this.router.navigate(['/article', article.id]);
  }

  getStatusClass(status: Article['status']): string {
    return status.toLowerCase();
  }
}
