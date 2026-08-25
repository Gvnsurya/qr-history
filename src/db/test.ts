import { db } from "./index"
import { qrCodes } from "./schema"

async function testDatabase() {
  const result = await db.select().from(qrCodes)

  console.log("Database connected successfully!")
  console.log("QR codes:", result)
}

testDatabase()