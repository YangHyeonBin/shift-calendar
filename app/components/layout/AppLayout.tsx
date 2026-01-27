import type { ReactNode } from "react";

import ShiftSelector from "../calendar/ShiftSelector";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-4 pb-24">{children}</main>

      {/* 하단 근무 선택 버튼 영역 (나중에 구현) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <ShiftSelector />
      </nav>
    </div>
  );
}
