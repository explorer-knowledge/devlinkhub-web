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

    // ── Setup ──
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 22;
    const particles: Particle[] = [];

    const makeParticle = (w: number, h: number): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.12 + 0.04,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(makeParticle(width, height));
    }

    // ── Animation loop ──
    let rafId: number;
    let frameCount = 0;

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      // Throttle: only draw every 2nd frame (~30fps)
      frameCount++;
      if (frameCount % 2 !== 0) return;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${p.opacity})`;
        ctx.fill();
      }
    };

    draw();

    // ── Resize ──
    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── CRITICAL: full cleanup on unmount ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      // Clear canvas and release pixel buffer
      canvas.width = 0;
      canvas.height = 0;
      particles.length = 0;
    };
  }, []); // empty deps — runs once, cleans up once

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
