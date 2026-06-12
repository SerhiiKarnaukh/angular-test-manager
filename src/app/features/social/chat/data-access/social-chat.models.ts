export interface SocialChatUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface SocialConversationListItem {
  id: number;
  modified_at_formatted: string;
  users: SocialChatUser[];
}

export interface SocialChatMessage {
  id: number;
  body: string;
  created_at_formatted: string;
  created_by: SocialChatUser;
}

export interface SocialActiveConversation {
  id: number;
  messages: SocialChatMessage[];
}

export const EMPTY_ACTIVE_CONVERSATION: SocialActiveConversation = {
  id: 0,
  messages: [],
};
