ALTER TABLE "profiles" ADD COLUMN "approved_at" timestamp with time zone;
--> statement-breakpoint
UPDATE "profiles" SET "approved_at" = "updated_at" WHERE "status" = true;
