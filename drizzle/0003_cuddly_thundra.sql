ALTER TABLE "trackable" DROP CONSTRAINT "trackable_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "trackableRecord" DROP CONSTRAINT "trackableRecord_trackableId_trackable_id_fk";
--> statement-breakpoint
ALTER TABLE "user_key" DROP CONSTRAINT "user_key_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_session" DROP CONSTRAINT "user_session_user_id_auth_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trackable" ADD CONSTRAINT "trackable_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trackableRecord" ADD CONSTRAINT "trackableRecord_trackableId_trackable_id_fk" FOREIGN KEY ("trackableId") REFERENCES "trackable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_key" ADD CONSTRAINT "user_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
