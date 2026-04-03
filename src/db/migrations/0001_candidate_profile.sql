-- Migration: 0001_candidate_profile
-- Creates all tables required for the candidate profile feature:
--   candidates, work_experiences, educations, hobbies
-- and the two supporting enums: marital_status, education_status.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE "marital_status" AS ENUM (
    'single',
    'married',
    'divorced',
    'widowed',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "education_status" AS ENUM (
    'in_progress',
    'completed',
    'dropped'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- candidates
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "candidates" (
  "id"             serial PRIMARY KEY NOT NULL,

  -- Personal info
  "first_name"     varchar(100)      NOT NULL,
  "last_name"      varchar(100)      NOT NULL,
  "age"            integer,
  "dni"            varchar(20)       UNIQUE,
  "nationality"    varchar(100),
  "marital_status" "marital_status",

  -- Contact info
  "address"        text,
  "phone"          varchar(30),
  "email"          varchar(255)      NOT NULL,
  "linkedin"       varchar(255),

  -- Professional summary
  "summary"        text,

  "created_at"     timestamp         DEFAULT now() NOT NULL,
  "updated_at"     timestamp         DEFAULT now() NOT NULL,

  CONSTRAINT "candidates_email_unique" UNIQUE ("email")
);

-- ---------------------------------------------------------------------------
-- work_experiences
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "work_experiences" (
  "id"           serial PRIMARY KEY NOT NULL,
  "candidate_id" integer            NOT NULL
                   REFERENCES "candidates" ("id") ON DELETE CASCADE,

  "company"      varchar(255)       NOT NULL,
  "role"         varchar(255)       NOT NULL,
  -- Month-precision dates stored as YYYY-MM text to avoid timezone issues.
  "start_date"   varchar(7)         NOT NULL,
  "end_date"     varchar(7),        -- NULL means current / ongoing position
  "description"  text,

  "created_at"   timestamp          DEFAULT now() NOT NULL,
  "updated_at"   timestamp          DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "work_experiences_candidate_id_idx"
  ON "work_experiences" ("candidate_id");

-- ---------------------------------------------------------------------------
-- educations
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "educations" (
  "id"           serial PRIMARY KEY NOT NULL,
  "candidate_id" integer            NOT NULL
                   REFERENCES "candidates" ("id") ON DELETE CASCADE,

  "university"   varchar(255)       NOT NULL,
  "degree"       varchar(255)       NOT NULL,
  "status"       "education_status" NOT NULL,

  "created_at"   timestamp          DEFAULT now() NOT NULL,
  "updated_at"   timestamp          DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "educations_candidate_id_idx"
  ON "educations" ("candidate_id");

-- ---------------------------------------------------------------------------
-- hobbies
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "hobbies" (
  "id"           serial PRIMARY KEY NOT NULL,
  "candidate_id" integer            NOT NULL
                   REFERENCES "candidates" ("id") ON DELETE CASCADE,

  "hobby"        varchar(100)       NOT NULL
);

CREATE INDEX IF NOT EXISTS "hobbies_candidate_id_idx"
  ON "hobbies" ("candidate_id");
