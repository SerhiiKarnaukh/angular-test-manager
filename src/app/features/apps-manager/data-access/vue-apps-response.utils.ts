import { VueApp, VueAppsSearchResponse } from './vue-app.models';

export function normalizeVueAppsSearchResponse(data: VueAppsSearchResponse): VueApp[] {
  if (Array.isArray(data)) {
    return data;
  }

  return data.projects ?? [];
}
