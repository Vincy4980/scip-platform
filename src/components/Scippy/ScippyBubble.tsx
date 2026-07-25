import {
  memo,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  POSITION_STORAGE_KEY,
  scippyPersonality,
  scippySettings,
  toScippyVisualMood,
} from '../../config/scippy';
import { useScippyStore } from '../../store/useScippyStore';
import { getPendingAlerts } from './scippyApi';
import ScippyChatPanel from './ScippyChatPanel';
import ScippyIcon from './ScippyIcon';
import './Scippy.css';

const DEFAULT_RIGHT = 30;
const DEFAULT_BOTTOM = 80;

function loadPosition(): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(POSITION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { x: number; y: number };
  } catch {
    return null;
  }
}

function snapToEdge(x: number, y: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const nearRight = x > vw / 2;
  const nx = nearRight ? vw - DEFAULT_RIGHT - 60 : DEFAULT_RIGHT;
  const ny = Math.min(Math.max(y, 16), vh - 80);
  return { x: nx, y: ny };
}

function ScippyBubbleInner() {
  const navigate = useNavigate();
  const location = useLocation();

  const expanded = useScippyStore((s) => s.expanded);
  const mood = useScippyStore((s) => s.mood);
  const unread = useScippyStore((s) => s.unread);
  const typing = useScippyStore((s) => s.typing);
  const position = useScippyStore((s) => s.position);
  const setExpanded = useScippyStore((s) => s.setExpanded);
  const setPosition = useScippyStore((s) => s.setPosition);
  const ensureGreeting = useScippyStore((s) => s.ensureGreeting);
  const markProactive = useScippyStore((s) => s.markProactive);
  const clearUnread = useScippyStore((s) => s.clearUnread);

  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const pointerOrigin = useRef({ x: 0, y: 0 });
  const didDragRef = useRef(false);
  const pathRef = useRef(location.pathname);
  const idleTimer = useRef<number | null>(null);

  const isFullPage = location.pathname === '/ai';
  const DRAG_THRESHOLD_PX = 6;

  useEffect(() => {
    const saved = loadPosition();
    if (saved) setPosition(saved);
    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isRefresh = nav?.type === 'reload';
    ensureGreeting(isRefresh);
  }, [ensureGreeting, setPosition]);

  useEffect(() => {
    if (pathRef.current !== location.pathname) {
      pathRef.current = location.pathname;
      if (!useScippyStore.getState().expanded) {
        useScippyStore.getState().setMood('happy');
        window.setTimeout(() => {
          if (!useScippyStore.getState().expanded) {
            useScippyStore.getState().setMood('idle');
          }
        }, 1200);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!scippySettings.proactiveEnabled) return;

    const resetIdle = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        markProactive('需要我帮你分析一下当前页面的数据吗？💡');
      }, 3 * 60 * 1000);
    };

    const events = ['pointerdown', 'keydown', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    resetIdle();

    const alertTimer = window.setTimeout(() => {
      const pending = getPendingAlerts().filter((a) => a.level === 'critical');
      if (pending[0]) {
        markProactive(
          `⚠️ 情感感知 + 主动SOP\n检测到高优告警：${pending[0].title}\n\n📋 建议标准处理流程：\n1. 确认影响范围（物料/客户/线路）\n2. 通知责任角色并记录\n3. 启动替代供方或改派运力\n4. 在「补货闭环/物流」回写结果\n\n需要我带你处理吗？`,
          [
            { label: '查看告警', navigateTo: '/logistics' },
            { label: '执行SOP详解', followUpPrompt: '怎么应对突发情况' },
            { label: '打开闭环', navigateTo: '/process-flow' },
          ],
        );
      }
    }, 45_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      window.clearTimeout(alertTimer);
    };
  }, [markProactive]);

  const stylePos =
    position != null
      ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
      : { right: DEFAULT_RIGHT, bottom: DEFAULT_BOTTOM };

  const openFullChat = () => {
    setExpanded(false);
    clearUnread();
    navigate('/ai');
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    pointerOrigin.current = { x: e.clientX, y: e.clientY };
    didDragRef.current = false;
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - pointerOrigin.current.x;
    const dy = e.clientY - pointerOrigin.current.y;
    if (!didDragRef.current) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      didDragRef.current = true;
    }
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (!didDragRef.current) return;
    const cur = useScippyStore.getState().position;
    if (!cur) return;
    const snapped = snapToEdge(cur.x, cur.y);
    setPosition(snapped);
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(snapped));
  };

  const onFabClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    setExpanded(true);
    clearUnread();
  };

  /** 全屏对话台已打开时隐藏浮窗，避免重复 UI */
  if (isFullPage) return null;

  if (!expanded) {
    return (
      <div className="scippy-root" style={stylePos}>
        <button
          type="button"
          className={`scippy-fab ${unread ? 'shake' : ''}`}
          aria-label="打开 Scippy 助手"
          onClick={onFabClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {unread && <span className="scippy-unread" />}
          <ScippyIcon
            mood={unread ? 'warning' : toScippyVisualMood(mood)}
            size={34}
          />
          <span className="scippy-fab-label">{scippyPersonality.name}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="scippy-root" style={stylePos}>
      <div
        className="scippy-bubble"
        role="dialog"
        aria-label="Scippy 供应链助手"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <header className="scippy-header scippy-drag-handle flex items-center gap-2 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0E4FF] bg-white shadow-sm">
            <ScippyIcon mood={typing ? 'thinking' : toScippyVisualMood(mood)} size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1D2939]">
              {scippyPersonality.name}
              <span className="scippy-online-dot" title="在线" />
            </div>
            <div className="text-[10px] text-[#667085]">{scippyPersonality.title}</div>
          </div>
          <button
            type="button"
            data-no-drag
            className="scippy-header-btn"
            title="打开全屏对话台"
            onClick={openFullChat}
          >
            对话台
          </button>
          <button
            type="button"
            data-no-drag
            aria-label="最小化"
            className="rounded-lg px-2 py-1 text-[#667085] hover:bg-[#E8F3FF] hover:text-[#1677FF]"
            onClick={() => setExpanded(false)}
          >
            −
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col" data-no-drag>
          <ScippyChatPanel variant="compact" />
        </div>
      </div>
    </div>
  );
}

const ScippyBubble = memo(ScippyBubbleInner);
export default ScippyBubble;
