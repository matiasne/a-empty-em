CREATE TYPE "user_role" AS ENUM ('admin', 'moderator', 'user');

ALTER TABLE "users" ADD COLUMN "role" "user_role" NOT NULL DEFAULT 'user';
