import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Article } from '../../../models/article.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  article = input.required<Article>();

  variant = input<'default' | 'featured'>('default');
}
