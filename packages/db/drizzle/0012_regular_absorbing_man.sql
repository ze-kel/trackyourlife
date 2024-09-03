ALTER TABLE "TYL_trackable" ADD COLUMN "is_deleted" boolean;--> statement-breakpoint
ALTER TABLE "TYL_trackable" DROP COLUMN IF EXISTS "deleted";