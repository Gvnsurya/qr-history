import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { db } from "../db";
import { qrCodes } from "../db/schema";
import { auth } from "../lib/auth";
import * as QRCode from "qrcode";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

// GET CURRENT LOGGED-IN USER
async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in.");
  }

  return session.user;
}

// VALIDATION
const qrCodeSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .url("Please enter a valid URL"),
});

// CREATE QR CODE
export const createQRCode = createServerFn({
  method: "POST",
})
  .validator((data: { url: string }) => {
    return qrCodeSchema.parse(data);
  })
  .handler(async ({ data }) => {
    const user = await getCurrentUser();

    const url = data.url;

    // Generate QR image
    const pngDataUrl = await QRCode.toDataURL(url);

    const id = crypto.randomUUID();

    const [qrCode] = await db
      .insert(qrCodes)
      .values({
        id,
        userId: user.id,
        url,
        pngDataUrl,
      })
      .returning();

    return qrCode;
  });

// GET ONLY CURRENT USER'S QR HISTORY
export const getQRHistory = createServerFn({
  method: "GET",
}).handler(async () => {
  const user = await getCurrentUser();

  const rows = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, user.id));

  return rows;
});

// DELETE ONLY CURRENT USER'S QR CODE
export const deleteQRCode = createServerFn({
  method: "POST",
})
  .validator((data: { id: string }) => {
    return z
      .object({
        id: z.string().min(1, "QR code ID is required"),
      })
      .parse(data);
  })
  .handler(async ({ data }) => {
    const user = await getCurrentUser();

    await db
      .delete(qrCodes)
      .where(
        and(
          eq(qrCodes.id, data.id),
          eq(qrCodes.userId, user.id)
        )
      );

    return {
      success: true,
    };
  });

// CLEAR ONLY CURRENT USER'S QR CODES
export const clearAllQRCodes = createServerFn({
  method: "POST",
}).handler(async () => {
  const user = await getCurrentUser();

  await db
    .delete(qrCodes)
    .where(eq(qrCodes.userId, user.id));

  return {
    success: true,
  };
});