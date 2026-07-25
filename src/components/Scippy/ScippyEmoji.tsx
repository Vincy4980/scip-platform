import { memo } from 'react';
import { scippyMoodEmoji, type ScippyMood } from '../../config/scippy';

interface ScippyEmojiProps {
  mood: ScippyMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClass = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-3xl',
};

function ScippyEmoji({ mood, size = 'md', className = '' }: ScippyEmojiProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClass[size]} ${className}`}
      role="img"
      aria-label={`Scippy ${mood}`}
    >
      {scippyMoodEmoji[mood]}
    </span>
  );
}

export default memo(ScippyEmoji);
