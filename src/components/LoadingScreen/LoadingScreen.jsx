import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle field
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: '#d67a5c',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // --- ANIMATION ---
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      particlesMesh.rotation.y = elapsedTime * 0.1;
      
      // Morph particles toward center based on progress
      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        // Subtle drift
        positions[i3] += Math.sin(elapsedTime + i) * 0.002;
        positions[i3+1] += Math.cos(elapsedTime + i) * 0.002;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // --- GSAP TIMELINE ---
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Initial burst
    tl.to(particlesMaterial, { size: 0.02, duration: 1.5, ease: "power4.out" });
    
    // 2. Text Reveal (Scramble)
    tl.fromTo(".loader-text", 
      { opacity: 0, y: 50, skewY: 10 },
      { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 
      "-=0.5"
    );

    // 3. Crystallize
    tl.to(particlesMesh.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 2, ease: "power2.inOut" }, "-=0.5");
    tl.to(particlesMaterial, { opacity: 0, duration: 0.5 }, "-=0.5");

    // 4. Clip-path Transition Reveal
    tl.to(".loading-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.2,
      ease: "expo.inOut"
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div className="loading-overlay fixed inset-0 z-[10000] bg-brandDark flex items-center justify-center overflow-hidden" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      <div className="relative z-10 text-center">
        <div className="overflow-hidden mb-2">
          <h2 className="loader-text text-brandCream text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
            Cyder<span className="text-primary">Coder</span>
          </h2>
        </div>
        <div className="overflow-hidden">
          <p className="loader-text text-brandCream/40 text-sm tracking-[0.5em] font-bold uppercase">
            Initializing Digital Soul...
          </p>
        </div>
      </div>

      {/* Noise Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default LoadingScreen;
