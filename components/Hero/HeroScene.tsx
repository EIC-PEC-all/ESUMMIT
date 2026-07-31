'use client'
// components/Hero/HeroScene.tsx
// R3F 3D set-piece: Torus-Knot polyhedron with Forest Green wireframe & Vibrant Orange emissive highlights

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function LogoTorusKnot({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  const { geoTorus, geoCore } = useMemo(() => {
    const torus = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16)
    const core = new THREE.OctahedronGeometry(0.75, 0)
    return { geoTorus: torus, geoCore: core }
  }, [])

  useFrame(({ clock }) => {
    time.current = clock.getElapsedTime()
    if (!meshRef.current || !edgesRef.current || !coreRef.current) return

    const mx = mouse.current?.x ?? 0
    const my = mouse.current?.y ?? 0

    meshRef.current.rotation.y = time.current * 0.2 + mx * 0.4
    meshRef.current.rotation.x = Math.sin(time.current * 0.1) * 0.25 + my * 0.3

    edgesRef.current.rotation.y = time.current * 0.2 + mx * 0.4
    edgesRef.current.rotation.x = Math.sin(time.current * 0.1) * 0.25 + my * 0.3

    coreRef.current.rotation.y = -time.current * 0.3 - mx * 0.3
    coreRef.current.rotation.x = Math.cos(time.current * 0.15) * 0.2

    const pulse = 1 + Math.sin(time.current * 0.8) * 0.04
    meshRef.current.scale.setScalar(pulse)
    edgesRef.current.scale.setScalar(pulse)
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Torus-Knot Body: Deep Emerald Tint */}
      <mesh ref={meshRef}>
        <primitive object={geoTorus} />
        <meshPhongMaterial
          color="#0D1110"
          emissive="#161F1B"
          specular="#FF9900"
          shininess={90}
          transparent
          opacity={0.85}
          flatShading
        />
      </mesh>

      {/* Wireframe Highlights: Forest Green */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[geoTorus]} />
        <lineBasicMaterial color="#1E4637" transparent opacity={0.85} linewidth={1.5} />
      </lineSegments>

      {/* Core Lightbulb Gear: Vibrant Orange Wireframe */}
      <mesh ref={coreRef}>
        <primitive object={geoCore} />
        <meshBasicMaterial color="#FF9900" wireframe transparent opacity={0.65} />
      </mesh>

      {/* Dual Lighting: Vibrant Orange & Forest Green Point Lights */}
      <pointLight color="#FF9900" intensity={3.8} distance={7} position={[3, 2, 3]} />
      <pointLight color="#1E4637" intensity={2.8} distance={6} position={[-3, -2, 2]} />
      <directionalLight color="#F9FAF6" intensity={0.8} position={[0, 4, 4]} />
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
      <ambientLight intensity={0.25} />
      <LogoTorusKnot mouse={mouse} />
    </Canvas>
  )
}
