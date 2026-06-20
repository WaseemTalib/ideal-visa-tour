ALTER TABLE "packages" ADD COLUMN "from_location" text;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "to_location" text;--> statement-breakpoint
-- Backfill text columns from joined location names before the FK columns are dropped in 0007.
UPDATE "packages" p
SET "from_location" = l.name
FROM "locations" l
WHERE p."from_location_id" = l.id;--> statement-breakpoint
UPDATE "packages" p
SET "to_location" = l.name
FROM "locations" l
WHERE p."to_location_id" = l.id;
