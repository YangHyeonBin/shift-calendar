import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "~/utils/supabase";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      //   네이버에서 에러를 리턴한 경우
      if (errorParam) {
        setError("네이버 로그인이 취소되었습니다.");
        return;
      }

      if (!code) {
        setError("인증 코드가 없습니다.");
        return;
      }

      if (!state) {
        console.warn("State가 없습니다!");
        return;
      }

      try {
        // 1. Edge Function 호출
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/naver-auth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code,
              redirectUri: `${window.location.origin}/auth/callback`,
            }),
          }
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "로그인에 실패했습니다.");
        }

        // 2. Supabase 세션 생성
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: data.hashed_token,
          type: "magiclink",
        });

        if (verifyError) {
          throw verifyError;
        }

        // 3. 리다이렉션
        navigate("/", { replace: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        setError(message);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">로그인 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
