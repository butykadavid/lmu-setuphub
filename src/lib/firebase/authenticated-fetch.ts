import type { User } from "firebase/auth";

type AuthorizedJsonFetchInit = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
  forceRefresh?: boolean;
};

/**
 * Send a JSON request authenticated with a fresh Firebase ID token.
 */
export async function authorizedJsonFetch(
  user: User,
  input: RequestInfo | URL,
  init: AuthorizedJsonFetchInit = {}
) {
  const token = await user.getIdToken(init.forceRefresh ?? true);
  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${token}`);

  const hasBody = init.body !== undefined;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, {
    ...init,
    headers,
    body: hasBody ? JSON.stringify(init.body) : undefined,
  });
}