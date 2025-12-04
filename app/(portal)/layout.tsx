import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { getCurrentUser, UnauthenticatedError } from "@/lib/auth";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  try {
    const session = await getCurrentUser();

    return (
      <Suspense fallback={null}>
        <Shell session={session}>{children}</Shell>
      </Suspense>
    );
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      redirect("/login");
    }
    throw error;
  }
}
