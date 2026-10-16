import { MongoClient, Db } from 'mongodb'

const uri =
  process.env.RESPONSE_MANAGER_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'mongodb+srv://ananay:peYyvZH5S1KSTzD5@cluster0.7gpudbl.mongodb.net/esummit?retryWrites=true&w=majority&appName=Cluster0'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function getDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb

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
