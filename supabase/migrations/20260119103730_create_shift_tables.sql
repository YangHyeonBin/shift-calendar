-- 1. 근무 타입 테이블
CREATE TABLE shift_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    short_label TEXT NOT NULL,
    color TEXT NOT NULL,
    text_color TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- 2. 스케줄 테이블
CREATE TABLE schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    date DATE NOT NULL,
    -- 등록 시 UTC 기준으로 저장하도록 통일
    shift_type_id UUID REFERENCES shift_types(id) ON DELETE CASCADE NOT NULL,
    naver_event_id TEXT,
    -- 네이버 캘린더 이벤트 ID (NULL이면 미동기화한 스케줄)
    naver_synced_at TIMESTAMPTZ,
    -- 마지막 동기화 시간
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 인덱스
CREATE INDEX idx_shift_types_user ON shift_types(user_id);

CREATE INDEX idx_schedules_user_date ON schedules(user_id, date);

-- RLS 활성화
ALTER TABLE shift_types ENABLE ROW LEVEL SECURITY;

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- shift_types 정책
CREATE POLICY "Users can view own shift_types" ON shift_types FOR
SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shift_types" ON shift_types FOR
INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shift_types" ON shift_types FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shift_types" ON shift_types FOR DELETE USING (auth.uid() = user_id);

-- schedules 정책
CREATE POLICY "Users can view own schedules" ON schedules FOR
SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules" ON schedules FOR
INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" ON schedules FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" ON schedules FOR DELETE USING (auth.uid() = user_id);