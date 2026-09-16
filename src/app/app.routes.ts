import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ArticlesListComponent } from './features/articles/article-list/article-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  // {
  //   path: 'explore',
  //   loadComponent: () =>
  //     import('./features/articles/article-list/article-list.component')
  //       .then(m => m.ArticleListComponent)
  // },

  {
    path: 'authors',
    loadComponent: () =>
      import('./features/authors/author-list/author-list.component').then(
        (m) => m.AuthorListComponent,
      ),
  },

  {
    path: 'author/:id',
    loadComponent: () =>
      import('./features/authors/author-details/author-details.component').then(
        (m) => m.AuthorDetailsComponent,
      ),
  },

  {
    path: 'articles',
    component: ArticlesListComponent,
  },

  {
    path: 'article/:id',
    loadComponent: () =>
      import('./features/articles/article-details/article-details.component').then(
        (m) => m.ArticleDetailsComponent,
      ),
  },

  {
    path: 'write',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/articles/create-article/create-article.component').then(
        (m) => m.CreateArticleComponent,
      ),
  },

  {
    path: 'write/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/articles/create-article/create-article.component').then(
        (m) => m.CreateArticleComponent,
      ),
  },

  {
    path: 'myArticles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/articles/my-articles/my-articles.component').then(
        (m) => m.MyArticlesComponent,
      ),
  },

  // AUTH
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'signup',
    component: SignupComponent,
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
