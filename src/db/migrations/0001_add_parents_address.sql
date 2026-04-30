ALTER TABLE "users"
  ADD COLUMN "parents_address_street" varchar(255) NOT NULL DEFAULT '',
  ADD COLUMN "parents_address_city" varchar(100) NOT NULL DEFAULT '',
  ADD COLUMN "parents_address_state" varchar(100) NOT NULL DEFAULT '',
  ADD COLUMN "parents_address_zip" varchar(20) NOT NULL DEFAULT '',
  ADD COLUMN "parents_address_country" varchar(100) NOT NULL DEFAULT '';
