import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export default function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 18; // reduced from 22
    const particles: Particle[] = [];

    const makeParticle = (w: number, h: number): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.10 + 0.03,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(makeParticle(width, height));
    }

    let rafId: number;
    let frameCount = 0;
    // ── FIX: pause when tab hidden, resume when visible ──
    let isPaused = document.hidden;

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      // ── CRITICAL FIX: do nothing when tab is not visible ──
      if (isPaused) return;

      // Draw every 2nd frame (~30fps)
      frameCount++;
      if (frameCount % 2 !== 0) return;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${p.opacity})`;
        ctx.fill();
      }
    };

    // ── Tab visibility: pause/resume RAF ──
    const onVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize, { passive: true });

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      canvas.width = 0;
      canvas.height = 0;
      particles.length = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
