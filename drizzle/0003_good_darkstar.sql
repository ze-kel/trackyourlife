ALTER TABLE "trackableRecord" ADD COLUMN "user_id" varchar(15) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trackableRecord" ADD CONSTRAINT "trackableRecord_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
