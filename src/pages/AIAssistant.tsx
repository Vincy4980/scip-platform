import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScippyChatPanel from '../components/Scippy/ScippyChatPanel';
import ScippyIcon from '../components/Scippy/ScippyIcon';
import { scippyPersonality, toScippyVisualMood } from '../config/scippy';
import { useScippyStore } from '../store/useScippyStore';
import '../components/Scippy/Scippy.css';

/**
 * AI 助手全屏对话台：与右下角 Scippy 浮窗共用 store，历史实时同步。
 */
export default function AIAssistant() {
  const mood = useScippyStore((s) => s.mood);
  const messages = useScippyStore((s) => s.messages);
  const ensureGreeting = useScippyStore((s) => s.ensureGreeting);
  const setExpanded = useScippyStore((s) => s.setExpanded);

  useEffect(() => {
    setExpanded(false);
    ensureGreeting();
  }, [ensureGreeting, setExpanded]);

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-4xl flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-[#D0E4FF] bg-white p-2 shadow-sm">
            <ScippyIcon mood={toScippyVisualMood(mood)} size={44} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#1D2939]">Scippy 对话台</h2>
            <p className="mt-1 text-sm text-[#667085]">
              全屏深度对话 · 与右下角快捷浮窗<strong>同一会话</strong>，消息实时同步
            </p>
            <p className="mt-1 text-xs text-[#98A2B3]">
              当前共 {messages.length} 条消息 · {scippyPersonality.title}
            </p>
          </div>
        </div>
        <Link
          to="/my-workspace"
          className="rounded-xl border border-[#E4E7EC] bg-white px-3 py-1.5 text-xs text-[#667085] hover:bg-[#F2F4F7]"
        >
          返回工作台
        </Link>
      </div>

      <div className="scippy-chat-page flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#D0E4FF] bg-gradient-to-b from-white to-[#F7FBFF] shadow-sm">
        <ScippyChatPanel variant="full" showQuickActions />
      </div>
    </div>
  );
}
