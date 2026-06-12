export const SOCIAL_DEFAULT_AVATAR =
  'https://doodleipsum.com/700/avatar-4?i=be176fd7d38de78c85dbfba873eb723a';

export interface SocialPostAuthor {
  id: number;
  slug: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface SocialPostAttachment {
  id: number;
  image_url: string;
}

export interface SocialPost {
  id: number;
  body: string;
  created_at_formatted: string;
  likes_count: number;
  comments_count: number;
  is_private: boolean;
  created_by: SocialPostAuthor;
  attachments: SocialPostAttachment[];
}

export interface SocialComment {
  id: number;
  body: string;
  created_at_formatted: string;
  created_by: SocialPostAuthor;
}

export interface SocialPostDetail extends SocialPost {
  comments: SocialComment[];
}

export interface SocialTrend {
  id: string;
  hashtag: string;
  occurences: number;
}

export interface SocialSearchProfile {
  id: number;
  slug: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  friends_count: number;
  posts_count: number;
}

export interface PaginatedPostsPayload {
  results: { posts: SocialPost[] };
  next: string | null;
}

export interface SocialViewedProfileSummary {
  id: number;
  slug: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url: string | null;
  friends_count: number;
  posts_count: number;
}

export interface ProfilePostsPayload {
  results: {
    posts: SocialPost[];
    profile: SocialViewedProfileSummary;
    can_send_friendship_request: boolean | string;
  };
  next: string | null;
}

export interface SearchPostsPayload {
  results: {
    posts: SocialPost[];
    profiles: SocialSearchProfile[];
  };
  next: string | null;
}

export interface PostDetailResponse {
  post: SocialPostDetail;
}

export interface LikePostResponse {
  message: string;
}

export interface SelectedPostImage {
  url: string;
  file: File;
}

export const EMPTY_SOCIAL_POST_DETAIL: SocialPostDetail = {
  id: 0,
  body: '',
  created_at_formatted: '',
  likes_count: 0,
  comments_count: 0,
  is_private: false,
  created_by: {
    id: 0,
    slug: '',
    first_name: '',
    last_name: '',
    avatar_url: null,
  },
  attachments: [],
  comments: [],
};

export function getPathAndSearch(url: string): string {
  const urlObject = new URL(url);
  return urlObject.pathname + urlObject.search;
}
