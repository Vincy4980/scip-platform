import { memo } from 'react';
import { avatarFontSize, getAvatarPalette } from '../utils/avatar';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
  const palette = getAvatarPalette(name);
  const label = name.trim() || '?';

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold leading-none ring-2 ${palette.bg} ${palette.text} ${palette.ring} ${SIZE_CLASS[size]} ${avatarFontSize(label, size)} ${className}`}
      title={label}
      aria-label={label}
    >
      <span className="max-w-[92%] truncate px-0.5 text-center">{label}</span>
    </div>
  );
}

export default memo(UserAvatar);
