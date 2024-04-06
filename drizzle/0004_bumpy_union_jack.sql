-- Dropping all variations, because codegen tries to drop trackableRecord_trackableId_date while supabase has trackablerecord_trackableid_date. No idea how that happened
ALTER TABLE "trackableRecord" DROP CONSTRAINT if exists "trackableRecord_trackableId_date";--> statement-breakpoint
ALTER TABLE "trackableRecord" DROP CONSTRAINT if exists "trackablerecord_trackableid_date";--> statement-breakpoint
ALTER TABLE "trackableRecord" ADD CONSTRAINT "trackableRecord_trackableId_date_pk" PRIMARY KEY("trackableId","date");--> statement-breakpoint
ALTER TABLE "trackable" ADD COLUMN "name" varchar;--> statement-breakpoint
ALTER TABLE "trackableRecord" ADD CONSTRAINT "trackableRecord_trackableId_date_unique" UNIQUE NULLS NOT DISTINCT("trackableId","date");