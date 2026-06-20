-- Replace package_type enum with category-based values, backfilling from to_location.country.
ALTER TABLE "packages" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
UPDATE "packages" p
SET "type" = CASE
  WHEN LOWER(TRIM(l.country)) IN ('saudi arabia', 'ksa') THEN 'umrah'
  WHEN LOWER(TRIM(l.country)) = 'pakistan' THEN 'northern'
  ELSE 'international'
END
FROM "locations" l
WHERE p."to_location_id" = l.id;--> statement-breakpoint
UPDATE "packages" SET "type" = 'international' WHERE "type" NOT IN ('international', 'northern', 'umrah');--> statement-breakpoint
DROP TYPE "public"."package_type";--> statement-breakpoint
CREATE TYPE "public"."package_type" AS ENUM('international', 'northern', 'umrah');--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "type" SET DATA TYPE "public"."package_type" USING "type"::"public"."package_type";--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "type" SET DEFAULT 'international'::"public"."package_type";
