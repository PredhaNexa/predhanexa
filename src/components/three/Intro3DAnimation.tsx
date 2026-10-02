import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Intro3DAnimationProps {
  onComplete: () => void;
  companyName?: string;
  tagline?: string;
}

export const Intro3DAnimation: React.FC<Intro3DAnimationProps> = ({
  onComplete,
  companyName = 'PREDHANEXA',
  tagline = 'Building Software. Supporting Growth.',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<number>(1);
  const [fadeComplete, setFadeComplete] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const stageDescriptions = [
    'Initializing Quantum Kernel',
    'Generating Architectural Matrix',
    'Harmonizing Vector Particles',
    'Revealing Enterprise Identity',
    'Synthesizing Core Directives',
    'Entering Production Environment',
    'Ready',
  ];

  const handleSkip = () => {
    if (isSkipped) return;
    setIsSkipped(true);
    setFadeComplete(true);
    setTimeout(onComplete, 200);
  };

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        onComplete();
        return;
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio < 2,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      const timer = setTimeout(onComplete, 2200);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x02040a, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 6.8;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0a1128, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x06b6d4, 4, 25);
    keyLight.position.set(0, 1.5, 3.5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x3b82f6, 3, 20);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 2.5, 20);
    violetLight.position.set(4, 2, -3);
    scene.add(violetLight);

    // 1. Central Core Master Group
    const coreGroup = new THREE.Group();
    coreGroup.position.x = width >= 768 ? 2.05 : 0;
    scene.add(coreGroup);

    // Inner glowing geometric kernel
    const kernelGeo = new THREE.OctahedronGeometry(1.1, 1);
    const kernelMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    });
    const kernelMesh = new THREE.Mesh(kernelGeo, kernelMat);
    coreGroup.add(kernelMesh);

    // Outer cybernetic wireframe lattice
    const cageGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // Dual rotating energy rings
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.35, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 2. Surrounding Converging Star Particle Field
    const isMobile = width < 768;
    const particleCount = isMobile ? 120 : 260;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { radius: number; angle: number; speed: number; yOffset: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.8 + Math.random() * 4.2;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 4.5;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = yOffset;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleVelocities.push({
        radius,
        angle,
        speed: 0.5 + Math.random() * 0.9,
        yOffset,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: isMobile ? 0.05 : 0.07,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 3. Shockwave Expansion Ring for Stage 3 Convergence
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.18, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwave.rotation.x = Math.PI / 2;
    scene.add(shockwave);

    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (currentTime - startTime) / 1000;

      // 7-Stage Sequence Mapping over 3.2 seconds
      if (elapsed < 0.6) {
        setStage(1);
      } else if (elapsed < 1.2) {
        setStage(2);
      } else if (elapsed < 1.8) {
        setStage(3);
      } else if (elapsed < 2.4) {
        setStage(4);
      } else if (elapsed < 2.8) {
        setStage(5);
      } else if (elapsed < 3.2) {
        setStage(6);
      } else {
        setStage(7);
        if (!fadeComplete) {
          setFadeComplete(true);
          setTimeout(onComplete, 350);
        }
      }

      // Continuous object rotations
      coreGroup.rotation.y += 0.016;
      coreGroup.rotation.x += 0.007;
      cageMesh.rotation.y -= 0.012;
      ring1.rotation.z += 0.018;
      ring2.rotation.z -= 0.014;

      // Pulse inner core
      const pulse = 1 + Math.sin(elapsed * 5) * 0.07;
      kernelMesh.scale.set(pulse, pulse, pulse);

      // Particle physics
      const positions = particleGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const p = particleVelocities[i];
        p.angle += p.speed * 0.02;

        if (elapsed > 1.1 && elapsed <= 2.1) {
          // Particles converge magnetically toward center in Stage 3
          p.radius = Math.max(0.3, p.radius - 0.05 * (elapsed - 1.0) * 2.2);
          p.yOffset *= 0.97;
        } else if (elapsed > 2.1) {
          // Rebound softly outward
          p.radius += 0.025;
        }

        positions[i * 3] = Math.cos(p.angle) * p.radius;
        positions[i * 3 + 1] = p.yOffset + Math.sin(p.angle * 2.5) * 0.15;
        positions[i * 3 + 2] = Math.sin(p.angle) * p.radius;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Trigger Shockwave ring expansion in Stage 3
      if (elapsed > 1.7 && elapsed < 2.5) {
        const shockProgress = (elapsed - 1.7) / 0.8;
        shockwave.scale.set(shockProgress * 28, shockProgress * 28, 1);
        shockwaveMat.opacity = Math.max(0, 1 - shockProgress);
      }

      // Camera Glide in Stage 6: Camera moves forward through the 3D scene
      if (elapsed > 2.4) {
        const glideProgress = Math.min(1, (elapsed - 2.4) / 0.8);
        camera.position.z = 6.8 - glideProgress * 5.4;
        camera.fov = 50 + glideProgress * 20;
        camera.updateProjectionMatrix();

        if (particleMaterial.opacity > 0) {
          particleMaterial.opacity = Math.max(0, 0.85 - glideProgress * 1.1);
          cageMat.opacity = Math.max(0, 0.4 - glideProgress * 0.5);
        }
      }

      renderer?.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      kernelGeo.dispose();
      kernelMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02040a] overflow-hidden transition-opacity duration-500 ${
        fadeComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Welcome 3D Introduction"
      role="dialog"
      aria-modal="true"
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Futuristic Background Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* WebGL Fallback if device does not support WebGL */}
      {!webglSupported && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-40 h-40 rounded-full border border-cyan-500/30 animate-spin flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-blue-400/40 animate-ping" />
            <div className="w-8 h-8 rounded-full bg-cyan-400/60 blur-sm" />
          </div>
        </div>
      )}

      {/* Skip Intro Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md hover:text-white hover:border-cyan-400/60 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-lg shadow-black/60"
          aria-label="Skip 3D entrance animation"
        >
          <span>Skip Animation</span>
          <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 bg-slate-800/90 rounded border border-slate-700">
            ESC
          </span>
        </button>
      </div>

      {/* Cinematic Brand Reveal — LEFT / Orbital System — RIGHT */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none">
        <div
          className={`absolute left-6 sm:left-10 lg:left-[8vw] top-1/2 -translate-y-1/2 max-w-[680px] text-left transition-all duration-1000 ease-out ${
            stage >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            <span className="text-[10px] sm:text-xs font-mono text-cyan-300 tracking-[0.28em] uppercase">
              Private Limited
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight font-display text-white leading-none drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]">
            {companyName}
          </h1>

          <div
            className={`mt-4 transition-all duration-700 ${
              stage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 font-display">
              {tagline}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 tracking-[0.18em] uppercase">
              Software Development & Digital Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Clean cinematic intro — no progress HUD */}
    </div>
  );
};
