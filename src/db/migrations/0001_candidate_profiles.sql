-- Candidate profiles table
CREATE TABLE IF NOT EXISTS "candidates" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "phone" varchar(50),
  "location" varchar(255),
  "headline" varchar(500),
  "summary" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "candidates_email_unique" UNIQUE("email")
);

-- Work experience table
CREATE TABLE IF NOT EXISTS "work_experience" (
  "id" serial PRIMARY KEY NOT NULL,
  "candidate_id" integer NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
  "company" varchar(255) NOT NULL,
  "title" varchar(255) NOT NULL,
  "location" varchar(255),
  "start_date" varchar(20) NOT NULL,
  "end_date" varchar(20),
  "current" boolean DEFAULT false NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Education table
CREATE TABLE IF NOT EXISTS "education" (
  "id" serial PRIMARY KEY NOT NULL,
  "candidate_id" integer NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
  "institution" varchar(255) NOT NULL,
  "degree" varchar(255) NOT NULL,
  "field_of_study" varchar(255),
  "start_date" varchar(20) NOT NULL,
  "end_date" varchar(20),
  "current" boolean DEFAULT false NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Skill level enum
DO $$ BEGIN
  CREATE TYPE "skill_level" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Skills table
CREATE TABLE IF NOT EXISTS "skills" (
  "id" serial PRIMARY KEY NOT NULL,
  "candidate_id" integer NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
  "name" varchar(255) NOT NULL,
  "level" skill_level DEFAULT 'intermediate' NOT NULL,
  "years_of_experience" smallint,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
