import { MongoClient, Db } from 'mongodb'

const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/esummit?directConnection=true'

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromiseManager: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseManager) {
    client = new MongoClient(uri)
    global._mongoClientPromiseManager = client.connect()
  }
  clientPromise = global._mongoClientPromiseManager
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const connectedClient = await clientPromise
  return connectedClient.db('esummit')
}

export default clientPromise
