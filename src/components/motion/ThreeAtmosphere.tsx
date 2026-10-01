import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const ThreeAtmosphere: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 110;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Glowing particle embers (red & gold embers)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const redColor = new THREE.Color(0xdc2626);
    const goldColor = new THREE.Color(0xd97706);
    const whiteColor = new THREE.Color(0xf4f4f5);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const rand = Math.random();
      const c = rand < 0.65 ? redColor : rand < 0.85 ? goldColor : whiteColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 0.02 + Math.random() * 0.03;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      map: texture,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle 3D circular ring representing the Pride seal ring
    const ringGeo = new THREE.TorusGeometry(8.5, 0.05, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x991b1b,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.z = -5;
    scene.add(ringMesh);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return; // Pause when not in viewport!

      const delta = clock.getDelta();
      const pos = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += speeds[i]; // Float upward like embers
        if (pos[i * 3 + 1] > 20) {
          pos[i * 3 + 1] = -20;
          pos[i * 3] = (Math.random() - 0.5) * 50;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Subtle sway towards mouse
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      ringMesh.rotation.z += delta * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced]);

  if (prefersReduced || (typeof window !== 'undefined' && window.innerWidth < 768)) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-75"
      aria-hidden="true"
    />
  );
};
