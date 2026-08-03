import { OAuth2Client } from "google-auth-library";

export interface VerifiedGoogleIdentity {
  subject: string;
  email: string;
}

let client: OAuth2Client | undefined;

const getGoogleClientId = (): string => {
  const clientId = process.env.GOOGLE_WEB_CLIENT_ID;
  if (!clientId) {
    throw new Error("Google authentication is not configured");
  }
  return clientId;
};

export const verifyGoogleIdToken = async (
  idToken: string
): Promise<VerifiedGoogleIdentity> => {
  if (!idToken) {
    throw new Error("Google ID token is required");
  }

  const audience = getGoogleClientId();
  client = client || new OAuth2Client(audience);
  const ticket = await client.verifyIdToken({ idToken, audience });
  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw new Error("Google account email is not verified");
  }

  return {
    subject: payload.sub,
    email: payload.email.toLowerCase(),
  };
};
