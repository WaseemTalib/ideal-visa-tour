ALTER TABLE "profiles" ADD COLUMN "status" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
UPDATE "profiles" SET "status" = true WHERE "role" = 'admin';
