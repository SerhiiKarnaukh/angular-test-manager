import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';

import { AppsManagerStore } from './apps-manager.store';

describe('AppsManagerStore', () => {
  let store: AppsManagerStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService],
    });

    store = TestBed.inject(AppsManagerStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads apps into state', async () => {
    const loadPromise = store.loadApps();
    const request = httpMock.expectOne('/api/v1/angular-apps/');
    request.flush([{ id: 1, title: 'Demo', photo: '', url: '', view_url: '' }]);
    await loadPromise;

    expect(store.apps()).toHaveLength(1);
    expect(store.isLoading()).toBe(false);
  });

  it('stores search query and results', async () => {
    const searchPromise = store.search('taberna');
    const request = httpMock.expectOne('/api/v1/angular-apps/search/');
    request.flush([]);
    await searchPromise;

    expect(store.query()).toBe('taberna');
    expect(store.apps()).toEqual([]);
  });
});
