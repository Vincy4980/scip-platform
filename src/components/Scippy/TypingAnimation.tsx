import { memo, useEffect, useRef, useState } from 'react';
import { scippySettings } from '../../config/scippy';

interface TypingAnimationProps {
  text: string;
  speedMs?: number;
  onDone?: () => void;
  className?: string;
}

function TypingAnimation({
  text,
  speedMs = scippySettings.typingSpeedMs,
  onDone,
  className = '',
}: TypingAnimationProps) {
  const [shown, setShown] = useState('');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setShown('');
    let i = 0;
    const chars = Array.from(text);
    const timer = window.setInterval(() => {
      i += 1;
      setShown(chars.slice(0, i).join(''));
      if (i >= chars.length) {
        window.clearInterval(timer);
        onDoneRef.current?.();
      }
    }, speedMs);
    return () => window.clearInterval(timer);
  }, [text, speedMs]);

  return (
    <div className={`whitespace-pre-wrap text-sm leading-relaxed ${className}`}>
      {shown}
      {shown.length < text.length && (
        <span className="ml-0.5 inline-block animate-pulse">▍</span>
      )}
    </div>
  );
}

export default memo(TypingAnimation);
