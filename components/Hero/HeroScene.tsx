'use client'
// components/Hero/HeroScene.tsx
// React Three Fiber signature 3D set-piece: Torus-Knot polyhedron with glowing volt yellow wireframe edges

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function VoltageTorusKnot({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  // TorusKnot + Octahedron core
  const { geoTorus, geoCore } = useMemo(() => {
    const torus = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16)
    const core = new THREE.OctahedronGeometry(0.7, 0)
    return { geoTorus: torus, geoCore: core }
  }, [])

  useFrame(({ clock }) => {
    time.current = clock.getElapsedTime()
    if (!meshRef.current || !edgesRef.current || !coreRef.current) return

    const mx = mouse.current?.x ?? 0
    const my = mouse.current?.y ?? 0

    // Smooth electric rotation
    meshRef.current.rotation.y = time.current * 0.2 + mx * 0.4
    meshRef.current.rotation.x = Math.sin(time.current * 0.1) * 0.25 + my * 0.3

    edgesRef.current.rotation.y = time.current * 0.2 + mx * 0.4
    edgesRef.current.rotation.x = Math.sin(time.current * 0.1) * 0.25 + my * 0.3

    coreRef.current.rotation.y = -time.current * 0.3 - mx * 0.3
    coreRef.current.rotation.x = Math.cos(time.current * 0.15) * 0.2

    // Pulsing current pulse
    const pulse = 1 + Math.sin(time.current * 0.8) * 0.04
    meshRef.current.scale.setScalar(pulse)
    edgesRef.current.scale.setScalar(pulse)
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Torus-Knot Metallic Black Body */}
      <mesh ref={meshRef}>
        <primitive object={geoTorus} />
        <meshPhongMaterial
          color="#0A0A0A"
          emissive="#151515"
          specular="#F5D400"
          shininess={80}
          transparent
          opacity={0.8}
          flatShading
        />
      </mesh>

      {/* Electric Volt Yellow Emissive Wireframe Edge Highlight */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[geoTorus]} />
        <lineBasicMaterial color="#F5D400" transparent opacity={0.75} linewidth={1.5} />
      </lineSegments>

      {/* Glowing Energy Core */}
      <mesh ref={coreRef}>
        <primitive object={geoCore} />
        <meshBasicMaterial color="#F5D400" wireframe transparent opacity={0.5} />
      </mesh>

      {/* Electric Lighting */}
      <pointLight color="#F5D400" intensity={3.5} distance={7} position={[3, 2, 3]} />
      <pointLight color="#8A7600" intensity={2} distance={6} position={[-3, -2, 2]} />
      <directionalLight color="#F2F2ED" intensity={0.8} position={[0, 4, 4]} />
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
      <ambientLight intensity={0.2} />
      <VoltageTorusKnot mouse={mouse} />
    </Canvas>
  )
}
