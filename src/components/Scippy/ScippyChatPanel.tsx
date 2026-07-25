import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_QUICK_ACTIONS,
  scippySettings,
} from '../../config/scippy';
import { useScippyStore } from '../../store/useScippyStore';
import type { ScippyActionDef } from './scippyApi';
import { ScippyActionButtons, useScippyEngine } from './ScippyEngine';
import TypingAnimation from './TypingAnimation';
import './Scippy.css';

export type ScippyChatVariant = 'compact' | 'full';

interface ScippyChatPanelProps {
  variant?: ScippyChatVariant;
  className?: string;
  showQuickActions?: boolean;
  listRef?: RefObject<HTMLDivElement | null>;
}

function ScippyChatPanelInner({
  variant = 'compact',
  className = '',
  showQuickActions = true,
  listRef: externalListRef,
}: ScippyChatPanelProps) {
  const navigate = useNavigate();
  const { ask } = useScippyEngine();

  const messages = useScippyStore((s) => s.messages);
  const typing = useScippyStore((s) => s.typing);
  const input = useScippyStore((s) => s.input);
  const setInput = useScippyStore((s) => s.setInput);

  const [actionsReady, setActionsReady] = useState(true);
  const internalListRef = useRef<HTMLDivElement>(null);
  const listRef = externalListRef ?? internalListRef;

  const isFull = variant === 'full';
  const quickActions = isFull
    ? DEFAULT_QUICK_ACTIONS
    : DEFAULT_QUICK_ACTIONS.slice(0, scippySettings.quickActionCount);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
    setActionsReady(false);
  }, [messages, typing, listRef]);

  const onAction = useCallback(
    (a: ScippyActionDef) => {
      if (a.navigateTo) navigate(a.navigateTo);
      if (a.followUpPrompt) ask(a.followUpPrompt);
    },
    [ask, navigate],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const lastBot = [...messages].reverse().find((m) => m.role === 'scippy');

  return (
    <div
      className={`flex min-h-0 flex-col ${isFull ? 'scippy-chat-full' : 'flex-1'} ${className}`}
    >
      <div
        ref={listRef}
        className={`flex flex-1 flex-col gap-2 overflow-y-auto ${
          isFull ? 'px-4 py-4' : 'px-3 py-2'
        }`}
      >
        {messages.length === 0 && !typing && (
          <div
            className={`rounded-xl border border-dashed border-[#D0E4FF] bg-white/60 text-center ${
              isFull ? 'px-6 py-10' : 'px-4 py-6'
            }`}
          >
            <p className={`text-[#667085] ${isFull ? 'text-sm' : 'text-xs'}`}>
              开始和 Scippy 对话吧～ 快捷提问或输入你的问题
            </p>
          </div>
        )}

        {messages.map((m, idx) => {
          const isLastBot =
            m.role === 'scippy' && lastBot?.id === m.id && !typing;
          return (
            <div
              key={m.id}
              className={`max-w-[95%] ${
                isFull ? 'px-4 py-3' : 'px-3 py-2'
              } ${m.role === 'user' ? 'scippy-msg-user' : 'scippy-msg-bot'}`}
            >
              {m.role === 'scippy' && isLastBot && idx === messages.length - 1 ? (
                <TypingAnimation
                  text={m.content}
                  onDone={() => setActionsReady(true)}
                  className={isFull ? 'text-[15px]' : ''}
                />
              ) : (
                <div
                  className={`whitespace-pre-wrap leading-relaxed ${
                    isFull ? 'text-[15px]' : 'text-sm'
                  }`}
                >
                  {m.content}
                </div>
              )}
              {m.role === 'scippy' &&
                m.actions &&
                (isLastBot ? actionsReady : true) && (
                  <ScippyActionButtons actions={m.actions} onAction={onAction} />
                )}
            </div>
          );
        })}

        {typing && (
          <div
            className={`scippy-msg-bot max-w-[80%] text-[#667085] ${
              isFull ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-sm'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="scippy-typing-dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              正在回复…
            </span>
          </div>
        )}
      </div>

      <div
        className={`border-t border-[#D0E4FF] bg-white/90 ${
          isFull ? 'px-4 py-3' : 'px-3 py-2'
        }`}
      >
        {showQuickActions && quickActions.length > 0 && (
          <div className={`mb-2 flex flex-wrap gap-1.5 ${isFull ? 'gap-2' : ''}`}>
            {quickActions.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => ask(q.prompt)}
                className="scippy-chip"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {scippySettings.showInput && (
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="问问 Scippy…"
              aria-label="向 Scippy 提问"
              className={`scippy-input ${isFull ? 'scippy-input-full' : ''}`}
            />
            <button
              type="submit"
              className={`scippy-btn-primary ${isFull ? 'scippy-btn-primary-full' : ''}`}
            >
              发送
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const ScippyChatPanel = memo(ScippyChatPanelInner);
export default ScippyChatPanel;
