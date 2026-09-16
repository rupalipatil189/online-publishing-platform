import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../models/article.model';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    ArticleCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly articleService = inject(ArticleService);

  articles = signal<Article[]>([]);

  ngOnInit(): void {
    this.articleService.getPublishedArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles);
      },
      error: (error) => {
        console.error('Failed to load articles', error);
      },
    });
  }

  featuredArticles = computed(() =>
    this.articles()
      .filter((article) => article.featured)
      .slice(0, 3),
  );
}
