import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface NodeInfo {
  name: string;
  role: string;
  status: string;
}

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [activeNode, setActiveNode] = useState<NodeInfo>({
    name: 'Core Application Engine',
    role: 'Central Processing & Event Bus',
    status: 'Operational · High Availability',
  });
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio < 2,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 540;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Cinematic entrance: the orbital system fades/scales into place.
    container.style.opacity = '0';
    container.style.transform = 'scale(0.82)';
    container.style.transition = 'opacity 1.2s ease-out, transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
      });
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.2);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1128, 3.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 4.0);
    cyanLight.position.set(5, 6, 4);
    scene.add(cyanLight);

    const blueLight = new THREE.DirectionalLight(0x3b82f6, 3.0);
    blueLight.position.set(-5, -4, 3);
    scene.add(blueLight);

    const violetRim = new THREE.PointLight(0xa855f7, 3.5, 18);
    violetRim.position.set(0, -3, -2);
    scene.add(violetRim);

    // Master System Group
    const architectureGroup = new THREE.Group();
    scene.add(architectureGroup);

    // 1. Central Core System (Enterprise Application Engine)
    const coreCluster = new THREE.Group();
    architectureGroup.add(coreCluster);

    // Inner glowing crystal
    const innerGeo = new THREE.OctahedronGeometry(1.15, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreCluster.add(innerMesh);

    // Outer cyber cage
    const outerGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const outerWire = new THREE.LineSegments(outerEdges, outerLineMat);
    coreCluster.add(outerWire);

    // 2. Dual Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(3.0, 0.018, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.8;
    architectureGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.55, 0.016, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 5;
    architectureGroup.add(ring2);

    // 3. Orbiting Peripheral Microservices & Modules
    const modulesData: Array<{
      name: string;
      role: string;
      status: string;
      radius: number;
      speed: number;
      angle: number;
      size: number;
      color: number;
      yBase: number;
      mesh?: THREE.Mesh;
      line?: THREE.Line;
    }> = [
      {
        name: 'Web & Mobile Client Interface',
        role: 'Responsive UI, PWA & Native Edge Views',
        status: 'Active · < 50ms Latency',
        radius: 2.8,
        speed: 0.45,
        angle: 0,
        size: 0.65,
        color: 0x38bdf8,
        yBase: 0.8,
      },
      {
        name: 'Resilient API & Microservice Hub',
        role: 'REST, GraphQL & High-Throughput Pipelines',
        status: 'Active · Auto-scaling Cluster',
        radius: 3.2,
        speed: -0.38,
        angle: Math.PI * 0.55,
        size: 0.6,
        color: 0x06b6d4,
        yBase: -1.0,
      },
      {
        name: 'Enterprise Database Store',
        role: 'Relational ACID Transactions & Automated Backups',
        status: 'Active · Encrypted at Rest',
        radius: 2.9,
        speed: 0.52,
        angle: Math.PI * 1.15,
        size: 0.7,
        color: 0x6366f1,
        yBase: 0.5,
      },
      {
        name: 'Cloud Deployment & DevOps Orchestrator',
        role: 'CI/CD Pipelines, Containerization & Health Audits',
        status: 'Active · Zero Downtime Deployments',
        radius: 3.4,
        speed: -0.42,
        angle: Math.PI * 1.65,
        size: 0.55,
        color: 0xa855f7,
        yBase: -0.6,
      },
    ];

    modulesData.forEach((mod) => {
      const geo = new THREE.BoxGeometry(mod.size, mod.size, mod.size);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x091428,
        roughness: 0.2,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);

      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({ color: mod.color });
      const wire = new THREE.LineSegments(edges, lineMat);
      mesh.add(wire);

      architectureGroup.add(mesh);
      mod.mesh = mesh;

      // Connecting data bus line to core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const dataBusMat = new THREE.LineBasicMaterial({
        color: mod.color,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(lineGeo, dataBusMat);
      architectureGroup.add(line);
      mod.line = line;
    });

    // 4. Floating Ambient Code Dust Particles
    const particleCount = 90;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 9.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    architectureGroup.add(particleSystem);

    // Mouse Interaction (Parallax & Drag)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.prevMouseX;
        const deltaY = e.clientY - mouseRef.current.prevMouseY;
        architectureGroup.rotation.y += deltaX * 0.008;
        architectureGroup.rotation.x += deltaY * 0.008;
        mouseRef.current.prevMouseX = e.clientX;
        mouseRef.current.prevMouseY = e.clientY;
      } else {
        mouseRef.current.targetX = x * 0.35;
        mouseRef.current.targetY = y * 0.25;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDragging = true;
      mouseRef.current.prevMouseX = e.clientX;
      mouseRef.current.prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDragging = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      if (!mouseRef.current.isDragging) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

        if (isRotating) {
          architectureGroup.rotation.y = t * 0.16 + mouseRef.current.x;
          architectureGroup.rotation.x = Math.sin(t * 0.12) * 0.10 + mouseRef.current.y;
        }
      }

      // Rotate core cluster
      innerMesh.rotation.y = t * 0.4;
      innerMesh.rotation.z = t * 0.25;
      outerWire.rotation.y = -t * 0.2;
      outerWire.rotation.x = t * 0.15;

      ring1.rotation.z = t * 0.11;
      ring2.rotation.z = -t * 0.085;

      // Pulse core mesh
      const corePulse = 1 + Math.sin(t * 3.5) * 0.05;
      innerMesh.scale.set(corePulse, corePulse, corePulse);

      // Animate orbiting modules
      modulesData.forEach((mod, idx) => {
        mod.angle += mod.speed * 0.015;
        const x = Math.cos(mod.angle) * mod.radius;
        const z = Math.sin(mod.angle) * mod.radius;
        const y = mod.yBase + Math.sin(t * 1.5 + idx) * 0.18;

        if (mod.mesh) {
          mod.mesh.position.set(x, y, z);
          mod.mesh.rotation.y = t * (0.4 + idx * 0.1);
          mod.mesh.rotation.x = t * 0.2;
        }

        if (mod.line) {
          const positions = (mod.line.geometry as THREE.BufferGeometry).attributes.position.array as Float32Array;
          positions[0] = 0;
          positions[1] = 0;
          positions[2] = 0;
          positions[3] = x;
          positions[4] = y;
          positions[5] = z;
          (mod.line.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
        }
      });

      renderer?.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && renderer) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      resizeObserver.disconnect();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerEdges.dispose();
      outerLineMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isRotating]);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] flex items-center justify-center select-none">
      {/* 3D Canvas element */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          transformOrigin: 'center center',
        }}
        title="Click and drag to rotate the 3D orbital system"
      />

      {/* WebGL Fallback */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/20">
            <div className="w-7 h-7 border-2 border-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* No HUD / architecture information card — the 3D scene remains clean. */}
      

      {/* Viewport Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-slate-300 backdrop-blur-md transition-colors cursor-pointer"
        >
          {isRotating ? 'Pause Orbit' : 'Resume Orbit'}
        </button>
        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
          Drag to Rotate
        </span>
      </div>
    </div>
  );
};
