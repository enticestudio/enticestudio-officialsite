"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Envelope dimensions (world units)
const W = 3.2;
const H = 2.1;
const FLAP_H = 1.3;

const C = {
  back: "#d8c6ab",
  pocket: "#f5ecdd",
  flap: "#eadbc3",
  card: "#fffdf8",
  gold: "#c8a97e",
  ink: "#0e0e0e",
};

const { clamp, lerp, damp } = THREE.MathUtils;
/** progress of p inside the [a, b] window, eased */
const seg = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t); // smoothstep
};

export function Envelope({ progress, interactive }: { progress: RefObject<number>; interactive: boolean }) {
  const rig = useRef<THREE.Group>(null!);
  const env = useRef<THREE.Group>(null!);
  const flap = useRef<THREE.Group>(null!);
  const seal = useRef<THREE.Group>(null!);
  const card = useRef<THREE.Group>(null!);
  const smooth = useRef(0);

  // When the scene is shown again (e.g. returning to the home page), jump straight to the
  // current scroll progress instead of easing over from wherever it was when you left.
  useEffect(() => {
    smooth.current = progress.current ?? 0;
  }, [progress]);

  const viewport = useThree((s) => s.viewport);
  // shrink on narrow (phone) viewports so the envelope always fits
  const fit = Math.min(0.82, viewport.width / (W + 0.8));

  const [wordmark, monogram] = useTexture(["/brand/wordmark-black.png", "/brand/monogram-white.png"], (loaded) => {
    for (const t of [loaded].flat()) t.colorSpace = THREE.SRGBColorSpace;
  });

  // Front pocket: the classic V-shaped fold that hides the bottom of the card.
  const pocketGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-W / 2, -H / 2);
    s.lineTo(W / 2, -H / 2);
    s.lineTo(W / 2, H / 2 - 0.02);
    s.lineTo(0, -0.12);
    s.lineTo(-W / 2, H / 2 - 0.02);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  // Top flap, drawn hanging down from its hinge at y = 0 (local).
  const flapGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-W / 2, 0);
    s.lineTo(W / 2, 0);
    s.lineTo(0.12, -FLAP_H + 0.06);
    s.quadraticCurveTo(0, -FLAP_H - 0.02, -0.12, -FLAP_H + 0.06);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  // Thin gold frame printed on the card
  const frameGeo = useMemo(() => {
    const w = 2.5, h = 1.55;
    const pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2], [-w / 2, -h / 2]].map(
      ([x, y]) => new THREE.Vector3(x, y, 0),
    );
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state, dt) => {
    smooth.current = damp(smooth.current, progress.current ?? 0, 6, dt);
    const p = smooth.current;

    // 1 · break the seal (0 → 0.12)
    const sealT = seg(p, 0, 0.12);
    seal.current.scale.setScalar(1 - sealT);
    seal.current.rotation.z = sealT * Math.PI;

    // 2 · open the flap (0.05 → 0.35)
    const flapT = seg(p, 0.05, 0.35);
    flap.current.rotation.x = -Math.PI * flapT;
    // once past vertical, tuck the flap behind the card so the card can slide over it
    flap.current.position.z = flapT > 0.5 ? -0.03 : 0.035;

    // 3 · card rises out (0.3 → 0.65), rig lowers to keep it framed
    const riseT = seg(p, 0.3, 0.65);
    // 4 · card flies toward the viewer, envelope drops away (0.65 → 1)
    const flyT = seg(p, 0.65, 1);

    // rig starts below the headline, then lowers further while the card rises
    rig.current.position.y = lerp(-0.6, -1.25, riseT);
    card.current.position.y = lerp(lerp(-0.08, 1.9, riseT), 1.55, flyT);
    card.current.position.z = lerp(0, 1.4, flyT);
    card.current.rotation.x = lerp(0, -0.08, flyT);
    env.current.position.y = lerp(0, -8, flyT);

    // idle sway + pointer tilt
    const t = state.clock.elapsedTime;
    const px = interactive ? state.pointer.x : 0;
    const py = interactive ? state.pointer.y : 0;
    const sway = interactive ? 1 - flyT : 0;
    rig.current.rotation.y = damp(rig.current.rotation.y, px * 0.28 + Math.sin(t * 0.6) * 0.06 * sway, 4, dt);
    rig.current.rotation.x = damp(rig.current.rotation.x, -py * 0.16 + Math.sin(t * 0.8) * 0.03 * sway, 4, dt);
    rig.current.rotation.z = lerp(-0.05, 0, Math.max(riseT, flyT));
  });

  return (
    <group scale={fit}>
      <group ref={rig}>
        {/* the card (local origin at its centre) */}
        <group ref={card}>
          <mesh>
            <planeGeometry args={[2.85, 1.85]} />
            {/* emissive keeps the card reading as bright paper, not grey, at any angle */}
            <meshStandardMaterial color={C.card} emissive={C.card} emissiveIntensity={0.55} roughness={0.85} />
          </mesh>
          <lineSegments geometry={frameGeo} position={[0, 0, 0.002]}>
            <lineBasicMaterial color={C.gold} />
          </lineSegments>
          <mesh position={[0, 0.06, 0.004]}>
            <planeGeometry args={[1.55, 1.55 * (527 / 1264)]} />
            <meshBasicMaterial map={wordmark} transparent toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.55, 0.004]}>
            <circleGeometry args={[0.035, 24]} />
            <meshBasicMaterial color={C.gold} />
          </mesh>
        </group>

        {/* the envelope */}
        <group ref={env}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[W, H]} />
            <meshStandardMaterial color={C.back} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={pocketGeo} position={[0, 0, 0.02]}>
            <meshStandardMaterial color={C.pocket} roughness={0.9} />
          </mesh>
          <group ref={flap} position={[0, H / 2, 0.035]}>
            <mesh geometry={flapGeo}>
              <meshStandardMaterial color={C.flap} roughness={0.85} side={THREE.DoubleSide} />
            </mesh>
            {/* wax seal = the dot of the "i" in the wordmark */}
            <group ref={seal} position={[0, -FLAP_H + 0.22, 0.03]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.27, 0.29, 0.06, 48]} />
                <meshStandardMaterial color={C.ink} roughness={0.3} metalness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.032]}>
                <planeGeometry args={[0.2, 0.2 * (604 / 518)]} />
                <meshBasicMaterial map={monogram} transparent toneMapped={false} opacity={0.9} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
