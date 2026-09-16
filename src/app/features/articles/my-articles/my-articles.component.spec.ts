import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyArticlesComponent } from './my-articles.component';

describe('MyArticlesComponent', () => {
  let component: MyArticlesComponent;
  let fixture: ComponentFixture<MyArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyArticlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyArticlesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
