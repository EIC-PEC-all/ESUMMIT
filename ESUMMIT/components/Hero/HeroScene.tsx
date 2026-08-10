'use client'
// components/Hero/HeroScene.tsx
// R3F 3D set-piece: Extruded E-Cell PEC Logo Gear, Pulsing Lightbulb Core, & Orbiting 3D "PEC" / "E-SUMMIT" Badges (Forest Green & Vibrant Orange Theme)

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'

// 3D Gear Geometry (Forest Green Body with Extrusion)
function LogoGear() {
  const gearShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = 1.25
    const innerRadius = 0.85
    const teeth = 12
    const toothDepth = 0.22

    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2
      const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2
      const stepAngle = ((i + 1) / teeth) * Math.PI * 2

      const r1 = outerRadius + toothDepth
      const r2 = outerRadius

      if (i === 0) {
        shape.moveTo(Math.cos(angle) * r2, Math.sin(angle) * r2)
      } else {
        shape.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2)
      }

      shape.lineTo(Math.cos(angle + 0.08) * r1, Math.sin(angle + 0.08) * r1)
      shape.lineTo(Math.cos(nextAngle - 0.08) * r1, Math.sin(nextAngle - 0.08) * r1)
      shape.lineTo(Math.cos(nextAngle) * r2, Math.sin(nextAngle) * r2)
      shape.lineTo(Math.cos(stepAngle) * r2, Math.sin(stepAngle) * r2)
    }

    const holePath = new THREE.Path()
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
    shape.holes.push(holePath)

    return shape
  }, [])

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    }),
    []
  )

  return (
    <mesh geometry={new THREE.ExtrudeGeometry(gearShape, extrudeSettings)}>
      <meshPhongMaterial
        color="#1E4637"
        emissive="#0D241B"
        specular="#FF9900"
        shininess={100}
        flatShading
      />
    </mesh>
  )
}

function KineticLogoScene({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null)
  const gearGroupRef = useRef<THREE.Group>(null)
  const bulbRef = useRef<THREE.Mesh>(null)
  const orbit1Ref = useRef<THREE.Group>(null)
  const orbit2Ref = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame(({ clock }) => {
    time.current = clock.getElapsedTime()
    if (!groupRef.current) return

    const mx = mouse.current?.x ?? 0
    const my = mouse.current?.y ?? 0

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.35, 0.06)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -my * 0.25, 0.06)

    if (gearGroupRef.current) {
      gearGroupRef.current.rotation.z = time.current * 0.3
    }

    if (bulbRef.current) {
      const pulse = 1 + Math.sin(time.current * 2) * 0.05
      bulbRef.current.scale.setScalar(pulse)
    }

    if (orbit1Ref.current) {
      orbit1Ref.current.rotation.y = time.current * 0.45
      orbit1Ref.current.rotation.x = Math.sin(time.current * 0.3) * 0.15
    }
    if (orbit2Ref.current) {
      orbit2Ref.current.rotation.y = -time.current * 0.35 + Math.PI
      orbit2Ref.current.rotation.z = Math.cos(time.current * 0.3) * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Center Floating 3D Logo Gear */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={gearGroupRef}>
          <LogoGear />
        </group>
      </Float>

      {/* 2. Glowing Inner Lightbulb Core */}
      <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh ref={bulbRef} position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#FF9900"
            emissive="#FF9900"
            emissiveIntensity={1.3}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        <mesh position={[0, 0, 0.15]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.26, 0]} />
          <meshBasicMaterial color="#F9FAF6" wireframe />
        </mesh>
      </Float>

      {/* 3. Orbiting 3D "PEC" Badge */}
      <group ref={orbit1Ref}>
        <group position={[1.85, 0.65, 0]}>
          <Float speed={3.5} floatIntensity={0.6}>
            <Html transform distanceFactor={5.2} zIndexRange={[100, 0]}>
              <div className="px-3.5 py-1.5 rounded-lg bg-panel border-2 border-orange shadow-[0_0_20px_rgba(255,153,0,0.4)] flex items-center justify-center select-none backdrop-blur-md">
                <span className="font-display text-2xl tracking-wider text-primary leading-none block">
                  PEC
                </span>
              </div>
            </Html>
          </Float>
        </group>
      </group>

      {/* 4. Orbiting 3D "E-SUMMIT" Badge */}
      <group ref={orbit2Ref}>
        <group position={[-1.95, -0.75, 0.15]}>
          <Float speed={3} floatIntensity={0.5}>
            <Html transform distanceFactor={5.2} zIndexRange={[100, 0]}>
              <div className="px-4 py-1.5 rounded-lg bg-green border-2 border-orange shadow-[0_0_20px_rgba(255,153,0,0.4)] flex items-center justify-center select-none backdrop-blur-md">
                <span className="font-display text-xl tracking-wider text-orange leading-none block">
                  E-SUMMIT
                </span>
              </div>
            </Html>
          </Float>
        </group>
      </group>

      {/* 5. Orbital Energy Rings */}
      <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[2.35, 0.012, 16, 100]} />
          <meshBasicMaterial color="#FF9900" transparent opacity={0.4} />
        </mesh>
      </group>
      <group rotation={[-Math.PI / 4, -Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[2.1, 0.01, 16, 100]} />
          <meshBasicMaterial color="#1E4637" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 6. High-Voltage Lighting */}
      <pointLight color="#FF9900" intensity={4} distance={8} position={[3, 3, 4]} />
      <pointLight color="#1E4637" intensity={2.8} distance={7} position={[-3, -3, 3]} />
      <ambientLight intensity={0.4} />
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
      camera={{ position: [0, 0, 5.2], fov: 46 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <KineticLogoScene mouse={mouse} />
    </Canvas>
  )
}
