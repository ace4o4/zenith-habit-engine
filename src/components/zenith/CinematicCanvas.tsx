import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Scene() {
  const ico = useRef<THREE.Mesh>(null);
  const plane = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse globally (canvas is pointer-events-none)
  if (typeof window !== "undefined" && !(window as any).__zenithMouseHooked) {
    (window as any).__zenithMouseHooked = true;
    window.addEventListener("pointermove", (e) => {
      const m = (window as any).__zenithMouse ?? { x: 0, y: 0 };
      m.x = (e.clientX / window.innerWidth - 0.5) * 2;
      m.y = (e.clientY / window.innerHeight - 0.5) * 2;
      (window as any).__zenithMouse = m;
    });
  }

  useFrame((_, delta) => {
    const m = (typeof window !== "undefined" && (window as any).__zenithMouse) || {
      x: 0,
      y: 0,
    };
    mouse.current.x += (m.x - mouse.current.x) * 0.04;
    mouse.current.y += (m.y - mouse.current.y) * 0.04;

    if (ico.current) {
      ico.current.rotation.y += delta * 0.08;
      ico.current.rotation.x = mouse.current.y * 0.25;
      ico.current.rotation.z = mouse.current.x * 0.15;
    }
    if (plane.current) {
      plane.current.rotation.z += delta * 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} intensity={1} color="#4facfe" />
      <pointLight position={[-8, -4, -6]} intensity={0.6} color="#00f2fe" />

      {/* Wireframe icosahedron */}
      <mesh ref={ico} position={[0, 0, 0]} scale={2.6}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#4facfe" wireframe transparent opacity={0.55} />
      </mesh>

      {/* Background topographic plane */}
      <mesh ref={plane} position={[0, 0, -4]} rotation={[-Math.PI / 2.4, 0, 0]} scale={8}>
        <planeGeometry args={[2, 2, 24, 24]} />
        <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.18} />
      </mesh>
    </>
  );
}

export function CinematicCanvas() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: 0.18 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
      {/* Vignette + radial glow overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(79,172,254,0.10), transparent 55%), radial-gradient(circle at 80% 90%, rgba(0,242,254,0.06), transparent 50%)",
        }}
      />
    </div>
  );
}
