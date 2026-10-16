// lib/mongodb.ts — Decoupled MongoDB helper
// Avoids bundling native mongodb driver in frontend client/server bundle

export async function getDatabase(): Promise<null> {
  return null
}

const dummyMongoDb = null
export default dummyMongoDb
