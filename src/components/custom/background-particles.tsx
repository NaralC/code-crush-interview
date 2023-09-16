import { FC, useCallback, useEffect, useState } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

const BackgroundParticles: FC = () => {
  // Inspiration: https://highstorm.app/ && https://github.com/matteobruni/tsparticles/blob/main/utils/configs/src/a/absorbers.ts
  
  const particlesInit = useCallback(async (engine: Engine) => {
    // console.log(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      // await console.log(container);
    },
    []
  );

  return (
    <Particles
      className="-z-50"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 60,
        name: "Among Us",
        particles: {
          groups: {
            z5000: {
              number: {
                value: 70,
              },
              zIndex: {
                value: 50,
              },
            },
            z7500: {
              number: {
                value: 30,
              },
              zIndex: {
                value: 75,
              },
            },
            z2500: {
              number: {
                value: 50,
              },
              zIndex: {
                value: 25,
              },
            },
            z1000: {
              number: {
                value: 40,
              },
              zIndex: {
                value: 10,
              },
            },
          },
          number: {
            value: 200,
          },
          color: {
            value: "#fff",
            animation: {
              enable: false,
              speed: 20,
              sync: true,
            },
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 1,
          },
          size: {
            value: 3,
          },
          move: {
            angle: {
              value: 10,
              offset: 0,
            },
            enable: true,
            speed: 5,
            direction: "right",
          },
          zIndex: {
            value: 5,
            opacityRate: 0.5,
          },
        },
        background: {
          color: "#000000",
        },
        emitters: {
          position: {
            y: 55,
            x: -5,
          },
          rate: {
            delay: 7,
            quantity: 1,
          },
          size: {
            width: 0,
            height: 0,
          },
          particles: {
            shape: {
              type: "images",
              options: {
                images: {
                  src: "https://particles.js.org/images/cyan_amongus.png",
                  width: 500,
                  height: 634,
                },
              },
            },
            size: {
              value: 40,
            },
            move: {
              speed: 10,
              outModes: {
                default: "none",
                right: "destroy",
              },
              straight: true,
            },
            zIndex: {
              value: 0,
            },
            rotate: {
              value: {
                min: 0,
                max: 360,
              },
              animation: {
                enable: true,
                speed: 10,
                sync: true,
              },
            },
          },
        },
      }}
    />
  );
};

export default BackgroundParticles;
