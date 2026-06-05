import Particles from "@tsparticles/react";

export default function ParticleBg() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fpsLimit: 60,
        particles: {
          number: { value: 35, limit: 50 },
          color: { value: "#00f5ff" },
          shape: { type: "circle" },
          opacity: {
            value: 0.12,
            random: true,
            animation: { enable: true, speed: 0.5, minimumValue: 0.05, sync: false }
          },
          size: {
            value: 3,
            random: true,
            animation: { enable: true, speed: 1.5, minimumValue: 1, sync: false }
          },
          links: {
            enable: true,
            distance: 130,
            color: "#7c3aed",
            opacity: 0.14,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "out" }
          }
        },
        interactivity: {
          events: {
            onHover: { enable: false, mode: "grab" },
            onClick: { enable: false, mode: "push" },
            resize: { enable: true }
          },
          modes: {
            grab: { distance: 150, links: { opacity: 0.25 } },
            push: { quantity: 1 }
          }
        },
        detectRetina: true,
        style: {
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          zIndex: 1,
          pointerEvents: "none"
        }
      } as any}
    />
  );
}
