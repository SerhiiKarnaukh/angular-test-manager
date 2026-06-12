export const SOCIAL_DEFAULT_AVATAR =
  'https://doodleipsum.com/700/avatar-4?i=be176fd7d38de78c85dbfba873eb723a';

export interface SocialUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  slug: string;
  full_name: string;
  avatar_url: string | null;
}

export interface SocialViewedProfile {
  id: number;
  slug: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url: string | null;
  friends_count: number;
  posts_count: number;
}

export interface SocialFriendUser {
  id: number;
  slug: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  friends_count: number;
  posts_count: number;
}

export interface SocialFriendSuggestion {
  id: number;
  slug: string;
  full_name: string;
  avatar_url: string | null;
}

export interface FriendshipRequest {
  id: number;
  created_by: SocialFriendUser;
}

export interface FriendsDataResponse {
  requests: FriendshipRequest[];
  friends: SocialFriendUser[];
  user: SocialViewedProfile;
}

export interface EditProfileResponse {
  message: string;
  new_slug: string;
  new_avatar: string | null;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface FriendRequestResponse {
  message: string;
}

export const SOCIAL_USER_STORAGE_KEYS: (keyof SocialUser)[] = [
  'id',
  'username',
  'first_name',
  'last_name',
  'email',
  'slug',
  'full_name',
  'avatar_url',
];

export const EMPTY_SOCIAL_USER: SocialUser = {
  id: 0,
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  slug: '',
  full_name: '',
  avatar_url: null,
};
