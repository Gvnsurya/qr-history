# QR Generator — History & Bulk Export

A full-stack QR Code Generator built with **TanStack Start**, **Drizzle ORM**, and **Neon PostgreSQL**.

The application allows users to generate QR codes from valid URLs, store them permanently in PostgreSQL, search their QR history, download individual QR codes, export multiple QR codes as a ZIP file, and manage their history.

---

## ✨ Features

### QR Code Generation

- Generate QR codes from URLs
- QR generation happens on the server
- Generated QR code is returned as a PNG data URL
- Each QR code is stored permanently in PostgreSQL
- Invalid URLs are rejected with server-side validation
- Invalid URLs do not create database records

### Persistent QR History

- QR codes are stored in Neon PostgreSQL
- History survives browser refresh
- History is not stored in `localStorage`
- Each history item includes:
  - QR code preview
  - Original URL
  - Generated time

### Search

- Search QR history by URL
- Quickly find previously generated QR codes

### Download

- Download any previously generated QR code individually
- Previously generated QR images are read from the database
- QR codes are not regenerated when downloading

### Bulk Export

- Select multiple QR codes
- Select or unselect all QR codes
- Export selected QR codes as a single `.zip` file
- Each selected QR code is included as a valid PNG file
- Loading state is shown while the ZIP file is being generated

### History Management

- Delete individual QR codes
- Clear the complete QR history
- Confirmation before clearing all records
- Deleted records are removed from PostgreSQL immediately
- Deleted records do not return after page refresh

### Responsive UI

- Works on desktop and mobile devices
- Usable at approximately 375px screen width
- Clean and responsive QR history layout

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| TanStack Start | Full-stack React framework |
| React | User interface |
| TypeScript | Type safety |
| PostgreSQL | Database |
| Neon | Serverless PostgreSQL hosting |
| Drizzle ORM | Database ORM |
| Zod | Server-side URL validation |
| qrcode | QR code generation |
| JSZip | Bulk ZIP export |
| Tailwind CSS | Styling |

---

## 📁 Project Structure

```text
qr-history/
│
├── drizzle/
│   └── migrations/
│
├── src/
│   │
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   │
│   ├── routes/
│   │   └── index.tsx
│   │
│   ├── server/
│   │   └── qr.functions.ts
│   │
│   └── styles.css
│
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md