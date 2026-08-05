import React, { useEffect, useRef, useState } from 'react';

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

interface BlueRobotProps {
  className?: string;
  size?: number; // Size in pixels if provided
}

export const BlueRobot: React.FC<BlueRobotProps> = ({ className = '', size }) => {
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
    <div className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`} style={size ? { width: size, height: size } : undefined}>
      {/* Robot floating sphere */}
      <div className="relative w-full h-full rounded-full flex items-center justify-center animate-pulse-slow">
        {/* Orb with radial blue gradient */}
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'radial-gradient(circle at 38% 32%, #7ec2ff 0%, #3b9bff 42%, #1f6fe0 78%, #1858bd 100%)',
            boxShadow: '0 0 12px rgba(59, 155, 255, 0.5), inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)'
          }}
        >
          {/* Shine overlay */}
          <div
            className="absolute rounded-full opacity-80 pointer-events-none"
            style={{
              top: '12%',
              left: '18%',
              width: '44%',
              height: '32%',
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)',
              filter: 'blur(1px)'
            }}
          />

          {/* Face container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Gaze position container - relative scaling for gaze offsets */}
            <div
              className="flex flex-col items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `translate(${gaze.x * 0.25}px, ${gaze.y * 0.25}px)`
              }}
            >
              {/* Eyes */}
              <div className="flex items-center justify-center gap-1.5">
                <span
                  className="block bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.9)] transition-transform duration-100"
                  style={{
                    width: '18%',
                    height: '35%',
                    minWidth: '4px',
                    minHeight: '8px',
                    aspectRatio: '1/2',
                    transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)'
                  }}
                />
                <span
                  className="block bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.9)] transition-transform duration-100"
                  style={{
                    width: '18%',
                    height: '35%',
                    minWidth: '4px',
                    minHeight: '8px',
                    aspectRatio: '1/2',
                    transform: blinking ? 'scaleY(0.1)' : 'scaleY(1)'
                  }}
                />
              </div>

              {/* Mouth */}
              <span
                className="block bg-white rounded-b-full rounded-t-sm shadow-[0_0_4px_rgba(255,255,255,0.9)] mt-1 animate-talk-subtle"
                style={{
                  width: '40%',
                  height: '18%',
                  minWidth: '8px',
                  minHeight: '3px',
                  aspectRatio: '5/2'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
