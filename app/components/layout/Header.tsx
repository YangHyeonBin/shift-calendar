import { useAuth } from "~/providers/AuthProvider";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-gray-900">📅 교대근무 스케줄러</h1>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.user_metadata?.name || "사용자"}</span>
          <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700 underline">
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
