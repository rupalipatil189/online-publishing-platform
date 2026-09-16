import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../models/article.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-article',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    NgxEditorModule,
  ],

  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss',
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private authService = inject(AuthService);

  editMode = signal(false);
  articleId = signal<string | null>(null);
  loading = signal(false);
  message = signal('');
  errorMessage = signal('');
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['ordered_list', 'bullet_list'],
    ['link'],
    ['text_color'],
    ['align_left', 'align_center', 'align_right'],
  ];

  categories = [
    'Technology',
    'Angular',
    'AI',
    'Programming',
    'Web Development',
    'Business',
    'Lifestyle',
  ];

  articleForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', Validators.maxLength(300)],
    content: ['', Validators.required],
    tags: [''],
    category: ['', Validators.required],
    thumbnail: [''],
    authorAvatar: [''],
  });

  ngOnInit(): void {
    this.editor = new Editor();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.articleId.set(id);
      this.loadArticle(id);
    } else {
      this.editMode.set(false);
      this.setDefaultAuthor();
    }
  }

  setDefaultAuthor(): void {
    const user = this.authService.currentUser();

    if (user?.photoURL) {
      this.articleForm.patchValue({
        authorAvatar: user.photoURL,
      });
    }
  }

  loadArticle(id: string): void {
    this.loading.set(true);

    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.articleForm.patchValue({
          title: article.title,
          description: article.description,
          content: article.content,
          tags: article.tags?.join(', ') || '',
          category: article.category,
          thumbnail: article.thumbnail,
          authorAvatar: article.authorAvatar,
        });

        this.loading.set(false);
      },

      error: (error) => {
        this.errorMessage.set('Unable to load article.');
        this.loading.set(false);
      },
    });
  }

  saveDraft(): void {
    this.saveArticle('DRAFT');
  }

  publish(): void {
    this.saveArticle('PUBLISHED');
  }

  private saveArticle(status: Article['status']): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();

      return;
    }
    this.loading.set(true);
    this.message.set('');
    this.errorMessage.set('');
    const user = this.authService.currentUser();
    const formValue = this.articleForm.getRawValue();
    const tags = formValue.tags
      ? formValue.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    if (this.editMode() && this.articleId()) {
      const updatedArticle: Partial<Article> = {
        title: formValue.title || '',
        description: formValue.description || '',
        content: formValue.content || '',
        tags,
        category: formValue.category || '',
        thumbnail: formValue.thumbnail || '',
        authorAvatar: formValue.authorAvatar || '',
        status,
        updatedAt: new Date().toISOString(),
      };

      this.articleService.updateArticle(this.articleId()!, updatedArticle).subscribe({
        next: () => {
          this.loading.set(false);
          this.message.set('Article updated successfully.');
          setTimeout(() => {
            this.router.navigate(['/my-listing']);
          }, 1000);
        },

        error: (error) => {
          console.error('Update error:', error);
          this.errorMessage.set('Unable to update article.');
          this.loading.set(false);
        },
      });
    } else {
      if (!user) {
        console.error('User is not logged in');
        return;
      }
      const newArticle: Article = {
        id: '',
        title: formValue.title || '',
        description: formValue.description || '',
        content: formValue.content || '',
        tags,
        category: formValue.category || '',
        thumbnail: formValue.thumbnail || '',
        authorId: user?.uid,
        authorName: user.displayName || user.email || 'Unknown Author',
        authorAvatar:
          formValue.authorAvatar || user?.photoURL || 'https://i.pravatar.cc/150?img=12',
        status,
        createdAt: new Date().toISOString(),
      };

      this.articleService.createArticle(newArticle).subscribe({
        next: () => {
          this.loading.set(false);
          this.message.set('Article created successfully.');
          setTimeout(() => {
            this.router.navigate(['/my-listing']);
          }, 1000);
        },

        error: (error) => {
          console.error('Create error:', error);
          this.errorMessage.set('Unable to create article.');
          this.loading.set(false);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }
}
