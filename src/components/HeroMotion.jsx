import React, { useEffect, useRef } from 'react';

/**
 * Three.js wireframe hero — mouse-reactive, pauses off-screen / hidden tab.
 * Lazy-loaded Three chunk; respects prefers-reduced-motion.
 */
const HeroMotion = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    let disposed = false;
    let raf = 0;
    let visible = true;
    let mx = 0;
    let my = 0;
    let renderer;
    let mesh;
    let scene;
    let camera;

    const boot = async () => {
      const THREE = await import('three');
      if (disposed) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 4.2;

      mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.1, 1),
        new THREE.MeshPhongMaterial({
          color: 0xd4653a,
          wireframe: true,
          transparent: true,
          opacity: 0.28,
          shininess: 90,
        })
      );
      scene.add(mesh);

      const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 0),
        new THREE.MeshBasicMaterial({
          color: 0x8ab0e8,
          wireframe: true,
          transparent: true,
          opacity: 0.12,
        })
      );
      mesh.add(inner);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const point = new THREE.PointLight(0xd4653a, 1.8);
      point.position.set(8, 6, 10);
      scene.add(point);

      const onMove = (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };

      const onVis = () => {
        visible = document.visibilityState === 'visible';
      };

      const resize = () => {
        const r = parent.getBoundingClientRect();
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / Math.max(r.height, 1);
        camera.updateProjectionMatrix();
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting && document.visibilityState === 'visible';
        },
        { threshold: 0.05 }
      );
      io.observe(parent);

      const animate = () => {
        if (disposed) return;
        raf = requestAnimationFrame(animate);
        if (visible) {
          mesh.rotation.y += 0.0025;
          mesh.rotation.x += 0.0012;
          mesh.rotation.x += my * 0.0018;
          mesh.rotation.y += mx * 0.0018;
          inner.rotation.y -= 0.004;
          inner.rotation.x -= 0.002;
          renderer.render(scene, camera);
        }
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', onVis);
      resize();
      animate();

      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVis);
        io.disconnect();
      };
    };

    let cleanupScene;
    boot().then((fn) => {
      cleanupScene = fn;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanupScene?.();
      mesh?.geometry?.dispose();
      mesh?.material?.dispose();
      mesh?.children?.forEach((c) => {
        c.geometry?.dispose();
        c.material?.dispose();
      });
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-motion absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default HeroMotion;
