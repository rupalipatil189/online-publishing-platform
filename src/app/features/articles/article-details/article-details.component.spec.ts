import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailsComponent } from './article-details.component';

describe('ArticleDetailsComponent', () => {
  let component: ArticleDetailsComponent;
  let fixture: ComponentFixture<ArticleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
