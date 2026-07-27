import { memo } from 'react';
import { normalizeScippyMood, type ScippyMood } from '../../config/scippy';

interface ScippyIconProps {
  mood: ScippyMood;
  size?: number;
  className?: string;
}

type Face = {
  eyeL: { x: number; y: number; w: number; h: number; rx: number };
  eyeR: { x: number; y: number; w: number; h: number; rx: number };
  mouth: string;
  mouthFill?: string;
  antennaPulse: boolean;
  cheek: boolean;
  wink?: 'right' | 'left';
  brow?: boolean;
};

const INK = '#1A5FA8';
const LED = '#E8F6FF';
const CHEEK = '#9FD0FF';

/** 浅蓝小机器人头：与 SCIP 控制塔蓝白风格一致 */
function faceFor(mood: ScippyMood): Face {
  const display = normalizeScippyMood(mood);

  if (display === 'warning') {
    return {
      eyeL: { x: 12.2, y: 17.2, w: 5.2, h: 5.2, rx: 1.4 },
      eyeR: { x: 22.6, y: 17.2, w: 5.2, h: 5.2, rx: 1.4 },
      mouth: 'M15.5 27.2 H24.5',
      antennaPulse: true,
      cheek: false,
      brow: true,
    };
  }

  switch (mood) {
    case 'excited':
      return {
        eyeL: { x: 12, y: 16.8, w: 5.6, h: 5.8, rx: 1.6 },
        eyeR: { x: 22.4, y: 16.8, w: 5.6, h: 5.8, rx: 1.6 },
        mouth: 'M14 26.2 Q20 31.2 26 26.2',
        mouthFill: LED,
        antennaPulse: true,
        cheek: true,
      };
    case 'success':
      return {
        eyeL: { x: 12.4, y: 17.4, w: 5, h: 4.8, rx: 1.4 },
        eyeR: { x: 22.6, y: 17.4, w: 5, h: 4.8, rx: 1.4 },
        mouth: 'M14.5 26.5 Q20 30 25.5 26.5',
        antennaPulse: true,
        cheek: true,
      };
    case 'thinking':
    case 'listening':
      return {
        eyeL: { x: 12.5, y: 17.6, w: 5, h: 4.6, rx: 1.3 },
        eyeR: { x: 22.5, y: 17.6, w: 5, h: 4.6, rx: 1.3 },
        mouth: 'M15.5 27 Q20 28.8 24.5 27',
        antennaPulse: false,
        cheek: true,
        wink: 'right',
      };
    case 'idle':
      return {
        eyeL: { x: 12.6, y: 18, w: 4.8, h: 4.2, rx: 1.2 },
        eyeR: { x: 22.6, y: 18, w: 4.8, h: 4.2, rx: 1.2 },
        mouth: 'M16 27 H24',
        antennaPulse: false,
        cheek: false,
      };
    default:
      return {
        eyeL: { x: 12.4, y: 17.4, w: 5, h: 5, rx: 1.4 },
        eyeR: { x: 22.6, y: 17.4, w: 5, h: 5, rx: 1.4 },
        mouth: 'M14.5 26.5 Q20 30.2 25.5 26.5',
        antennaPulse: mood === 'happy',
        cheek: true,
      };
  }
}

function ScippyIcon({ mood, size = 36, className = '' }: ScippyIconProps) {
  const f = faceFor(mood);
  const id = `scippy-bot-${mood}-${size}`;
  const isWarn = normalizeScippyMood(mood) === 'warning';

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
        <linearGradient id={`${id}-head`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="40%" stopColor="#B8E4FF" />
          <stop offset="100%" stopColor="#6BB8F5" />
        </linearGradient>
        <linearGradient id={`${id}-panel`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EAF6FF" />
          <stop offset="100%" stopColor="#C8E8FF" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-ear`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FD4FF" />
          <stop offset="100%" stopColor="#5AA8E8" />
        </linearGradient>
      </defs>

      {/* 天线 */}
      <line
        x1="20"
        y1="8.5"
        x2="20"
        y2="3.2"
        stroke="#5AA8E8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle
        cx="20"
        cy="2.6"
        r="2.2"
        fill={isWarn ? '#FAAD14' : f.antennaPulse ? '#1677FF' : '#8ECFFF'}
        stroke="#ffffff"
        strokeWidth="0.8"
      />
      {f.antennaPulse && !isWarn && (
        <circle cx="20" cy="2.6" r="1" fill="#E8F4FF" opacity="0.9" />
      )}

      {/* 左侧耳 / 铰链 */}
      <rect
        x="3.2"
        y="16.5"
        width="3.4"
        height="8"
        rx="1.2"
        fill={`url(#${id}-ear)`}
        stroke="#7EC4FF"
        strokeWidth="0.5"
      />
      <circle cx="4.9" cy="20.5" r="1" fill="#EAF6FF" />

      {/* 右侧耳 / 铰链 */}
      <rect
        x="33.4"
        y="16.5"
        width="3.4"
        height="8"
        rx="1.2"
        fill={`url(#${id}-ear)`}
        stroke="#7EC4FF"
        strokeWidth="0.5"
      />
      <circle cx="35.1" cy="20.5" r="1" fill="#EAF6FF" />

      {/* 主机头壳 */}
      <rect
        x="6.5"
        y="8"
        width="27"
        height="26"
        rx="7.5"
        fill={`url(#${id}-head)`}
        stroke="#9FD4FF"
        strokeWidth="0.7"
      />
      {/* 顶部高光 */}
      <path
        d="M10 10.5h20c2.2 0 4 1.5 4.4 3.5C31.5 12 27 10.8 20 10.8c-7.2 0-12.5 1.8-14.2 4.8C6.5 13 8.5 10.5 10 10.5z"
        fill={`url(#${id}-shine)`}
      />

      {/* 面罩 / 屏幕区 */}
      <rect
        x="10"
        y="14.5"
        width="20"
        height="16"
        rx="4.5"
        fill={`url(#${id}-panel)`}
        stroke="#A8DCFF"
        strokeWidth="0.6"
      />

      {/* 额头状态灯 */}
      <circle
        cx="20"
        cy="12.2"
        r="1.15"
        fill={isWarn ? '#FAAD14' : '#1677FF'}
        opacity="0.95"
      />
      <circle cx="20" cy="12.2" r="0.45" fill="#ffffff" opacity="0.85" />

      {f.cheek && (
        <>
          <ellipse cx="12.2" cy="25.2" rx="1.8" ry="1.1" fill={CHEEK} opacity="0.55" />
          <ellipse cx="27.8" cy="25.2" rx="1.8" ry="1.1" fill={CHEEK} opacity="0.55" />
        </>
      )}

      {f.brow && (
        <>
          <path
            d="M12.5 16.2 L16.8 17.4"
            fill="none"
            stroke={INK}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M23.2 17.4 L27.5 16.2"
            fill="none"
            stroke={INK}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </>
      )}

      {/* 眼睛（LED 块） */}
      {f.wink === 'right' ? (
        <>
          <rect
            x={f.eyeL.x}
            y={f.eyeL.y}
            width={f.eyeL.w}
            height={f.eyeL.h}
            rx={f.eyeL.rx}
            fill={INK}
          />
          <circle
            cx={f.eyeL.x + f.eyeL.w * 0.35}
            cy={f.eyeL.y + f.eyeL.h * 0.35}
            r="0.7"
            fill="#fff"
          />
          <path
            d="M22.8 19.8 Q25.2 17.8 27.6 19.8"
            fill="none"
            stroke={INK}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <rect
            x={f.eyeL.x}
            y={f.eyeL.y}
            width={f.eyeL.w}
            height={f.eyeL.h}
            rx={f.eyeL.rx}
            fill={isWarn ? '#D48806' : INK}
          />
          <rect
            x={f.eyeR.x}
            y={f.eyeR.y}
            width={f.eyeR.w}
            height={f.eyeR.h}
            rx={f.eyeR.rx}
            fill={isWarn ? '#D48806' : INK}
          />
          <circle
            cx={f.eyeL.x + f.eyeL.w * 0.35}
            cy={f.eyeL.y + f.eyeL.h * 0.35}
            r="0.7"
            fill="#fff"
            opacity="0.95"
          />
          <circle
            cx={f.eyeR.x + f.eyeR.w * 0.35}
            cy={f.eyeR.y + f.eyeR.h * 0.35}
            r="0.7"
            fill="#fff"
            opacity="0.95"
          />
        </>
      )}

      {/* 嘴巴 */}
      {f.mouthFill ? (
        <path
          d={f.mouth}
          fill={f.mouthFill}
          stroke={INK}
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d={f.mouth}
          fill="none"
          stroke={isWarn ? '#D48806' : INK}
          strokeWidth="1.45"
          strokeLinecap="round"
        />
      )}

      {/* 下巴通风口小点缀 */}
      <circle cx="17.2" cy="32.2" r="0.55" fill="#7EC4FF" opacity="0.7" />
      <circle cx="20" cy="32.2" r="0.55" fill="#7EC4FF" opacity="0.7" />
      <circle cx="22.8" cy="32.2" r="0.55" fill="#7EC4FF" opacity="0.7" />
    </svg>
  );
}

export default memo(ScippyIcon);
