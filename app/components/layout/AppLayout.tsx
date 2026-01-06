import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white shadow-sm px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Shift Calendar</h1>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-4 pb-24">{children}</main>

      {/* 하단 근무 선택 버튼 영역 (나중에 구현) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex justify-center gap-3">
          {/* ShiftSelector 컴포넌트가 들어갈 자리 */}
          <span className="text-gray-400 text-sm">근무 선택 버튼 영역</span>
        </div>
      </nav>
    </div>
  );
}
