export type LoginSource = 'taberna' | 'social';

export type RegistrationSource = 'taberna' | 'social_network';

export interface JwtLoginCredentials {
  email: string;
  password: string;
  login_source?: LoginSource;
  activeApp?: string;
  cart_id?: string;
}

export interface JwtTokenPair {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  registration_source: RegistrationSource;
}

export interface AlertMessage {
  value: string[];
  type: 'error' | 'success' | 'warning';
}
