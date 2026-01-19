import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirectUri } = await req.json();

    const clientId = Deno.env.get("NAVER_CLIENT_ID");
    const clientSecret = Deno.env.get("NAVER_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error("Missing Naver credentials");
    }

    // 1. 네이버에서 토큰 교환
    const tokenResponse = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || "Token exchange failed");
    }

    // 2. 네이버 사용자 정보 가져오기
    const userResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (userData.resultcode !== "00") {
      throw new Error("Failed to get user info");
    }

    const naverUser = userData.response;

    // 3. Supabase에 사용자 저장/업데이트
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // auth.users에 사용자 생성 또는 조회
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `naver_${naverUser.id}@naver.local`,
      email_confirm: true,
      user_metadata: {
        provider: "naver",
        naver_id: naverUser.id,
        name: naverUser.name,
        profile_image: naverUser.profile_image,
      },
    });

    let userId: string;

    if (authError?.message?.includes("already been registered")) {
      // 이미 존재하는 사용자 조회
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(
        (u) => u.user_metadata?.naver_id === naverUser.id
      );
      userId = existingUser!.id;
    } else if (authError) {
      throw authError;
    } else {
      userId = authData.user!.id;

      // 새 사용자면 기본 shift_types 생성
      // await supabase.from("shift_types").insert([
      //   { user_id: userId, name: "Day", short_label: "D", color: "#FBBF24", text_color: "#111827", display_order: 1 },
      //   { user_id: userId, name: "Swing", short_label: "S", color: "#F97316", text_color: "#FFFFFF", display_order: 2 },
      //   { user_id: userId, name: "GY", short_label: "G", color: "#4F46E5", text_color: "#FFFFFF", display_order: 3 },
      //   { user_id: userId, name: "휴무", short_label: "휴", color: "#D1D5DB", text_color: "#4B5563", display_order: 4 },
      // ]);
    }

    // 4. 세션 토큰 생성
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: `naver_${naverUser.id}@naver.local`,
    });

    if (sessionError) {
      throw sessionError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userId,
          name: naverUser.name,
          profile_image: naverUser.profile_image,
        },
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        hashed_token: sessionData.properties?.hashed_token,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error 
    ? error.message 
    : "Unknown error occurred";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },

      }
    );
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/naver-auth' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
