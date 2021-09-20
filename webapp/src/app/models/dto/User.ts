export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  token: string;
}
