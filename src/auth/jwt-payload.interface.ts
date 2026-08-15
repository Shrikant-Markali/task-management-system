export interface JwtPayload {
  sub: string; // user id
  isGuest: boolean;
}