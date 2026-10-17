import { MongoClient, Db } from 'mongodb'

const uri =
  process.env.RESPONSE_MANAGER_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI ||
  ''

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function getDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb

  if (!uri) {
    throw new Error(
      'Database connection string is not configured. Please set RESPONSE_MANAGER_DATABASE_URL or DATABASE_URL in your environment.',
    )
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    })
    await cachedClient.connect()
  }

  cachedDb = cachedClient.db('esummit')
  return cachedDb
}

export default null
