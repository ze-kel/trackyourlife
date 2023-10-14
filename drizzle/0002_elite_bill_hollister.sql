ALTER TABLE "trackableRecord" DROP CONSTRAINT "trackableRecord_id_trackable_id_fk";
--> statement-breakpoint
ALTER TABLE "trackableRecord" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "trackableRecord" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "trackableRecord" ADD COLUMN "trackableId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trackableRecord" ADD CONSTRAINT "trackableRecord_trackableId_trackable_id_fk" FOREIGN KEY ("trackableId") REFERENCES "trackable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
