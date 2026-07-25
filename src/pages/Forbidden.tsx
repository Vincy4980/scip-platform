import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Forbidden() {
  const setLoginModalOpen = useAuthStore((s) => s.setLoginModalOpen);
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="text-5xl font-semibold text-slate-300">403</div>
      <h2 className="mt-4 text-xl font-semibold text-slate-800">
        {currentUser ? '您暂无权限访问此页面' : '请先登录'}
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {currentUser
          ? '当前账号角色无法查看该模块。可在右上角切换至「控制塔总监」查看全部模块（含仓储物流、用户管理），或联系管理员。'
          : '退出登录后需重新选择演示账号。点击下方登录按钮打开登录弹窗。'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {!currentUser && (
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="rounded-lg bg-[#1677FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0E5FD4]"
          >
            打开登录弹窗
          </button>
        )}
        <Link
          to="/my-workspace"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          我的工作台
        </Link>
        <Link
          to="/"
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
