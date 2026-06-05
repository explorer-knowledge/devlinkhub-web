import Particles from "@tsparticles/react";

export default function ParticleBg() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fpsLimit: 30,                    // was 60 — halves GPU work
        particles: {
          number: { value: 18, limit: 20 }, // was 35/50 — 50% fewer particles
          color: { value: "#00f5ff" },
          shape: { type: "circle" },
          opacity: {
            value: 0.10,
            random: true,
            animation: { enable: false }  // disabled opacity animation (saves perf)
          },
          size: {
            value: 2,
            random: true,
            animation: { enable: false }  // disabled size animation
          },
          links: {
            enable: false,               // DISABLED links — link calc is O(n²), major perf killer
          },
          move: {
            enable: true,
            speed: 0.5,                  // slower = fewer style recalcs
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "out" }
          }
        },
        interactivity: {
          events: {
            onHover: { enable: false },
            onClick: { enable: false },
            resize: { enable: false }    // resize listener removed
          }
        },
        detectRetina: false,             // was true — retina doubles canvas pixels (4x fill rate)
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
