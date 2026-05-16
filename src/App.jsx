import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import BubbleMenu from './components/BubbleMenu/BubbleMenu';
import ContactModal from './components/ContactModal';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDripComplete, setIsDripComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDemoIdx, setActiveDemoIdx] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const mainRef = useRef(null);
  const heroCanvasRef = useRef(null);

  const skillCategories = [
    { title: "Creative Engineering", skills: ["React/Next.js", "Three.js/WebGL", "GSAP/Framer", "TypeScript"], desc: "Architecting immersive, high-performance digital souls that bridge design and mathematics." },
    { title: "Intelligence & Logic", skills: ["Python/Rust", "AI/NLP", "GenAI Integration", "Computer Vision"], desc: "Developing cognitive systems that perceive, reason, and adapt to complex user environments." },
    { title: "Core Architecture", skills: ["Fintech PWAs", "Cloud Infra", "SQL/NoSQL", "Real-time Systems"], desc: "Building scalable, secure foundations for modern web applications and industrial solutions." }
  ];

  const projectData = [
    { id: "01", title: "SwiftLink Pro", type: "FinTech / Commerce", desc: "A professional WhatsApp storefront turning business chats into high-conversion online catalogs in 60 seconds.", url: "https://swiftlinkpro.vercel.app/", tags: ["Next.js", "WhatsApp API", "Commerce"], isPremium: true },
    { id: "02", title: "BioByte Pro", type: "EdTech / Health", desc: "The #1 WAEC Biology exam simulator featuring 120+ study modules, session metrics, and real-time mastery tracking.", url: "https://biobyte.vercel.app/", tags: ["React", "LMS", "PWA"], isPremium: true },
    { id: "03", title: "Chaotic Shift", type: "AI / Interaction", desc: "A high-fidelity interactive PWA (CySwitch) integrating Google Gemini AI with physics-based UI elements.", url: "https://cyswitch.vercel.app/", tags: ["Gemini AI", "Framer", "React"], isPremium: true },
    { id: "04", title: "Naija Bot AI", type: "AI Assistant", desc: "Cultural-aware AI assistant optimized for Nigerian linguistic nuances and localized problem-solving strategies.", url: "https://naija-bot.vercel.app/", tags: ["OpenAI", "NLP", "Vite"], isPremium: true },
    { id: "05", title: "Loading Systems", type: "UI/UX Library", desc: "A premium collection of high-end motion design primitives and loading architectures for enterprise web apps.", url: "https://loading-screen-1.vercel.app/", tags: ["GSAP", "SVG", "Motion"], isPremium: true },
    { id: "06", title: "Cydemy", type: "EdTech / Platform", desc: "Creative learning management system specifically designed for specialized engineering and design curricula.", url: "https://cydemy.vercel.app/", tags: ["Next.js", "LMS", "Tailwind"], isPremium: true },
    { id: "07", title: "Adex Concerns", type: "Corporate Architecture", desc: "Enterprise-grade business management showcase and professional services digital ecosystem for industrial concerns.", url: "https://adexconcerns.vercel.app/", tags: ["Business", "React", "Corporate"], isPremium: true },
    { id: "08", title: "AjoSafe Fintech", type: "FinTech / PWA", desc: "Digitalizing traditional savings (Ajo) with automated cycles, realtime Supabase sync, and military-grade security.", url: "https://ajosafe.vercel.app/", tags: ["PWA", "Supabase", "Fintech"], isPremium: false },
    { id: "09", title: "CySolfa", type: "MusicTech / EdTech", desc: "Interactive music learning platform specializing in Tonic Solfa notation and real-time vocal training systems.", url: "https://cysolfa.vercel.app/", tags: ["Audio API", "React", "Education"], isPremium: false },
    { id: "10", title: "Edumati", type: "Resource Hub", desc: "Scalable educational resource management system for academic institutions and high-volume learners.", url: "https://edumati.vercel.app/", tags: ["Resources", "Vite", "Dashboard"], isPremium: false }
  ];

  // â”€â”€ Use a ref to track drip state INSIDE the Three.js loop (avoids re-running the effect)
  const isDripCompleteRef = useRef(false);

  useEffect(() => {
    if (isLoading || !heroCanvasRef.current) return;

    // Reset on each mount
    isDripCompleteRef.current = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ canvas: heroCanvasRef.current, alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0xFAFAF7, 1);

    // â”€â”€ MATERIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff', metalness: 0.05, roughness: 0.0,
      transmission: 1.0, thickness: 2.5, ior: 1.5,
      transparent: true, clearcoat: 1.0, clearcoatRoughness: 0.0,
      envMapIntensity: 1.2,
    });
    const dripMat = new THREE.MeshPhysicalMaterial({
      color: '#c8f5e2', metalness: 0.0, roughness: 0.0,
      transmission: 0.95, thickness: 1.2, ior: 1.4,
      transparent: true, clearcoat: 1.0, clearcoatRoughness: 0.0,
    });

    // â”€â”€ MAIN SPHERE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const geometry = new THREE.IcosahedronGeometry(4, 16);
    const originalPositions = new Float32Array(geometry.attributes.position.array);
    const sphere = new THREE.Mesh(geometry, glassMat);
    sphere.scale.set(0, 0, 0);
    scene.add(sphere);

    // â”€â”€ TEARDROP DRIP (elongated sphere = teardrop silhouette) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const dripGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const drip = new THREE.Mesh(dripGeo, dripMat);
    drip.position.set(0, 14, 0);
    drip.scale.set(0.55, 2.2, 0.55); // pointy at top, round at bottom
    scene.add(drip);

    // â”€â”€ SPLASH RINGS (hidden, revealed on impact) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const ringMat = new THREE.MeshBasicMaterial({ color: '#10b981', transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const rings = [0.6, 1.2, 2.0].map(r => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.04, 64), ringMat.clone());
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0;
      ring.scale.set(0, 0, 0);
      scene.add(ring);
      return ring;
    });

    // â”€â”€ LIGHTING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    scene.add(new THREE.AmbientLight('#e2f5fd', 1.2));
    const keyLight = new THREE.DirectionalLight('#ffffff', 3);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight('#a7f3d0', 2);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);
    const warmFill = new THREE.PointLight('#fbbf24', 30, 80);
    warmFill.position.set(-5, -6, 5);
    scene.add(warmFill);
    // Travelling light â€” follows the drop
    const dripSpot = new THREE.PointLight('#a7f3d0', 50, 40);
    dripSpot.position.set(0, 14, 4);
    scene.add(dripSpot);
    // Shockwave flash â€” fires on impact
    const shockLight = new THREE.PointLight('#ffffff', 0, 60);
    shockLight.position.set(0, 0, 6);
    scene.add(shockLight);

    // â”€â”€ MOUSE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const mouse = new THREE.Vector2(0, 0);
    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.x = (x / window.innerWidth) * 2 - 1;
      mouse.y = -(y / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);

    // â”€â”€ CINEMATIC SEQUENCE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const tl = gsap.timeline({ delay: 0.3 });

    // 1. FALL â€” fast expo acceleration, stretch increases as speed increases
    tl.to(drip.position, {
      y: 0,
      duration: 0.55,
      ease: "expo.in",
      onUpdate: function () {
        const p = this.progress();
        // Aerodynamic: gets thinner and longer as it accelerates
        drip.scale.set(0.55 - p * 0.25, 2.2 + p * 2.8, 0.55 - p * 0.25);
        dripSpot.position.y = drip.position.y + 1.5;
      },
    })

    // 2. SPLAT â€” violent horizontal squash (3 frames)
    .to(drip.scale, {
      x: 5, y: 0.05, z: 5,
      duration: 0.08,
      ease: "power4.out",
    })

    // 3. SHOCKWAVE FLASH
    .to(shockLight, { intensity: 120, duration: 0.06, ease: "power4.out" }, "<")
    .to(shockLight, { intensity: 0, duration: 0.4, ease: "power2.in" })

    // 4. SPLASH RINGS â€” 3 rings expand outward with stagger
    .call(() => {
      rings.forEach((ring, i) => {
        gsap.to(ring.scale, {
          x: 1, y: 1, z: 1,
          delay: i * 0.07,
          duration: 0.01,
        });
        gsap.to(ring.scale, {
          x: 4 + i * 1.5, y: 4 + i * 1.5, z: 4 + i * 1.5,
          delay: i * 0.07 + 0.01,
          duration: 0.55,
          ease: "power2.out",
        });
        gsap.to(ring.material, {
          opacity: 0,
          delay: i * 0.07 + 0.15,
          duration: 0.4,
          ease: "power2.in",
        });
      });
    }, null, "<0.02")

    // 5. DRIP DISAPPEARS, SPHERE EXPLODES OUT
    .call(() => {
      scene.remove(drip);
      scene.remove(dripSpot);
    }, null, "<0.05")
    .fromTo(sphere.scale,
      { x: 0.05, y: 0.05, z: 0.05 },
      { x: 1, y: 1, z: 1, duration: 1.1, ease: "elastic.out(1, 0.42)" },
      "<0.03"
    )
    .call(() => {
      // Trigger text reveal and start live morph â€” use ref, NOT setState, to avoid re-run
      isDripCompleteRef.current = true;
      setIsDripComplete(true);
    }, null, "<0.1");

    // â”€â”€ RENDER LOOP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      if (isDripCompleteRef.current) {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = originalPositions[i], y = originalPositions[i + 1], z = originalPositions[i + 2];
          const noise =
            Math.sin(x * 0.4 + t * 0.35) * 0.18 +
            Math.cos(y * 0.4 + t * 0.28) * 0.18 +
            Math.sin(z * 0.4 + t * 0.42) * 0.18;
          positions[i]     = x + noise * (x / 5.5);
          positions[i + 1] = y + noise * (y / 5.5);
          positions[i + 2] = z + noise * (z / 5.5);
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        sphere.rotation.y += 0.0008;
        gsap.to(sphere.rotation, { x: -mouse.y * 0.25, y: mouse.x * 0.25, duration: 3.5, ease: "power2.out" });
        gsap.to(sphere.position, { x: mouse.x * 0.4, y: mouse.y * 0.4, duration: 3.5, ease: "power2.out" });
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      tl.kill();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isLoading]); // â† ONLY re-run when loading changes, NOT on isDripComplete

  useEffect(() => {
    if (isDripComplete) {
      gsap.fromTo(".reveal-genesis", 
        { y: 100, opacity: 0, skewY: 10 }, 
        { y: 0, opacity: 1, skewY: 0, duration: 1.5, stagger: 0.2, ease: "expo.out" }
      );
    }
  }, [isDripComplete]);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      gsap.to(cursorRef.current, { x: clientX, y: clientY, duration: 0 });
      gsap.to(followerRef.current, { x: clientX - 16, y: clientY - 16, duration: 0.3, ease: "power2.out" });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isLoading]);

  useEffect(() => {
    if (activeDemoIdx !== null || isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeDemoIdx, isModalOpen]);

  const handleSendWhatsApp = (msg) => {
    window.open(`https://wa.me/2348085741430?text=${encodeURIComponent(msg)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {activeDemoIdx !== null && (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-500">
           <div className="bg-[#f5f5f5] border-b border-gray-200 px-4 py-3 flex items-center gap-4">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#FF5F56]" /><div className="w-3 h-3 rounded-full bg-[#FFBD2E]" /><div className="w-3 h-3 rounded-full bg-[#27C93F]" /></div>
              <div className="flex-1 bg-white rounded-lg py-1.5 px-4 text-[10px] text-gray-400 font-bold truncate flex items-center justify-between shadow-sm">
                 <span className="hidden md:inline">{projectData[activeDemoIdx].url}</span>
                 <span className="md:hidden text-primary">System Live Simulation</span>
                 <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="uppercase text-[8px] tracking-widest text-green-600 font-black">Connected</span></div>
              </div>
              <div className="flex items-center gap-2">
                 <a href={projectData[activeDemoIdx].url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors flex items-center gap-2 px-3" title="Open Original"><span className="text-[8px] font-black uppercase hidden md:inline">Open Site</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>
                 <button onClick={() => setReloadKey(k => k + 1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors group"><svg className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                 <button onClick={() => setActiveDemoIdx(null)} className="px-6 py-2 bg-brandDark text-brandCream rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg">Exit</button>
              </div>
           </div>
           <div className="bg-[#fff7ed] border-b border-[#ffedd5] px-4 py-2 flex items-center justify-center gap-2 text-[#9a3412] text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-center shadow-inner">
             <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             <span>Due to browser security policies, some projects may not load correctly here. Please use the 'Open Site' icon above for maximum efficiency.</span>
           </div>
           <div className="flex-1 relative bg-white"><iframe key={reloadKey} src={projectData[activeDemoIdx].url} className="w-full h-full border-none absolute inset-0" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone; geolocation" loading="eager" /></div>
        </div>
      )}

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSend={handleSendWhatsApp} initialMessage="Hello Michael, I saw your portfolio and I'd like to discuss a project with you." />

      <div ref={mainRef} className={`bg-brandCream transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div ref={cursorRef} className="custom-cursor hidden md:block"></div>
        <div ref={followerRef} className="cursor-follower hidden md:block"></div>

        <BubbleMenu 
          logo={<span className="font-black tracking-tighter text-xl">CYDER<span className="text-primary">CODER</span></span>}
          items={[{ label: 'home', href: '#home', rotation: -5 }, { label: 'skills', href: '#skills', rotation: 8 }, { label: 'projects', href: '#projects', rotation: -3 }, { label: 'contact', href: '#contact', rotation: 10 }]}
          useFixedPosition={true} menuBg="#FAFAF7" menuContentColor="#111"
        />

        <section id="home" className="h-screen flex items-center justify-center px-6 relative overflow-hidden bg-brandCream">
          <canvas ref={heroCanvasRef} className="absolute inset-0 z-0 opacity-100" />
          <div className="max-w-7xl mx-auto w-full relative z-10 text-center md:text-left pointer-events-none">
             <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full mb-8 uppercase tracking-[0.4em] reveal-genesis opacity-0">Lagos, Nigeria &#x1F1F3;&#x1F1EC;</div>
             <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[9rem] font-black mb-8 leading-[0.85] tracking-tighter text-brandDark reveal-genesis opacity-0">DOSUMU <br/> <span className="text-primary">MICHAEL.</span></h1>
             <p className="text-base sm:text-lg xl:text-xl text-brandDark/50 max-w-2xl mb-12 leading-relaxed font-medium reveal-genesis opacity-0">Designing <span className="text-brandDark">High-Fidelity</span> digital experiences that blend neural intelligence with modern aesthetics.</p>
             <div className="flex flex-col sm:flex-row gap-5 pointer-events-auto reveal-genesis opacity-0">
                <a href="#projects" className="px-10 py-5 bg-brandDark text-brandCream font-bold rounded-full text-base text-center hover:bg-primary transition-colors duration-500 no-underline">Selected Works</a>
                <button onClick={() => setIsModalOpen(true)} className="px-10 py-5 border-2 border-brandDark/10 text-brandDark font-bold rounded-full text-base text-center hover:border-primary transition-colors duration-500">Let's Talk</button>
             </div>
          </div>
        </section>

        <div className="py-8 bg-primary overflow-hidden whitespace-nowrap border-y-2 border-brandDark relative z-20">
           <div className="animate-marquee inline-block"><div className="flex whitespace-nowrap">{[...Array(10)].map((_, i) => (<span key={i} className="text-2xl md:text-4xl xl:text-5xl font-black text-brandCream uppercase mx-8 tracking-tighter">Creative Engineering &bull; Neural Intelligence &bull; WebGL Performance &bull; Scalable Architecture &bull; </span>))}</div></div>
        </div>

        <section id="skills" className="py-32 md:py-48 px-6 md:px-20 bg-brandDark text-brandCream relative overflow-hidden">
           <div className="max-w-7xl mx-auto">
              <h2 className="text-sm font-bold tracking-[0.6em] text-primary uppercase mb-20">&mdash; Technical Arsenal</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                 {skillCategories.map((cat, i) => (
                    <div key={i} className="group">
                       <div className="h-px w-full bg-brandCream/10 mb-10 group-hover:bg-primary transition-colors duration-700"></div>
                       <h3 className="text-3xl md:text-4xl font-black mb-6 group-hover:text-primary transition-colors duration-500">{cat.title}</h3>
                       <p className="text-brandCream/40 text-base md:text-lg mb-10 leading-relaxed">{cat.desc}</p>
                       <ul className="space-y-4">
                          {cat.skills.map((s, idx) => (
                            <li key={idx} className="flex items-center gap-4 text-lg md:text-xl font-bold"><div className="w-2 h-2 rounded-full bg-primary"></div> {s}</li>
                          ))}
                       </ul>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        <section id="projects" className="py-32 md:py-48 bg-brandCream px-6 md:px-20">
           <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-32 gap-10">
                 <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[8rem] font-black leading-none tracking-tighter scramble-text" data-value="PROJECTS">PROJECTS</h2>
                 <p className="max-w-md text-brandDark/40 font-medium text-base md:text-lg text-left">A curated selection of experiments in interaction and data storytelling.</p>
              </div>
              <div className="space-y-[12vh] md:space-y-[16vh] xl:space-y-[20vh]">
                 {projectData.map((proj, i) => (
                    <div key={i} className="sticky top-20 min-h-[65vh] md:h-[80vh] xl:h-[75vh] w-full bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-brandDark/5 p-6 md:p-10 xl:p-12 flex flex-col md:flex-row gap-6 md:gap-10 group overflow-hidden transition-all duration-500">
                       <div className="w-full md:w-1/2 h-[40vh] md:h-full bg-[#f8f8f8] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative flex flex-col border border-brandDark/5 shadow-inner order-2 md:order-1">
                          <div className="browser-frame py-2 md:py-3 relative flex items-center bg-[#eee] px-4">
                             <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" /><div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" /><div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" /></div>
                             <div className="mx-4 flex-1 bg-white rounded py-0.5 px-3 text-[8px] text-gray-400 truncate">{proj.url}</div>
                          </div>
                          <div className="flex-1 bg-white relative overflow-hidden group/demo">
                             <div className="w-full h-full transition-all duration-1000 grayscale blur-[2px] opacity-30">
                                <iframe src={proj.url} className="w-full h-full border-none pointer-events-none" title={proj.title} loading="lazy" />
                             </div>
                             <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-brandDark/5 transition-opacity group-hover/demo:bg-brandDark/10 cursor-pointer" onPointerDown={() => setActiveDemoIdx(i)}>
                                <div className="flex flex-col items-center animate-bounce">
                                   <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center mb-5 shadow-2xl"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg></div>
                                   <div className="bg-brandDark text-brandCream px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">Launch Case</div>
                                </div>
                                <p className="mt-5 text-[9px] font-black text-brandDark uppercase tracking-[0.4em]">Interactive Simulation</p>
                             </div>
                          </div>
                       </div>
                       <div className="w-full md:w-1/2 flex flex-col justify-center order-1 md:order-2 px-2 text-left">
                          <div className="flex items-center gap-4 mb-4 md:mb-6"><span className="text-primary font-bold text-xs md:text-sm tracking-widest uppercase">{proj.type}</span>{proj.isPremium && <span className="px-3 py-1 bg-primary text-white text-[8px] font-black rounded-full uppercase">Featured</span>}</div>
                          <h3 className="text-3xl md:text-4xl xl:text-5xl font-black mb-4 md:mb-6 leading-tight tracking-tighter">{proj.title}</h3>
                          <p className="text-sm md:text-base xl:text-lg text-brandDark/60 mb-6 md:mb-10 leading-relaxed font-medium">{proj.desc}</p>
                          <div className="flex flex-wrap gap-2 md:gap-3">{proj.tags.map((tag, t) => (
                               <span key={t} className="px-4 py-1.5 md:px-6 md:py-2 bg-brandDark/5 border border-brandDark/10 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        <section id="contact" className="min-h-screen bg-brandDark flex flex-col relative overflow-hidden">
           <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-32">
              <h2 className="text-[10vw] md:text-[6rem] xl:text-[8rem] font-black text-brandCream leading-[0.85] tracking-tighter mb-16 text-center">LET'S BUILD <br/> THE <span className="text-primary italic">FUTURE.</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                 <div onClick={() => setIsModalOpen(true)} className="group cursor-pointer bg-white/5 p-10 rounded-[2rem] border border-white/10 hover:border-primary transition-all duration-500">
                    <p className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4">Quick Pulse</p>
                    <span className="text-3xl md:text-5xl font-black text-brandCream group-hover:text-primary transition-colors flex items-center justify-between">WhatsApp &#x2197;</span>
                    <p className="mt-6 text-brandCream/40 text-base">+234 808 574 1430</p>
                 </div>
                 <a href="mailto:michaeldosunmu22@gmail.com" className="group cursor-pointer bg-white/5 p-10 rounded-[2rem] border border-white/10 hover:border-primary transition-all duration-500 no-underline">
                    <p className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4">Official Channel</p>
                    <span className="text-3xl md:text-5xl font-black text-brandCream group-hover:text-primary transition-colors flex items-center justify-between">Email &#x2197;</span>
                    <p className="mt-6 text-brandCream/40 text-base">michaeldosunmu22@gmail.com</p>
                 </a>
                 <a href="https://github.com/javex-12" target="_blank" rel="noopener noreferrer" className="group cursor-pointer bg-white/5 p-10 rounded-[2rem] border border-white/10 hover:border-primary transition-all duration-500 no-underline">
                    <p className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4">Open Source</p>
                    <span className="text-3xl md:text-5xl font-black text-brandCream group-hover:text-primary transition-colors flex items-center justify-between">GitHub &#x2197;</span>
                    <p className="mt-6 text-brandCream/40 text-base">github.com/javex-12</p>
                 </a>
              </div>
           </div>
            <div className="px-6 md:px-20 py-20 border-t border-white/5 relative z-10">
               <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="flex flex-col items-center md:items-start"><span className="text-2xl font-black tracking-tighter text-brandCream mb-2">CYDER<span className="text-primary">CODER</span></span><span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brandCream/20">&copy; 2026 DOSUMU MICHAEL</span></div>
                  <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary text-center">Based in Lagos State, NG</div>
                  <div className="flex items-center gap-6">
                    <a href="https://github.com/javex-12" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-brandCream/30 hover:text-primary transition-colors duration-300">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    </a>
                    <a href="mailto:michaeldosunmu22@gmail.com" aria-label="Email" className="text-brandCream/30 hover:text-primary transition-colors duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                  </div>
               </div>
            </div>
           <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none whitespace-nowrap"><span className="text-[30vw] font-black text-brandCream uppercase leading-none">EVOLVE</span></div>
        </section>
      </div>
    </>
  );
};

export default App;
