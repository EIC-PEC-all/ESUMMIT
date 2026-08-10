import { CAMPUS_GRAPH, CAMPUS_VENUES } from '@/lib/data'
import type { CampusGraphNode, CampusVenue } from '@/lib/data'

interface GraphNode {
  id: string
  coords: [number, number]
  neighbors: string[]
}

function buildGraph(): Record<string, GraphNode> {
  const graph: Record<string, GraphNode> = {}
  
  for (const [id, node] of Object.entries(CAMPUS_GRAPH.nodes)) {
    graph[id] = {
      id,
      coords: [node.coords[0], node.coords[1]] as [number, number],
      neighbors: [...node.connections] as string[],
    }
  }
  
  return graph
}

function haversineDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lon1, lat1] = coord1
  const [lon2, lat2] = coord2
  const R = 6371000 // Earth radius in meters
  
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function dijkstra(
  graph: Record<string, GraphNode>,
  startId: string,
  endId: string
): string[] | null {
  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const visited = new Set<string>()
  const queue: Array<{ id: string; dist: number }> = []
  
  for (const id of Object.keys(graph)) {
    distances[id] = Infinity
    previous[id] = null
  }
  
  distances[startId] = 0
  queue.push({ id: startId, dist: 0 })
  
  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist)
    const { id: currentId } = queue.shift()!
    
    if (visited.has(currentId)) continue
    if (currentId === endId) break
    
    visited.add(currentId)
    
    const currentNode = graph[currentId]
    if (!currentNode) continue
    
    for (const neighborId of currentNode.neighbors) {
      if (visited.has(neighborId)) continue
      if (!graph[neighborId]) continue
      
      const weight = haversineDistance(currentNode.coords, graph[neighborId].coords)
      const newDist = distances[currentId] + weight
      
      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist
        previous[neighborId] = currentId
        
        const existingIndex = queue.findIndex((q) => q.id === neighborId)
        if (existingIndex >= 0) {
          queue[existingIndex].dist = newDist
        } else {
          queue.push({ id: neighborId, dist: newDist })
        }
      }
    }
  }
  
  if (distances[endId] === Infinity) return null
  
  const path: string[] = []
  let current: string | null = endId
  while (current) {
    path.unshift(current)
    current = previous[current]
  }
  
  return path
}

export function findShortestPath(
  origin: [number, number],
  destination: [number, number]
): { path: string[]; coordinates: [number, number][]; distance: number; duration: number } | null {
  const graph = buildGraph()
  
  // Find nearest graph node to origin
  let nearestOrigin = ''
  let minOriginDist = Infinity
  
  for (const [id, node] of Object.entries(graph)) {
    const dist = haversineDistance(origin, node.coords)
    if (dist < minOriginDist) {
      minOriginDist = dist
      nearestOrigin = id
    }
  }
  
  // Find nearest graph node to destination
  let nearestDest = ''
  let minDestDist = Infinity
  
  for (const [id, node] of Object.entries(graph)) {
    const dist = haversineDistance(destination, node.coords)
    if (dist < minDestDist) {
      minDestDist = dist
      nearestDest = id
    }
  }
  
  if (!nearestOrigin || !nearestDest) return null
  
  const path = dijkstra(graph, nearestOrigin, nearestDest)
  if (!path) return null
  
  // Build full coordinates array: origin -> path nodes -> destination
  const coordinates: [number, number][] = [origin]
  
  for (const nodeId of path) {
    coordinates.push(graph[nodeId].coords)
  }
  
  coordinates.push(destination)
  
  // Calculate total distance
  let totalDistance = 0
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += haversineDistance(coordinates[i], coordinates[i + 1])
  }
  
  // Duration in seconds (walking speed 1.4 m/s)
  const duration = totalDistance / CAMPUS_GRAPH.walkingSpeedMps
  
  return {
    path,
    coordinates,
    distance: totalDistance,
    duration,
  }
}

export function getVenueCoordinates(venueId: string): [number, number] | null {
  const venue = CAMPUS_VENUES[venueId as keyof typeof CAMPUS_VENUES]
  return venue?.coordinates || null
}

export function getAllVenueCoordinates(): [number, number][] {
  return Object.values(CAMPUS_VENUES).map((v) => v.coordinates)
}