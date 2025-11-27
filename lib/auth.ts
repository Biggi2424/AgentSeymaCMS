export type UserRole = "owner" | "admin" | "operator" | "viewer";

export interface SessionUser {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  role: UserRole;
}

/**
 * Platzhalter fuer spaetere Entra ID / OpenID-Integration.
 * Im MVP liefern wir einen festen Demo-User zurueck.
 */
export async function getCurrentUser(): Promise<SessionUser> {
  return {
    id: "demo-user",
    tenantId: "demo-tenant",
    email: "zephron.admin@vdma.example",
    displayName: "Zephron Admin",
    role: "owner",
  };
}
