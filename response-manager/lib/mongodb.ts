import fs from 'fs/promises'
import path from 'path'

function getCandidatePaths(): string[] {
  return [
    path.join(process.cwd(), '../frontend/data/funding-conclave-applications.json'),
    path.join(process.cwd(), 'frontend/data/funding-conclave-applications.json'),
    path.join(process.cwd(), 'data/funding-conclave-applications.json'),
    path.resolve(process.cwd(), '..', 'frontend', 'data', 'funding-conclave-applications.json'),
  ]
}

async function resolveStoragePath(): Promise<string> {
  const candidates = getCandidatePaths()
  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // continue checking
    }
  }
  return candidates[0]
}

async function readAllRecords(): Promise<any[]> {
  try {
    const filePath = await resolveStoragePath()
    const raw = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeAllRecords(records: any[]): Promise<void> {
  try {
    const filePath = await resolveStoragePath()
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[Storage] Write error:', err)
  }
}

function matchesQuery(item: any, query: Record<string, any>): boolean {
  if (!query || Object.keys(query).length === 0) return true

  for (const [key, val] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(val)) {
      if (!val.some((sub) => matchesQuery(item, sub))) {
        return false
      }
      continue
    }

    if (val && typeof val === 'object' && '$regex' in val) {
      const regex = new RegExp(val.$regex, val.$options || 'i')
      const target = String(item[key] || '')
      if (!regex.test(target)) return false
      continue
    }

    if (val !== undefined && item[key] !== val) {
      return false
    }
  }

  return true
}

function matchesFilter(item: any, filter: Record<string, any>): boolean {
  if (filter.$or && Array.isArray(filter.$or)) {
    return filter.$or.some((sub) => matchesFilter(item, sub))
  }
  if (filter.applicationId) {
    return item.applicationId === filter.applicationId
  }
  if (filter._id) {
    return (
      item._id === filter._id ||
      item.applicationId === filter._id ||
      String(item._id) === String(filter._id)
    )
  }
  return matchesQuery(item, filter)
}

function getLocalDatabase() {
  return {
    collection: (_name: string) => ({
      find: (query: Record<string, any> = {}) => {
        let sortObj: Record<string, number> | undefined

        const toArray = async () => {
          const all = await readAllRecords()
          const matched = all.filter((item) => matchesQuery(item, query))

          if (sortObj && Object.keys(sortObj).length > 0) {
            const [field, dir] = Object.entries(sortObj)[0]
            matched.sort((a, b) => {
              const valA = a[field] || ''
              const valB = b[field] || ''
              if (dir === -1) {
                return valB > valA ? 1 : valB < valA ? -1 : 0
              }
              return valA > valB ? 1 : valA < valB ? -1 : 0
            })
          }

          return matched
        }

        return {
          sort: (s: Record<string, number>) => {
            sortObj = s
            return { toArray }
          },
          toArray,
        }
      },

      updateOne: async (
        filter: Record<string, any>,
        updateDoc: { $set?: Record<string, any> }
      ) => {
        const apps = await readAllRecords()
        const idx = apps.findIndex((item) => matchesFilter(item, filter))

        if (idx === -1) {
          return { matchedCount: 0, modifiedCount: 0 }
        }

        apps[idx] = {
          ...apps[idx],
          ...(updateDoc.$set || {}),
          updatedAt: new Date().toISOString(),
        }

        await writeAllRecords(apps)
        return { matchedCount: 1, modifiedCount: 1 }
      },

      deleteOne: async (filter: Record<string, any>) => {
        const apps = await readAllRecords()
        const initialLength = apps.length
        const remaining = apps.filter((item) => !matchesFilter(item, filter))

        if (remaining.length === initialLength) {
          return { deletedCount: 0 }
        }

        await writeAllRecords(remaining)
        return { deletedCount: initialLength - remaining.length }
      },
    }),
  }
}

let cachedDb: any = null

export async function getDatabase(): Promise<any> {
  const uri = process.env.DATABASE_URL
  if (uri && !uri.includes('127.0.0.1')) {
    try {
      if (cachedDb) return cachedDb
      const mongo = await (Function('return import("mongodb")')() as Promise<any>)
      const client = new mongo.MongoClient(uri, { serverSelectionTimeoutMS: 2000 })
      await client.connect()
      cachedDb = client.db('esummit')
      return cachedDb
    } catch {
      // Graceful fallback to file storage
    }
  }

  return getLocalDatabase()
}

export default null
