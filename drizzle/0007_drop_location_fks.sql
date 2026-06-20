ALTER TABLE "packages" DROP CONSTRAINT "packages_from_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "packages" DROP CONSTRAINT "packages_to_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "from_location_id";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "to_location_id";