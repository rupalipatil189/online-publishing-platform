import { Component, Input, OnInit, inject, signal } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],

  templateUrl: './comment-section.html',
  styleUrl: './comment-section.scss',
})
export class CommentComponent implements OnInit {
  @Input({ required: true })
  articleId!: string;

  private commentService = inject(CommentService);
  readonly authService = inject(AuthService);

  comments = signal<Comment[]>([]);

  newComment = '';

  replyText = '';

  replyingTo = signal<string | null>(null);

  sortBy = signal<'newest' | 'oldest' | 'liked'>('newest');

  loading = signal(false);

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading.set(true);
    console.log('articleis', this.articleId);
    this.commentService.getComments().subscribe({
      next: (comments) => {
        const newCm = comments.filter((data) => data.articleId == this.articleId);

        this.comments.set(newCm);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading comments:', error);
        this.loading.set(false);
      },
    });
  }

  get topLevelComments(): Comment[] {
    return this.sortComments(this.comments().filter((comment) => comment.parentId === null));
  }

  getReplies(parentId: string): Comment[] {
    return this.sortComments(this.comments().filter((comment) => comment.parentId === parentId));
  }

  private sortComments(comments: Comment[]): Comment[] {
    const result = [...comments];

    switch (this.sortBy()) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        break;

      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        break;

      case 'liked':
        result.sort((a, b) => b.likes - a.likes);

        break;
    }

    return result;
  }

  addComment(): void {
    const content = this.newComment.trim();

    const user = this.authService.currentUser();

    if (!user || !content) {
      return;
    }

    const comment: Comment = {
      articleId: this.articleId,

      userId: user.uid,

      userName: user.displayName || user.email || 'Anonymous',

      userAvatar: user.photoURL || 'https://i.pravatar.cc/150?img=12',

      content,

      parentId: null,

      likes: 0,

      likedBy: [],

      createdAt: new Date().toISOString(),
    };

    this.commentService.addComment(comment).subscribe({
      next: (savedComment) => {
        this.comments.update((comments) => [...comments, savedComment]);

        this.newComment = '';
      },

      error: (error) => {
        console.error('Error adding comment:', error);
      },
    });
  }

  startReply(commentId: string): void {
    this.replyingTo.set(commentId);

    this.replyText = '';
  }

  cancelReply(): void {
    this.replyingTo.set(null);

    this.replyText = '';
  }

  addReply(parentId: string): void {
    const content = this.replyText.trim();

    const user = this.authService.currentUser();

    if (!user || !content) {
      return;
    }

    const reply: Comment = {
      articleId: this.articleId,

      userId: user.uid,

      userName: user.displayName || user.email || 'Anonymous',

      userAvatar: user.photoURL || 'https://i.pravatar.cc/150?img=12',

      content,

      parentId,

      likes: 0,

      likedBy: [],

      createdAt: new Date().toISOString(),
    };

    this.commentService.addComment(reply).subscribe({
      next: (savedReply) => {
        this.comments.update((comments) => [...comments, savedReply]);

        this.replyingTo.set(null);

        this.replyText = '';
      },

      error: (error) => {
        console.error('Error adding reply:', error);
      },
    });
  }

  deleteComment(comment: Comment): void {
    const user = this.authService.currentUser();

    if (!user || !comment.id || comment.userId !== user.uid) {
      return;
    }

    this.commentService.deleteComment(comment.id).subscribe({
      next: () => {
        this.comments.update((comments) => comments.filter((item) => item.id !== comment.id));
      },

      error: (error) => {
        console.error('Error deleting comment:', error);
      },
    });
  }

  setSort(sort: 'newest' | 'oldest' | 'liked'): void {
    this.sortBy.set(sort);
  }
}
