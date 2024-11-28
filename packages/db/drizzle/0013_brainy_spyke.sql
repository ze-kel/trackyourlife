ALTER TABLE "TYL_trackable" ALTER COLUMN "is_deleted" SET DEFAULT false;--> statement-breakpoint
UPDATE  "TYL_trackable" SET "is_deleted" = false;
ALTER TABLE "TYL_trackable" ALTER COLUMN "is_deleted" SET NOT NULL;