export type TopbarLinkKey = 'cv' | 'github' | 'linkedin';

export interface TopbarLink {
  key: TopbarLinkKey;
  url: string;
  title: string;
  icon_class: string;
  ordering: number;
}

export const TOPBAR_LINK_LABELS: Record<TopbarLinkKey, string> = {
  cv: 'CV',
  github: 'GitHub',
  linkedin: 'LinkedIn',
};
