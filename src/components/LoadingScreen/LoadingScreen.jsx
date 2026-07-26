import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

const LoadingScreen = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const particlesCount = 1400;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: '#D4653A',
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 3;

    const clock = new THREE.Clock();
    let animationId;
    let alive = true;

    const animate = () => {
      if (!alive) return;
      const elapsedTime = clock.getElapsedTime();
      particlesMesh.rotation.y = elapsedTime * 0.1;

      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] += Math.sin(elapsedTime + i) * 0.002;
        positions[i3 + 1] += Math.cos(elapsedTime + i) * 0.002;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      if (onComplete) onComplete();
    };

    // Safety: never stick on loader forever
    const safety = window.setTimeout(finish, 5000);

    const tl = gsap.timeline({ onComplete: finish });

    // Text must be readable immediately — animate from near-visible
    gsap.set('.loader-text', { opacity: 1, y: 0 });

    tl.to(particlesMaterial, { size: 0.02, duration: 1.0, ease: 'power4.out' });

    tl.fromTo(
      '.loader-text',
      { opacity: 0.4, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'expo.out' },
      0.15
    );

    tl.to(particlesMesh.scale, { x: 0.25, y: 0.25, z: 0.25, duration: 1.2, ease: 'power2.inOut' }, '-=0.2');
    tl.to(particlesMaterial, { opacity: 0, duration: 0.4 }, '-=0.35');

    tl.to('.loading-overlay', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 0.9,
      ease: 'expo.inOut',
    });

    return () => {
      alive = false;
      window.clearTimeout(safety);
      cancelAnimationFrame(animationId);
      tl.kill();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="loading-overlay fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        backgroundColor: '#0A0908',
        color: '#F2EFE8',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10 text-center px-6" style={{ color: '#F2EFE8' }}>
        <div className="overflow-hidden mb-3">
          <h2
            className="loader-text font-display font-black text-5xl md:text-7xl tracking-tight uppercase"
            style={{ color: '#F2EFE8' }}
          >
            Cyder
            <span
              className="brand-coder"
              style={{
                display: 'inline-block',
                background: '#D4653A',
                color: '#0A0908',
                padding: '0 0.28em',
                marginLeft: '0.15em',
              }}
            >
              Coder
            </span>
          </h2>
        </div>
        <div className="overflow-hidden">
          <p
            className="loader-text font-mono text-[11px] tracking-[0.35em] uppercase"
            style={{ color: 'rgba(242, 239, 232, 0.65)' }}
          >
            Just a sec…
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
