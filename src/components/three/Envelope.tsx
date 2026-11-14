"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { paintStationery, waxShape, type Stationery } from "./stationery";

// Envelope dimensions (world units)
const W = 3.2;
const H = 1.85;
const FLAP_H = 1.35;
// the card that slides out
const CARD_W = 2.7;
const CARD_H = 1.62;

// Parchment envelope matching the letter (cream-gold centre, golden-brown edges), the wordmark printed on a wavy flap, sealed with
// glossy black wax pressed with the "E". (Plain colours show for the first moment,
// until the paper texture is painted.)
const C = {
  back: "#dcbf92",
  pocket: "#f2deb8",
  flap: "#f5e4c2",
  card: "#f3dcae",
  wax: "#151414",
  waxRing: "#232120",
  waxCentre: "#1b1a19",
  emboss: "#77726c",
};
const SEAL_R = 0.3;

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
  const flapShadow = useRef<THREE.MeshBasicMaterial>(null!);
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

  // cream paper textures, painted once the card's script font is ready
  const [paper, setPaper] = useState<Stationery | null>(null);
  useEffect(() => {
    let alive = true;
    let made: Stationery | null = null;
    paintStationery(W, H, FLAP_H).then((t) => {
      made = t;
      if (alive) setPaper(t);
    });
    return () => {
      alive = false;
      if (made) Object.values(made).forEach((t) => t.dispose());
    };
  }, []);

  // poured wax: an irregular disc with soft, rounded edges
  const waxGeo = useMemo(
    () => new THREE.ExtrudeGeometry(waxShape(SEAL_R), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 6, curveSegments: 4 }),
    [],
  );

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

  // Top flap, hanging down from its hinge at y = 0 (local): a wavy outline that dips in
  // from each top corner, runs down towards the middle and ends in a rounded point.
  const flapGeo = useMemo(() => {
    const s = new THREE.Shape();
    const x = W / 2;
    s.moveTo(-x, 0);
    s.lineTo(x, 0);
    s.bezierCurveTo(x - 0.02, -0.34, x - 0.36, -0.36, x - 0.6, -0.62);
    s.bezierCurveTo(0.78, -0.86, 0.5, -0.98, 0.3, -FLAP_H + 0.14);
    s.bezierCurveTo(0.15, -FLAP_H - 0.05, -0.15, -FLAP_H - 0.05, -0.3, -FLAP_H + 0.14);
    s.bezierCurveTo(-0.5, -0.98, -0.78, -0.86, -(x - 0.6), -0.62);
    s.bezierCurveTo(-(x - 0.36), -0.36, -(x - 0.02), -0.34, -x, 0);
    return new THREE.ShapeGeometry(s, 24);
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
    // the soft shadow the closed flap casts on the front fades as it lifts
    flapShadow.current.opacity = 0.16 * (1 - seg(flapT, 0, 0.25));

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
            <planeGeometry args={[CARD_W, CARD_H]} />
            {/* emissive keeps the card reading as bright paper, not grey, at any angle */}
            <meshStandardMaterial
              key={paper ? "paper" : "plain"}
              color={paper ? "#ffffff" : C.card}
              map={paper?.card ?? null}
              emissive={paper ? "#ffffff" : C.card}
              emissiveMap={paper?.card ?? null}
              emissiveIntensity={0.3}
              roughness={0.95}
              transparent
              alphaTest={0.4}
            />
          </mesh>
          <mesh position={[0, -0.02, 0.004]}>
            <planeGeometry args={[1.3, 1.3 * (527 / 1264)]} />
            {/* tinted dark brown, like ink soaked into the burnt paper */}
            <meshBasicMaterial map={wordmark} color="#3a1d08" transparent toneMapped={false} opacity={0.85} />
          </mesh>
        </group>

        {/* the envelope */}
        <group ref={env}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[W, H]} />
            <meshStandardMaterial key={paper ? "p" : "c"} color={paper ? "#ffffff" : C.back} map={paper?.back ?? null} emissive="#ffffff" emissiveMap={paper?.back ?? null} emissiveIntensity={paper ? 0.22 : 0} roughness={0.95} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={pocketGeo} position={[0, 0, 0.02]}>
            <meshStandardMaterial key={paper ? "p" : "c"} color={paper ? "#ffffff" : C.pocket} map={paper?.pocket ?? null} emissive="#ffffff" emissiveMap={paper?.pocket ?? null} emissiveIntensity={paper ? 0.22 : 0} roughness={0.95} />
          </mesh>
          <group ref={flap} position={[0, H / 2, 0.035]}>
            {/* soft shadow under the flap's wavy edge, so its outline reads on the paper */}
            <mesh geometry={flapGeo} position={[0, -0.035, -0.008]} scale={[1.01, 1.02, 1]}>
              <meshBasicMaterial ref={flapShadow} color="#6a4a28" transparent opacity={0.16} depthWrite={false} />
            </mesh>
            <mesh geometry={flapGeo}>
              <meshStandardMaterial key={paper ? "p" : "c"} color={paper ? "#ffffff" : C.flap} map={paper?.flap ?? null} emissive="#ffffff" emissiveMap={paper?.flap ?? null} emissiveIntensity={paper ? 0.22 : 0} roughness={0.92} side={THREE.DoubleSide} />
            </mesh>
            {/* the wordmark, printed on the flap (only its front face is drawn, so it
                disappears naturally as the flap folds back) */}
            <mesh position={[0, -0.5, 0.003]}>
              <planeGeometry args={[1.0, 1.0 * (527 / 1264)]} />
              <meshBasicMaterial map={wordmark} transparent opacity={0.92} toneMapped={false} />
            </mesh>
            {/* glossy black wax seal pressed with the "E" */}
            <group ref={seal} position={[0, -FLAP_H + 0.08, 0.03]}>
              <mesh geometry={waxGeo} position={[0, 0, -0.012]}>
                <meshStandardMaterial color={C.wax} roughness={0.16} metalness={0.25} />
              </mesh>
              {/* raised ring and the slightly matte pressed centre */}
              <mesh position={[0, 0, 0.066]}>
                <torusGeometry args={[SEAL_R * 0.66, 0.018, 12, 72]} />
                <meshStandardMaterial color={C.waxRing} roughness={0.14} metalness={0.3} />
              </mesh>
              <mesh position={[0, 0, 0.062]}>
                <circleGeometry args={[SEAL_R * 0.64, 64]} />
                <meshStandardMaterial color={C.waxCentre} roughness={0.55} metalness={0.1} />
              </mesh>
              <mesh position={[0, 0.005, 0.066]}>
                <planeGeometry args={[0.2, 0.2 * (604 / 518)]} />
                <meshBasicMaterial map={monogram} color={C.emboss} transparent opacity={0.95} toneMapped={false} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
