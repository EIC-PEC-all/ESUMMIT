'use client'
// components/Hero/HeroScene.tsx
// React Three Fiber signature element — wireframe launch-form geometry
// Only rendered on desktop; mobile gets a CSS fallback

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

function LaunchForm({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const innerRef = useRef<THREE.LineSegments>(null)
  const time = useRef(0)

  // Composite geometry: icosahedron + octahedron for the "launch vehicle silhouette"
  const { geo1, geo2, geo3 } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.4, 1)
    const oct = new THREE.OctahedronGeometry(0.9, 0)
    const tetra = new THREE.TetrahedronGeometry(1.8, 0)
    return { geo1: ico, geo2: oct, geo3: tetra }
  }, [])

  useFrame(({ clock }) => {
    time.current = clock.getElapsedTime()
    if (!meshRef.current || !edgesRef.current || !innerRef.current) return

    const mx = mouse.current?.x ?? 0
    const my = mouse.current?.y ?? 0

    // Slow base rotation
    meshRef.current.rotation.y = time.current * 0.12 + mx * 0.3
    meshRef.current.rotation.x = Math.sin(time.current * 0.07) * 0.15 + my * 0.2
    meshRef.current.rotation.z = Math.cos(time.current * 0.05) * 0.08

    edgesRef.current.rotation.y = time.current * 0.08 - mx * 0.2
    edgesRef.current.rotation.x = -Math.sin(time.current * 0.06) * 0.12 - my * 0.15
    edgesRef.current.rotation.z = Math.sin(time.current * 0.04) * 0.06

    innerRef.current.rotation.y = -time.current * 0.15 + mx * 0.1
    innerRef.current.rotation.x = Math.cos(time.current * 0.09) * 0.1

    // Subtle breathing scale
    const breathe = 1 + Math.sin(time.current * 0.4) * 0.03
    meshRef.current.scale.setScalar(breathe)
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Outer wireframe — ignite red */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[geo3]} />
        <lineBasicMaterial color="#FF4D3D" transparent opacity={0.35} />
      </lineSegments>

      {/* Mid mesh wireframe — signal cyan */}
      <mesh ref={meshRef}>
        <primitive object={geo1} />
        <meshBasicMaterial color="#3DD9FF" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Inner solid — subtle fill */}
      <lineSegments ref={innerRef}>
        <edgesGeometry args={[geo2]} />
        <lineBasicMaterial color="#F5F3EE" transparent opacity={0.12} />
      </lineSegments>

      {/* Point light for depth */}
      <pointLight color="#FF4D3D" intensity={1.5} distance={5} position={[2, 1, 2]} />
      <pointLight color="#3DD9FF" intensity={0.8} distance={5} position={[-2, -1, 1]} />
    </group>
  )
}

interface HeroSceneProps {
  mouse: React.RefObject<{ x: number; y: number }>
  scrollY: React.RefObject<number>
}

export default function HeroScene({ mouse, scrollY }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.15} />
      <LaunchForm mouse={mouse} />
    </Canvas>
  )
}
