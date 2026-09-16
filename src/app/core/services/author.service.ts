import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Author } from '../../models/author.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getAuthors() {
    return this.http.get<Author[]>(`${this.apiUrl}/authors`);
  }

  getAuthorById(id: string) {
    return this.http.get<Author>(`${this.apiUrl}/authors/${id}`);
  }
}
