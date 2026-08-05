import React, { useEffect, useRef, useState } from 'react';
import { DnaLogo } from './DnaLogo';

type Gaze = { x: number; y: number };

const GAZES: Gaze[] = [
  { x: 0, y: 0 },
  { x: 18, y: 0 },
  { x: -18, y: 0 },
  { x: 0, y: -12 },
  { x: 0, y: 12 },
  { x: 15, y: -10 },
  { x: -15, y: -10 },
  { x: 15, y: 10 },
  { x: -15, y: 10 },
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface DelmasRobotProps {
  className?: string;
  size?: number;
}

export const DelmasRobot: React.FC<DelmasRobotProps> = ({ className = '', size }) => {
  const [gaze, setGaze] = useState<Gaze>({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let mounted = true;

    const scheduleLook = () => {
      if (!mounted) return;
      const next = GAZES[Math.floor(Math.random() * GAZES.length)];
      setGaze(next);
      const holdFor = randomBetween(900, 3200);
      const t = setTimeout(scheduleLook, holdFor);
      timers.current.push(t);
    };

    const scheduleBlink = () => {
      if (!mounted) return;
      const t1 = setTimeout(() => {
        if (!mounted) return;
        setBlinking(true);
        const t2 = setTimeout(() => {
          setBlinking(false);
          if (Math.random() < 0.3) {
            const t3 = setTimeout(() => {
              setBlinking(true);
              const t4 = setTimeout(() => setBlinking(false), 120);
              timers.current.push(t4);
            }, 180);
            timers.current.push(t3);
          }
          scheduleBlink();
        }, 120);
        timers.current.push(t2);
      }, randomBetween(1600, 5200));
      timers.current.push(t1);
    };

    const startLook = setTimeout(scheduleLook, randomBetween(400, 1200));
    timers.current.push(startLook);
    scheduleBlink();

    return () => {
      mounted = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <div className="relative w-full h-full rounded-full flex items-center justify-center">
        {/* Orb with blue-orange/bronze warm gradient */}
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center shadow-md overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 38% 32%, #bcd8ff 0%, #6aa6ec 34%, #6f88c8 56%, #b3743f 82%, #e08636 100%)',
            boxShadow:
              '0 0 14px rgba(224, 134, 54, 0.45), inset 0 -3px 6px rgba(170, 80, 25, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Shine overlay */}
          <div
            className="absolute rounded-full opacity-80 pointer-events-none"
            style={{
              top: '10%',
              left: '18%',
              width: '44%',
              height: '30%',
              background:
                'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%)',
              filter: 'blur(1px)',
            }}
          />

          {/* Upper Face section (eyes + mouth) - placed higher up */}
          <div className="absolute top-[2%] inset-x-0 bottom-[46%] flex items-center justify-center pointer-events-none z-10">
            <div
              className="flex flex-col items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `translate(${gaze.x * 0.15}px, ${gaze.y * 0.15}px)`,
              }}
            >
              {/* Eyes */}
              <div className="flex items-center justify-center gap-1.5">
                <span
                  className="block bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,1)] transition-transform duration-100"
                  style={{
                    width: '5.5px',
                    height: '10px',
                    transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)',
                  }}
                />
                <span
                  className="block bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,1)] transition-transform duration-100"
                  style={{
                    width: '5.5px',
                    height: '10px',
                    transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)',
                  }}
                />
              </div>

              {/* Mouth */}
              <span
                className="block bg-white rounded-b-full rounded-t-sm shadow-[0_0_6px_rgba(255,255,255,1)] mt-1"
                style={{
                  width: '11px',
                  height: '3.5px',
                }}
              />
            </div>
          </div>

          {/* Belly section with DNA Logo - positioned cleanly on lower belly */}
          <div className="absolute bottom-[4%] inset-x-0 flex items-center justify-center pointer-events-none z-10">
            <div className="flex items-center justify-center">
              <DnaLogo
                glow
                className="w-4.5 h-4.5 opacity-100 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
