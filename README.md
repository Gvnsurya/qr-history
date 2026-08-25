# QR Generator — History & Bulk Export

A full-stack QR code generator built with TanStack Start, PostgreSQL (Neon), and Drizzle ORM.

The application generates QR codes on the server, stores them permanently in PostgreSQL, and allows users to search, download, delete, clear, and bulk export QR codes as PNG files inside a ZIP archive.

## Features

- Generate QR codes from valid URLs
- Server-side URL validation using Zod
- Invalid URLs are rejected and are not saved to the database
- QR codes are generated on the server
- Persistent QR history using PostgreSQL
- QR history survives page refresh and browser restart
- Individual QR code download
- Select multiple QR codes
- Bulk export selected QR codes as a ZIP file
- Delete individual QR codes
- Clear all QR codes with confirmation
- Responsive layout

## Tech Stack

- TanStack Start
- TypeScript
- PostgreSQL
- Neon
- Drizzle ORM
- Zod
- qrcode
- JSZip

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- A Neon PostgreSQL database

## Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd qr-history