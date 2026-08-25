import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { qrCodes } from "../db/schema";
import * as QRCode from "qrcode";

export const createQRCode = createServerFn({ method: "POST" })
  .validator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const url = data.url.trim();

    if (!url) {
      throw new Error("URL is required");
    }

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

export const getQRHistory = createServerFn({ method: "GET" }).handler(
  async () => {
    const rows = await db.select().from(qrCodes);

    return rows;
  },
);