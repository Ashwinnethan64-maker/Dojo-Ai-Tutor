-- ==============================================================================
-- DOJO AI: Complete Production PostgreSQL Schema & Migrations
-- Target: Supabase / PostgreSQL
-- ==============================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE belt_tier AS ENUM ('white', 'yellow', 'orange', 'green', 'blue', 'purple', 'brown', 'black');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE workout_difficulty AS ENUM ('intro', 'easy', 'medium', 'hard', 'master');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE execution_status AS ENUM ('pending', 'passed', 'failed', 'runtime_error', 'compile_error', 'time_limit_exceeded', 'memory_limit_exceeded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mistake_category AS ENUM (
      'syntax_error', 'runtime_error', 'type_error', 'logic_error', 
      'conceptual_error', 'algorithm_error', 'off_by_one', 'condition_error', 
      'loop_error', 'function_error', 'scope_error', 'data_structure_error', 
      'api_usage_error', 'complexity_error', 'debugging_behavior', 'style_issue', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE flashcard_state AS ENUM ('new', 'learning', 'review', 'relearning');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    current_language_id TEXT NOT NULL DEFAULT 'python',
    current_belt belt_tier NOT NULL DEFAULT 'white',
    xp INT NOT NULL DEFAULT 0,
    streak_count INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. LANGUAGES & VERSIONS
CREATE TABLE IF NOT EXISTS public.languages (
    id TEXT PRIMARY KEY, -- 'python', 'javascript', 'cpp', etc.
    name TEXT NOT NULL,
    monaco_id TEXT NOT NULL,
    judge0_id INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.language_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id TEXT NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
    version_name TEXT NOT NULL,
    judge0_version_id INT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LEARNING PATHS, TOPICS & CONCEPTS
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id TEXT NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(language_id, slug)
);

CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id TEXT NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE SET NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    belt_tier belt_tier NOT NULL DEFAULT 'white',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(language_id, slug)
);

CREATE TABLE IF NOT EXISTS public.concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    prerequisites UUID[] DEFAULT '{}',
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(topic_id, slug)
);

-- 5. LESSONS, WORKOUTS & TEST CASES
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(concept_id, slug)
);

CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    language_id TEXT NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    learning_objective TEXT NOT NULL,
    difficulty workout_difficulty NOT NULL DEFAULT 'easy',
    starter_code TEXT NOT NULL,
    solution_code TEXT NOT NULL,
    instructions TEXT NOT NULL,
    order_index INT NOT NULL,
    is_targeted_challenge BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(language_id, slug)
);

CREATE TABLE IF NOT EXISTS public.test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
    stdin TEXT NOT NULL DEFAULT '',
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ATTEMPTS & EXECUTIONS
CREATE TABLE IF NOT EXISTS public.attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    status execution_status NOT NULL DEFAULT 'pending',
    passed_tests INT NOT NULL DEFAULT 0,
    total_tests INT NOT NULL DEFAULT 0,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    hints_revealed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES public.attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    language_id TEXT NOT NULL REFERENCES public.languages(id),
    source_code TEXT NOT NULL,
    status execution_status NOT NULL,
    stdout TEXT,
    stderr TEXT,
    compile_output TEXT,
    execution_time_ms INT,
    memory_used_kb INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MISTAKE MEMORY & DIAGNOSTICS
CREATE TABLE IF NOT EXISTS public.mistakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    category mistake_category NOT NULL,
    fingerprint TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    occurrences INT NOT NULL DEFAULT 1,
    severity INT NOT NULL DEFAULT 1 CHECK (severity BETWEEN 1 AND 5),
    last_occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(user_id, fingerprint)
);

CREATE TABLE IF NOT EXISTS public.mistake_occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mistake_id UUID NOT NULL REFERENCES public.mistakes(id) ON DELETE CASCADE,
    attempt_id UUID REFERENCES public.attempts(id) ON DELETE SET NULL,
    code_snippet TEXT NOT NULL,
    error_message TEXT,
    ai_explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SPACED REPETITION FLASHCARDS (FSRS Algorithm)
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    source_mistake_id UUID REFERENCES public.mistakes(id) ON DELETE SET NULL,
    front_question TEXT NOT NULL,
    back_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    code_context TEXT,
    state flashcard_state NOT NULL DEFAULT 'new',
    difficulty FLOAT NOT NULL DEFAULT 5.0,
    stability FLOAT NOT NULL DEFAULT 0.0,
    retrievability FLOAT NOT NULL DEFAULT 1.0,
    reps INT NOT NULL DEFAULT 0,
    lapses INT NOT NULL DEFAULT 0,
    due_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 4),
    review_duration_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MASTERY, RECOMMENDATIONS, STREAKS, ACHIEVEMENTS, XP, AI LOGS
CREATE TABLE IF NOT EXISTS public.concept_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    mastery_score FLOAT NOT NULL DEFAULT 0.0 CHECK (mastery_score BETWEEN 0.0 AND 100.0),
    successful_attempts INT NOT NULL DEFAULT 0,
    failed_attempts INT NOT NULL DEFAULT 0,
    total_time_seconds INT NOT NULL DEFAULT 0,
    last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, concept_id)
);

CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES public.concepts(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority INT NOT NULL DEFAULT 1,
    is_dismissed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    workouts_completed INT NOT NULL DEFAULT 0,
    flashcards_reviewed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    xp_reward INT NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.xp_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
    agent_type TEXT NOT NULL,
    prompt_tokens INT,
    completion_tokens INT,
    request_payload JSONB NOT NULL,
    response_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_topics_language_id ON public.topics(language_id);
CREATE INDEX IF NOT EXISTS idx_concepts_topic_id ON public.concepts(topic_id);
CREATE INDEX IF NOT EXISTS idx_workouts_concept_id ON public.workouts(concept_id);
CREATE INDEX IF NOT EXISTS idx_workouts_language_id ON public.workouts(language_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_workout_id ON public.test_cases(workout_id);

CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON public.attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_workout_id ON public.attempts(workout_id);
CREATE INDEX IF NOT EXISTS idx_attempts_created_at ON public.attempts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_executions_user_id ON public.executions(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_attempt_id ON public.executions(attempt_id);

CREATE INDEX IF NOT EXISTS idx_mistakes_user_id ON public.mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_concept_id ON public.mistakes(concept_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_occurrences ON public.mistakes(occurrences DESC);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON public.flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_due_date ON public.flashcards(user_id, due_date ASC);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_user_id ON public.flashcard_reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_concept_mastery_user_id ON public.concept_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_concept_mastery_score ON public.concept_mastery(user_id, mastery_score ASC);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations(user_id, is_dismissed);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_xp_events_user_id ON public.xp_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id, created_at DESC);

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistake_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Public/Read-Only Curriculum Tables
CREATE POLICY "Curriculum languages are readable by all authenticated users"
  ON public.languages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Curriculum language_versions are readable by all authenticated users"
  ON public.language_versions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Curriculum learning_paths are readable by all authenticated users"
  ON public.learning_paths FOR SELECT TO authenticated USING (true);

CREATE POLICY "Curriculum topics are readable by all authenticated users"
  ON public.topics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Curriculum concepts are readable by all authenticated users"
  ON public.concepts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Curriculum lessons are readable by all authenticated users"
  ON public.lessons FOR SELECT TO authenticated USING (true);

CREATE POLICY "Curriculum workouts are readable by all authenticated users"
  ON public.workouts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Curriculum test_cases are readable by all authenticated users"
  ON public.test_cases FOR SELECT TO authenticated USING (true);

CREATE POLICY "Achievements are readable by all authenticated users"
  ON public.achievements FOR SELECT TO authenticated USING (true);

-- User-Isolated Tables (Strict auth.uid() = user_id enforcement)
CREATE POLICY "Users can read and update own profile"
  ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own attempts"
  ON public.attempts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own executions"
  ON public.executions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own mistakes"
  ON public.mistakes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own mistake occurrences"
  ON public.mistake_occurrences FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.mistakes WHERE mistakes.id = mistake_occurrences.mistake_id AND mistakes.user_id = auth.uid()));

CREATE POLICY "Users can manage own flashcards"
  ON public.flashcards FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own flashcard reviews"
  ON public.flashcard_reviews FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own concept mastery"
  ON public.concept_mastery FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own recommendations"
  ON public.recommendations FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks"
  ON public.streaks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own user_achievements"
  ON public.user_achievements FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own xp_events"
  ON public.xp_events FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ai_interactions"
  ON public.ai_interactions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 12. INITIAL SEED DATA FOR SUPPORTED LANGUAGES
-- ==============================================================================
INSERT INTO public.languages (id, name, monaco_id, judge0_id, is_active) VALUES
('python', 'Python', 'python', 71, true),
('c', 'C', 'c', 50, false),
('cpp', 'C++', 'cpp', 54, false),
('java', 'Java', 'java', 62, false),
('javascript', 'JavaScript', 'javascript', 63, false),
('typescript', 'TypeScript', 'typescript', 74, false),
('go', 'Go', 'go', 60, false),
('rust', 'Rust', 'rust', 73, false),
('csharp', 'C#', 'csharp', 51, false),
('sql', 'SQL', 'sql', 82, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  monaco_id = EXCLUDED.monaco_id,
  judge0_id = EXCLUDED.judge0_id,
  is_active = EXCLUDED.is_active;

-- Trigger to auto-create profile on Supabase auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
