import { VueApp } from './vue-app.models';
import { normalizeVueAppsSearchResponse } from './vue-apps-response.utils';

describe('normalizeVueAppsSearchResponse', () => {
  const apps: VueApp[] = [
    {
      id: 1,
      title: 'Taberna',
      photo: '/photo.jpg',
      url: 'https://example.com',
      view_url: 'https://demo.example.com',
    },
  ];

  it('returns array responses unchanged', () => {
    expect(normalizeVueAppsSearchResponse(apps)).toEqual(apps);
  });

  it('unwraps projects property', () => {
    expect(normalizeVueAppsSearchResponse({ projects: apps })).toEqual(apps);
  });
});
