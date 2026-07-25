import { create } from 'zustand';
import {
  DEFAULT_QUICK_ACTIONS,
  toScippyVisualMood,
  scippyMoodEmoji,
  scippyPersonality,
  scippySettings,
  type ScippyMood,
} from '../config/scippy';
import type { ScippyIntent } from '../components/Scippy/intents';
import { matchIntent } from '../components/Scippy/intents';
import { buildContextualReply, buildReply } from '../components/Scippy/responses';
import type { ScippyActionDef } from '../components/Scippy/scippyApi';

export interface ScippyMessage {
  id: string;
  role: 'user' | 'scippy';
  content: string;
  timestamp: number;
  actions?: ScippyActionDef[];
  mood?: ScippyMood;
}

interface ScippyState {
  expanded: boolean;
  mood: ScippyMood;
  messages: ScippyMessage[];
  unread: boolean;
  typing: boolean;
  lastIntent: ScippyIntent | null;
  greeted: boolean;
  input: string;
  position: { x: number; y: number } | null;
  quickActions: { id: string; label: string; prompt: string }[];
  setExpanded: (v: boolean) => void;
  setInput: (v: string) => void;
  setPosition: (p: { x: number; y: number } | null) => void;
  setMood: (m: ScippyMood) => void;
  clearUnread: () => void;
  ensureGreeting: (isRefresh?: boolean) => void;
  sendUserText: (text: string) => void;
  markProactive: (content: string, actions?: ScippyActionDef[]) => void;
}

function uid() {
  return `sp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useScippyStore = create<ScippyState>((set, get) => ({
  expanded: false,
  mood: 'idle',
  messages: [],
  unread: false,
  typing: false,
  lastIntent: null,
  greeted: false,
  input: '',
  position: null,
  quickActions: [...DEFAULT_QUICK_ACTIONS],

  setExpanded: (v) => {
    set({ expanded: v, unread: v ? false : get().unread });
    if (v) set({ mood: 'idle' });
  },
  setInput: (v) => set({ input: v }),
  setPosition: (p) => set({ position: p }),
  setMood: (m) => set({ mood: toScippyVisualMood(m) }),
  clearUnread: () => set({ unread: false }),

  ensureGreeting: (isRefresh = false) => {
    if (get().greeted) return;
    const delay = isRefresh
      ? scippySettings.refreshGreetingDelayMs
      : scippySettings.greetingDelayMs;
    window.setTimeout(() => {
      if (get().greeted) return;
      const phrase =
        scippyPersonality.greetingPhrases[
          Math.floor(Math.random() * scippyPersonality.greetingPhrases.length)
        ]!;
      set({
        greeted: true,
        expanded: true,
        mood: 'happy',
        unread: false,
        messages: [
          {
            id: uid(),
            role: 'scippy',
            content: phrase,
            timestamp: Date.now(),
            mood: 'happy',
          },
        ],
      });
    }, delay);
  },

  sendUserText: (raw) => {
    const text = raw.trim();
    if (!text) return;

    const userMsg: ScippyMessage = {
      id: uid(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      input: '',
      typing: true,
      mood: 'thinking',
      expanded: true,
      unread: false,
    }));

    window.setTimeout(() => {
      const contextual = buildContextualReply(text, get().lastIntent);
      const intent = contextual ? get().lastIntent ?? matchIntent(text) : matchIntent(text);
      const reply = contextual ?? buildReply(intent, text);
      const displayMood = toScippyVisualMood(reply.mood);

      set((s) => ({
        typing: false,
        mood: displayMood,
        lastIntent: intent,
        messages: [
          ...s.messages,
          {
            id: uid(),
            role: 'scippy',
            content: reply.content,
            timestamp: Date.now(),
            actions: reply.actions,
            mood: displayMood,
          },
        ],
      }));
    }, 450 + Math.min(800, text.length * 20));
  },

  markProactive: (content, actions) => {
    const expanded = get().expanded;
    set((s) => ({
      messages: [
        ...s.messages,
        {
          id: uid(),
          role: 'scippy',
          content,
          timestamp: Date.now(),
          mood: 'warning',
          actions: actions ?? [
            { label: '查看告警', navigateTo: '/logistics' },
            { label: '标准SOP', followUpPrompt: '怎么应对突发情况' },
            { label: '稍后处理', followUpPrompt: '谢谢' },
          ],
        },
      ],
      mood: 'warning',
      unread: !expanded,
      expanded: expanded ? true : s.expanded,
    }));
  },
}));

export function getMoodEmoji(mood: ScippyMood) {
  return scippyMoodEmoji[mood];
}
