/** 浅色头像底色，与平台 Morandi/浅蓝风格一致 */
export const AVATAR_PALETTES = [
  { bg: 'bg-[#E8F3FF]', text: 'text-[#1677FF]', ring: 'ring-[#D0E4FF]' },
  { bg: 'bg-[#FFF1E6]', text: 'text-[#FF7D29]', ring: 'ring-[#FFE4CC]' },
  { bg: 'bg-[#E8FFEA]', text: 'text-[#00B42A]', ring: 'ring-[#CFF7D5]' },
  { bg: 'bg-[#F3E8FF]', text: 'text-[#845EC2]', ring: 'ring-[#E8D9FF]' },
  { bg: 'bg-[#FFF7E6]', text: 'text-[#FAAD14]', ring: 'ring-[#FFE8B8]' },
  { bg: 'bg-[#E6FFFB]', text: 'text-[#13C2C2]', ring: 'ring-[#B8F0EC]' },
  { bg: 'bg-[#FFF0F6]', text: 'text-[#EB2F96]', ring: 'ring-[#FFD6E8]' },
  { bg: 'bg-[#F0F5FF]', text: 'text-[#2F54EB]', ring: 'ring-[#D6E4FF]' },
] as const;

export type AvatarPalette = (typeof AVATAR_PALETTES)[number];

export function getAvatarPalette(seed: string): AvatarPalette {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length]!;
}

export function avatarFontSize(name: string, size: 'sm' | 'md' | 'lg'): string {
  const len = name.trim().length;
  if (size === 'sm') {
    if (len <= 2) return 'text-[10px]';
    if (len <= 3) return 'text-[9px]';
    return 'text-[8px]';
  }
  if (size === 'md') {
    if (len <= 2) return 'text-xs';
    if (len <= 3) return 'text-[11px]';
    return 'text-[10px]';
  }
  if (len <= 2) return 'text-sm';
  if (len <= 3) return 'text-xs';
  return 'text-[11px]';
}
