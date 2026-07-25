import { memo } from 'react';
import { normalizeScippyMood, type ScippyMood } from '../../config/scippy';

interface ScippyIconProps {
  mood: ScippyMood;
  size?: number;
  className?: string;
}

type Face = {
  eyeL: { cx: number; cy: number; r: number };
  eyeR: { cx: number; cy: number; r: number };
  browL?: string;
  browR?: string;
  mouth: string;
  mouthFill?: string;
  cheek: boolean;
  spark: boolean;
  heart?: boolean;
  wink?: 'right' | 'left';
  eyeShine?: boolean;
};

const INK = '#2B5F8A';
const CHEEK = '#FFBDAA';

/** 浅蓝 Scippy：表情丰富，仅开心系 + 紧急告警，无消极脸 */
function faceFor(mood: ScippyMood): Face {
  const display = normalizeScippyMood(mood);

  if (display === 'warning') {
    return {
      eyeL: { cx: 14, cy: 14.5, r: 2 },
      eyeR: { cx: 22, cy: 14.5, r: 2 },
      browL: 'M11 11.5 L16.5 12.8',
      browR: 'M19.5 12.8 L25 11.5',
      mouth: 'M14.5 22.5 L21.5 22.5',
      cheek: false,
      spark: true,
      eyeShine: true,
    };
  }

  switch (mood) {
    case 'excited':
      return {
        eyeL: { cx: 13.5, cy: 14.5, r: 2.2 },
        eyeR: { cx: 22.5, cy: 14.5, r: 2.2 },
        mouth: 'M12 19.5 Q18 26 24 19.5',
        mouthFill: '#FFE8DC',
        cheek: true,
        spark: true,
        heart: true,
        eyeShine: true,
      };
    case 'success':
      return {
        eyeL: { cx: 14, cy: 14.8, r: 1.9 },
        eyeR: { cx: 22, cy: 14.8, r: 1.9 },
        mouth: 'M12.5 20 Q18 24.5 23.5 20',
        cheek: true,
        spark: true,
        eyeShine: true,
      };
    case 'thinking':
    case 'listening':
      return {
        eyeL: { cx: 14, cy: 15, r: 1.9 },
        eyeR: { cx: 22, cy: 15, r: 1.9 },
        mouth: 'M14 21 Q18 23.5 22 21',
        cheek: true,
        spark: false,
        wink: 'right',
        eyeShine: true,
      };
    case 'idle':
      return {
        eyeL: { cx: 14, cy: 15.2, r: 1.7 },
        eyeR: { cx: 22, cy: 15.2, r: 1.7 },
        mouth: 'M14.5 20.5 Q18 22.5 21.5 20.5',
        cheek: false,
        spark: false,
        eyeShine: true,
      };
    default:
      return {
        eyeL: { cx: 14, cy: 15, r: 1.9 },
        eyeR: { cx: 22, cy: 15, r: 1.9 },
        mouth: 'M13 20 Q18 25 23 20',
        cheek: true,
        spark: mood === 'happy',
        eyeShine: true,
      };
  }
}

function ScippyIcon({ mood, size = 36, className = '' }: ScippyIconProps) {
  const f = faceFor(mood);
  const id = `scippy-${mood}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label={`Scippy ${mood}`}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DDF0FF" />
          <stop offset="45%" stopColor="#A8DCFF" />
          <stop offset="100%" stopColor="#7EC4FF" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-blush`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M8 6.5h20c3.6 0 6.5 2.9 6.5 6.5v10c0 3.6-2.9 6.5-6.5 6.5H16l-5.5 4.2c-.7.5-1.7 0-1.7-.9V29.5C7.2 26 5.5 23.2 5.5 20V13c0-3.6 2.9-6.5 6.5-6.5z"
        fill={`url(#${id}-bg)`}
        stroke="#B8E4FF"
        strokeWidth="0.6"
      />
      <path
        d="M10 8h16c2.8 0 5 2 5.4 4.6C28 11 24.5 9.5 20 9.5c-5.5 0-10 2.2-12 5.4C8.3 11.5 10 8 10 8z"
        fill={`url(#${id}-shine)`}
      />
      <ellipse cx="20" cy="22" rx="11" ry="9" fill={`url(#${id}-blush)`} />

      {f.cheek && (
        <>
          <ellipse cx="11.5" cy="19.5" rx="2.4" ry="1.4" fill={CHEEK} opacity="0.65" />
          <ellipse cx="24.5" cy="19.5" rx="2.4" ry="1.4" fill={CHEEK} opacity="0.65" />
        </>
      )}

      {f.browL && (
        <path d={f.browL} fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      )}
      {f.browR && (
        <path d={f.browR} fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      )}

      {f.wink === 'right' ? (
        <>
          <circle cx={f.eyeL.cx} cy={f.eyeL.cy} r={f.eyeL.r} fill={INK} />
          {f.eyeShine && (
            <circle cx={f.eyeL.cx - 0.5} cy={f.eyeL.cy - 0.5} r="0.55" fill="#fff" />
          )}
          <path
            d="M19.5 15 Q22 13.2 24.5 15"
            fill="none"
            stroke={INK}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </>
      ) : f.wink === 'left' ? (
        <>
          <path
            d="M11.5 15 Q14 13.2 16.5 15"
            fill="none"
            stroke={INK}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx={f.eyeR.cx} cy={f.eyeR.cy} r={f.eyeR.r} fill={INK} />
          {f.eyeShine && (
            <circle cx={f.eyeR.cx - 0.5} cy={f.eyeR.cy - 0.5} r="0.55" fill="#fff" />
          )}
        </>
      ) : (
        <>
          <circle cx={f.eyeL.cx} cy={f.eyeL.cy} r={f.eyeL.r} fill={INK} />
          <circle cx={f.eyeR.cx} cy={f.eyeR.cy} r={f.eyeR.r} fill={INK} />
          {f.eyeShine && (
            <>
              <circle cx={f.eyeL.cx - 0.5} cy={f.eyeL.cy - 0.5} r="0.55" fill="#fff" />
              <circle cx={f.eyeR.cx - 0.5} cy={f.eyeR.cy - 0.5} r="0.55" fill="#fff" />
            </>
          )}
        </>
      )}

      {f.mouthFill ? (
        <path d={f.mouth} fill={f.mouthFill} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      ) : (
        <path d={f.mouth} fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      )}

      {f.spark && (
        <>
          <path
            d="M29.5 8.5 L30.5 10.5 L32.5 11 L30.5 11.5 L29.5 13.5 L28.5 11.5 L26.5 11 L28.5 10.5 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          <circle cx="8.5" cy="10.5" r="1.1" fill="#FFFFFF" opacity="0.9" />
        </>
      )}

      {f.heart && (
        <path
          d="M33 17 C33 15 31 14 30 15.5 C29 14 27 15 27 17 C27 19 30 21 30 21 C30 21 33 19 33 17Z"
          fill="#FF9EB5"
          opacity="0.85"
        />
      )}
    </svg>
  );
}

export default memo(ScippyIcon);
