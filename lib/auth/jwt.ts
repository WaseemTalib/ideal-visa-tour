import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const ALG = "HS256";
const EXPIRATION = "7d";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = JWTPayload & {
  sub: string;
  email: string;
  role: string;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set. Add a long random string to .env.");
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters for HS256.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: { sub: string; email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] });
  return payload as SessionPayload;
}
