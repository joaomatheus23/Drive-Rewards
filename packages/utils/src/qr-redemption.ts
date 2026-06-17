const DEEP_LINK_PREFIX = "drivenrewards://redeem";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Encodes a redemption token into a scannable deep-link payload. */
export function encodeRedemptionQrPayload(qrToken: string): string {
  return `${DEEP_LINK_PREFIX}?token=${encodeURIComponent(qrToken)}`;
}

/** Extracts the raw redemption token from a QR payload (deep link, JSON, or UUID). */
export function parseRedemptionQrPayload(raw: string): string {
  const trimmed = raw.trim();

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as { token?: string; t?: string };
      const token = parsed.token ?? parsed.t;
      if (token) return token;
    } catch {
      // fall through
    }
  }

  if (trimmed.startsWith("drivenrewards://")) {
    try {
      const url = new URL(trimmed);
      const token = url.searchParams.get("token");
      if (token) return token;

      const pathToken = url.pathname.replace(/^\/+/, "").split("/").pop();
      if (pathToken && UUID_RE.test(pathToken)) return pathToken;
    } catch {
      // fall through
    }
  }

  if (UUID_RE.test(trimmed)) return trimmed;

  return trimmed;
}
