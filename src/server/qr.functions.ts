import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { qrCodes } from "../db/schema";
import * as QRCode from "qrcode";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Server-side validation schema
const qrCodeSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .url("Please enter a valid URL"),
});

export const createQRCode = createServerFn({
  method: "POST",
})
  .validator((data: { url: string }) => {
    return qrCodeSchema.parse(data);
  })
  .handler(async ({ data }) => {
    const url = data.url;

    // Only runs after server-side validation succeeds
    const pngDataUrl = await QRCode.toDataURL(url);

    const id = crypto.randomUUID();

    const [qrCode] = await db
      .insert(qrCodes)
      .values({
        id,
        url,
        pngDataUrl,
      })
      .returning();

    return qrCode;
  });

// GET QR HISTORY
export const getQRHistory = createServerFn({
  method: "GET",
}).handler(async () => {
  const rows = await db
    .select()
    .from(qrCodes);

  return rows;
});

// DELETE ONE QR CODE
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
    await db
      .delete(qrCodes)
      .where(eq(qrCodes.id, data.id));

    return {
      success: true,
    };
  });

// CLEAR ALL QR CODES
export const clearAllQRCodes = createServerFn({
  method: "POST",
}).handler(async () => {
  await db.delete(qrCodes);

  return {
    success: true,
  };
});