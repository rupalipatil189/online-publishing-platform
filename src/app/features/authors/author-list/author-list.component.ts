import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../models/author.model';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.scss',
})
export class AuthorListComponent implements OnInit {
  private readonly authorService = inject(AuthorService);

  authors = signal<Author[]>([]);

  searchText = signal('');

  loading = signal(true);

  filteredAuthors = computed(() => {
    const search = this.searchText().trim().toLowerCase();

    if (!search) {
      return this.authors();
    }

    return this.authors().filter((author) => author.name.toLowerCase().includes(search));
  });

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors.set(authors);
        this.loading.set(false);
      },

      error: (error) => {
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchText.set(input.value);
  }

  clearSearch(): void {
    this.searchText.set('');
  }
}
