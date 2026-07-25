import { memo } from 'react';
import { useScippyStore } from '../../store/useScippyStore';
import type { ScippyActionDef } from './scippyApi';

/**
 * 轻量引擎桥接：将用户输入交给 store 意图匹配与回复生成
 */
export function useScippyEngine() {
  const sendUserText = useScippyStore((s) => s.sendUserText);
  const setMood = useScippyStore((s) => s.setMood);

  const ask = (text: string) => {
    setMood('happy');
    sendUserText(text);
  };

  return { ask };
}

export const ScippyActionButtons = memo(function ScippyActionButtons({
  actions,
  onAction,
}: {
  actions: ScippyActionDef[];
  onAction: (a: ScippyActionDef) => void;
}) {
  if (!actions.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={() => onAction(a)}
          className="scippy-action"
        >
          {a.icon ? `${a.icon} ` : ''}
          {a.label}
        </button>
      ))}
    </div>
  );
});
