import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TabernaUserOrder } from '@features/taberna/profiles/data-access/taberna-profile.models';

import { OrderSummaryComponent } from './order-summary.component';

const mockOrder: TabernaUserOrder = {
  id: 1,
  order_number: '100',
  created_at: '2026-01-01',
  tax: 10,
  order_total: 110,
  payment: { status: 'paid', payment_method: 'stripe' },
  order_products: [
    {
      id: 11,
      quantity: 2,
      product_price: 50,
      product: {
        id: 5,
        name: 'Pumps',
        price: 50,
        image: '/pumps.jpg',
        get_absolute_url: '/taberna-store/category/shoes/pumps',
      },
      variations: [{ id: 1, variation_category: 'color', variation_value: 'red' }],
    },
  ],
};

describe('OrderSummaryComponent', () => {
  let fixture: ComponentFixture<OrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummaryComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSummaryComponent);
    fixture.componentRef.setInput('order', mockOrder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display order number', () => {
    expect(fixture.nativeElement.textContent).toContain('Order #100');
  });

  it('should display product name', () => {
    expect(fixture.nativeElement.textContent).toContain('Pumps');
  });

  it('should compute line total', () => {
    const component = fixture.componentInstance;
    expect(component['lineTotal'](mockOrder.order_products[0])).toBe(100);
  });
});
