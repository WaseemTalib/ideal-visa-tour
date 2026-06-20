DROP TABLE "inquiries" CASCADE;--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "available_from";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "available_to";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "featured";--> statement-breakpoint
DROP TYPE "public"."inquiry_status";--> statement-breakpoint
DROP TYPE "public"."inquiry_type";