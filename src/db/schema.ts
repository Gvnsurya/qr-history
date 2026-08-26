import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const qrCodes = pgTable("qr_codes", {
  id: text("id").primaryKey(),

  userId: text("user_id").notNull(),

  url: text("url").notNull(),

  pngDataUrl: text("png_data_url").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});