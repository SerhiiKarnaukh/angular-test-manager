export interface VueApp {
  id: number;
  title: string;
  photo: string;
  url: string;
  view_url: string;
  github_url?: string;
}

export type VueAppsSearchResponse = VueApp[] | { projects: VueApp[] };
