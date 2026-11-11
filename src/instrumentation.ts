import type { Instrumentation } from "next";
import { cleanPath } from "@/lib/urls";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { migrateIfConfigured } = await import("@/lib/db");
    await migrateIfConfigured();
  }
}

export const onRequestError: Instrumentation.onRequestError = async (error, request) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { logError } = await import("@/lib/db");
  await logError(error, cleanPath(request.path));
};
