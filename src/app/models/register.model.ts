export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}