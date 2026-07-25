import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

export default function MarketplaceAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useMarketplaceStore((s) => s.login);
  const registerComplete = useMarketplaceStore((s) => s.registerComplete);
  const isRegisterPath =
    location.pathname.endsWith('/register') ||
    new URLSearchParams(location.search).get('mode') === 'register';
  const [mode, setMode] = useState<'login' | 'register'>(
    isRegisterPath ? 'register' : 'login',
  );
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setMode(isRegisterPath ? 'register' : 'login');
  }, [isRegisterPath]);

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError('');
    setStep(0);
    navigate(m === 'register' ? '/marketplace/auth/register' : '/marketplace/auth', {
      replace: true,
    });
  };

  const onLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');
    if (!email || !password) {
      setError('请填写账号和密码');
      return;
    }
    login(email, password);
    if (remember) localStorage.setItem('scip-marketplace-remember', email);
    navigate('/marketplace/account');
  };

  const finishRegister = () => {
    registerComplete();
    navigate('/marketplace/account');
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <div className="mp-logo text-2xl">SCIP Marketplace</div>
        <p className="mt-1 text-sm text-[var(--mp-muted)]">下游客户采购门户</p>
      </div>

      <div className="mp-card p-6">
        <div className="mb-4 flex rounded-xl bg-[#FAF8F6] p-1">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                mode === m
                  ? 'bg-white text-[var(--mp-orange-deep)] shadow-sm'
                  : 'text-[var(--mp-muted)]'
              }`}
            >
              {m === 'login' ? '登录' : '注册'}
            </button>
          ))}
        </div>

        {mode === 'login' ? (
          <form onSubmit={onLogin} className="space-y-3">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <label className="block text-xs text-[var(--mp-muted)]">
              账号 / 邮箱
              <input
                name="email"
                type="email"
                defaultValue="linxiao@huanan-precision.com"
                className="mp-input mt-1"
                required
              />
            </label>
            <label className="block text-xs text-[var(--mp-muted)]">
              密码
              <input
                name="password"
                type="password"
                defaultValue="demo1234"
                className="mp-input mt-1"
                required
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--mp-muted)]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[#FF7D29]"
              />
              记住账号
            </label>
            <button type="submit" className="mp-btn-primary w-full">
              登录
            </button>
            <p className="text-center text-xs text-[var(--mp-muted)]">
              演示账号可直接登录 ·{' '}
              <button
                type="button"
                className="text-[var(--mp-orange)]"
                onClick={() => switchMode('register')}
              >
                注册新企业
              </button>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-1">
              {['企业信息', '资质上传', '设置密码', '提交审核'].map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 rounded-full py-1 text-center text-[10px] ${
                    i <= step
                      ? 'bg-[var(--mp-orange-soft)] text-[var(--mp-orange-deep)]'
                      : 'bg-[#FAF8F6] text-[var(--mp-muted)]'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-3">
                <Field label="企业名称" defaultValue="华南精密制造有限公司" />
                <Field label="统一社会信用代码" defaultValue="91440300MA5FXXXX0X" />
                <Field label="联系人" defaultValue="林晓" />
                <Field label="手机号" defaultValue="13800138000" />
              </div>
            )}
            {step === 1 && (
              <div className="space-y-3 text-sm text-[var(--mp-muted)]">
                <p>请上传营业执照、危化品经营许可证（演示可跳过）。</p>
                <label className="mp-btn-ghost inline-flex cursor-pointer !text-xs">
                  选择文件
                  <input type="file" className="hidden" />
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <Field label="登录邮箱" type="email" defaultValue="linxiao@huanan-precision.com" />
                <Field label="设置密码" type="password" defaultValue="demo1234" />
                <Field label="确认密码" type="password" defaultValue="demo1234" />
              </div>
            )}
            {step === 3 && (
              <div className="rounded-xl bg-[var(--mp-orange-soft)] p-4 text-sm text-[var(--mp-orange-deep)]">
                资料已填妥。提交后进入人工审核（演示将直接开通账号）。
              </div>
            )}

            <div className="flex justify-between gap-2">
              <button
                type="button"
                className="mp-btn-ghost !text-xs"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                上一步
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  className="mp-btn-primary !text-xs"
                  onClick={() => setStep((s) => s + 1)}
                >
                  下一步
                </button>
              ) : (
                <button type="button" className="mp-btn-primary !text-xs" onClick={finishRegister}>
                  提交审核
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-[var(--mp-muted)]">
        <Link to="/marketplace" className="text-[var(--mp-orange)]">
          返回商城首页
        </Link>
        {' · '}
        <Link to="/" className="hover:underline">
          SCIP 内部平台
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  defaultValue,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-xs text-[var(--mp-muted)]">
      {label}
      <input type={type} defaultValue={defaultValue} className="mp-input mt-1" />
    </label>
  );
}
