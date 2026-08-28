import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "../db";

import * as schema from "../db/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://qr-history-3cytp6xkz-gude-venkata-naga-suryas-projects.vercel.app",
  ],

  plugins: [tanstackStartCookies()],
});