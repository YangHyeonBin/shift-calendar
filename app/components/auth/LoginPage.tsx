const LoginPage = () => {
  const handleNaverLogin = () => {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const state = crypto.randomUUID();

    // CSRF 방지
    sessionStorage.setItem("naver_oauth_state", state);

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    window.location.href = naverAuthUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* 로고, 서비스명 */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">📅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">교대근무 스케줄러</h1>
        <p className="text-gray-600">터치 한 번으로 간편하게 근무 일정 관리</p>
      </div>

      {/* 네이버 로그인 버튼 */}
      <button onClick={handleNaverLogin}>
        <img src="/images/naver_login_btn.png" alt="네이버 아이디로 로그인" className="h-12" />
      </button>

      {/* 안내 문구 */}
      <p className="mt-8 text-sm text-gray-500 text-center">
        로그인하면 네이버 캘린더에
        <br />
        근무 일정을 동기화할 수 있어요!
      </p>
    </div>
  );
};

const NaverIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.5 10.5L6.2 0H0v20h6.5V9.5L13.8 20H20V0h-6.5v10.5z" />
    </svg>
  );
};

export default LoginPage;
