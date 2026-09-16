import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl+'/comments';

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  updateComment(id: string, comment: Partial<Comment>): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/${id}`, comment);
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
