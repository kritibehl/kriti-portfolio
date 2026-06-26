'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Grid, Line, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export type DiagnosticMode = 'healthy' | 'dns' | 'tcp' | 'http' | 'binding' | 'latency' | 'dependency';

type SceneProps = {
  mode: DiagnosticMode;
  reducedMotion?: boolean;
};

const nodeData: Array<{ id: string; label: string; position: [number, number, number] }> = [
  { id: 'client', label: 'CLIENT', position: [-5.7, 0.12, 0] },
  { id: 'dns', label: 'DNS', position: [-3.45, 0.28, 0] },
  { id: 'tcp', label: 'TCP', position: [-1.15, 0.12, 0] },
  { id: 'http', label: 'HTTP', position: [1.15, 0.28, 0] },
  { id: 'service', label: 'SERVICE', position: [3.45, 0.12, 0] },
  { id: 'dependency', label: 'DEPENDENCY', position: [5.7, 0.28, 0] },
];

const failureIndex: Record<DiagnosticMode, number | null> = {
  healthy: null,
  dns: 1,
  tcp: 2,
  http: 3,
  binding: 4,
  latency: null,
  dependency: 5,
};

function statusFor(index: number, mode: DiagnosticMode) {
  const failedAt = failureIndex[mode];
  if (mode === 'latency') return index >= 3 ? 'degraded' : 'healthy';
  if (failedAt === null) return 'healthy';
  if (index < failedAt) return 'healthy';
  if (index === failedAt) return mode === 'binding' ? 'warning' : 'failed';
  return 'idle';
}

function NetworkNode({ index, mode }: { index: number; mode: DiagnosticMode }) {
  const item = nodeData[index];
  const state = statusFor(index, mode);
  const color = state === 'failed' ? '#fb7185' : state === 'warning' ? '#fbbf24' : state === 'degraded' ? '#fb923c' : state === 'idle' ? '#334155' : '#34d399';
  const emissive = state === 'idle' ? '#020617' : color;
  const opacity = state === 'idle' ? 0.35 : 1;

  return (
    <Float speed={state === 'failed' ? 2.2 : 1.15} rotationIntensity={0.08} floatIntensity={state === 'failed' ? 0.4 : 0.16}>
      <group position={item.position}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.78, 2]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={state === 'failed' ? 1.6 : state === 'idle' ? 0.05 : 0.6} roughness={0.25} metalness={0.35} transparent opacity={opacity} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.038, 12, 64]} />
          <meshBasicMaterial color={color} transparent opacity={state === 'idle' ? 0.1 : 0.45} />
        </mesh>
        <mesh position={[0, -1.02, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={state === 'idle' ? 0.28 : 0.95} />
        </mesh>
      </group>
    </Float>
  );
}

function Packet({ curve, offset, mode, reducedMotion }: { curve: THREE.CatmullRomCurve3; offset: number; mode: DiagnosticMode; reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const failedAt = failureIndex[mode];
  const stopT = failedAt === null ? 0.99 : failedAt / (nodeData.length - 1);
  const speed = mode === 'latency' ? 0.045 : 0.105;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const raw = reducedMotion ? offset : (clock.elapsedTime * speed + offset) % 1;
    let progress = raw;

    if (failedAt !== null) {
      const movementWindow = 0.74;
      progress = raw <= movementWindow ? Math.min(stopT, (raw / movementWindow) * stopT) : stopT;
    }

    const point = curve.getPointAt(Math.min(0.999, progress));
    ref.current.position.copy(point);
    const pulse = reducedMotion ? 1 : 0.78 + Math.sin(clock.elapsedTime * 8 + offset * 20) * 0.18;
    ref.current.scale.setScalar(pulse);
  });

  const packetColor = mode === 'latency' ? '#fb923c' : failedAt !== null ? '#fb7185' : '#67e8f9';

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.19, 24, 24]} />
      <meshBasicMaterial color={packetColor} toneMapped={false} />
      <pointLight color={packetColor} intensity={4.4} distance={4.2} />
    </mesh>
  );
}

function Scene({ mode, reducedMotion = false }: SceneProps) {
  const group = useRef<THREE.Group>(null!);
  const points = useMemo(() => nodeData.map((node) => new THREE.Vector3(...node.position)), []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.08), [points]);
  const pathPoints = useMemo(() => curve.getPoints(110), [curve]);
  const failedAt = failureIndex[mode];

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.08, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.025, 0.035);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.15, 9.2]} fov={35} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 8, 10]} intensity={1.7} color="#dbeafe" castShadow />
      <pointLight position={[-6, 1, 4]} intensity={12} distance={16} color="#22d3ee" />
      <pointLight position={[6, 2, 3]} intensity={10} distance={16} color={mode === 'healthy' ? '#34d399' : '#fb7185'} />

      <group ref={group} position={[0, 0.58, 0]}>
        <Line points={pathPoints} color="#334155" lineWidth={2.0} transparent opacity={0.85} />
        {nodeData.slice(0, -1).map((_, index) => {
          const next = index + 1;
          const segmentFailed = failedAt !== null && next === failedAt;
          const segmentAfter = failedAt !== null && next > failedAt;
          const segmentSlow = mode === 'latency' && index >= 2;
          const color = segmentFailed ? '#fb7185' : segmentSlow ? '#fb923c' : segmentAfter ? '#1e293b' : '#22d3ee';
          return (
            <Line
              key={`${mode}-${index}`}
              points={[points[index], points[next]]}
              color={color}
              lineWidth={segmentFailed ? 5.2 : segmentSlow ? 4.0 : 3.0}
              transparent
              opacity={segmentAfter ? 0.18 : 0.84}
              dashed={segmentAfter}
              dashSize={0.2}
              gapSize={0.16}
            />
          );
        })}

        {nodeData.map((_, index) => <NetworkNode key={nodeData[index].id} index={index} mode={mode} />)}
        {[0, 0.33, 0.66].map((offset) => <Packet key={offset} curve={curve} offset={offset} mode={mode} reducedMotion={reducedMotion} />)}
      </group>

      <Grid
        position={[0, -0.62, 0]}
        args={[22, 10]}
        cellSize={0.65}
        cellThickness={0.45}
        cellColor="#164e63"
        sectionSize={3.25}
        sectionThickness={0.7}
        sectionColor="#0e7490"
        fadeDistance={18}
        fadeStrength={1.5}
        infiniteGrid
      />
      <Sparkles count={reducedMotion ? 18 : 52} scale={[15, 3, 4]} size={1.5} speed={reducedMotion ? 0 : 0.25} color="#67e8f9" opacity={0.28} />
    </>
  );
}

export default function KubePulseDiagnosticScene({ mode, reducedMotion = false }: SceneProps) {
  return (
    <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }} shadows>
      <Scene mode={mode} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
