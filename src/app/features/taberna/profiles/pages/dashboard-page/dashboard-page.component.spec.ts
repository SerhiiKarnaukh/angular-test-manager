import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabernaDashboardPageComponent } from './dashboard-page.component';

describe('TabernaDashboardPageComponent', () => {
  let fixture: ComponentFixture<TabernaDashboardPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabernaDashboardPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TabernaDashboardPageComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show empty state when user has no orders', async () => {
    fixture.detectChanges();

    const request = httpMock.expectOne('/taberna-profiles/api/v1/orders/');
    request.flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("You don't have any orders");
  });

  it('should render order summaries when orders exist', async () => {
    fixture.detectChanges();

    const request = httpMock.expectOne('/taberna-profiles/api/v1/orders/');
    request.flush([
      {
        id: 1,
        order_number: '100',
        created_at: '2026-01-01',
        tax: 10,
        order_total: 110,
        order_products: [],
      },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Order #100');
    expect(fixture.nativeElement.querySelector('app-order-summary')).toBeTruthy();
  });
});
