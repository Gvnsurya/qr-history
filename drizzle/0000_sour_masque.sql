CREATE TABLE "qr_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"png_data_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
