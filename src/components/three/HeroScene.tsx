"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Envelope } from "./Envelope";

/**
 * The WebGL canvas for the hero. Loaded with next/dynamic (ssr: false),
 * so three.js never blocks the first paint of the HTML headline.
 * Rendering pauses whenever the hero is off-screen.
 */
export default function HeroScene({ progress }: { progress: RefObject<number> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [interactive, setInteractive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability check
    setInteractive(window.matchMedia("(pointer: fine)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-out ${
        ready ? "opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Canvas
        onCreated={() => requestAnimationFrame(() => setReady(true))}
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        flat
        fallback={null}
      >
        <ambientLight intensity={1.25} />
        <directionalLight position={[3, 4, 5]} intensity={1.5} />
        <directionalLight position={[-4, -1, 3]} intensity={0.4} color="#f3d9b5" />
        <Suspense fallback={null}>
          <Envelope progress={progress} interactive={interactive} />
        </Suspense>
        <ContactShadows position={[0, -1.95, 0]} opacity={0.3} scale={9} blur={2.6} far={4} />
      </Canvas>
    </div>
  );
}
