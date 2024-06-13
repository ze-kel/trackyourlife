ALTER TABLE "auth_user" RENAME TO "TYL_auth_user";--> statement-breakpoint
ALTER TABLE "trackable" RENAME TO "TYL_trackable";--> statement-breakpoint
ALTER TABLE "trackableRecord" RENAME TO "TYL_trackableRecord";--> statement-breakpoint
ALTER TABLE "user_session" RENAME TO "TYL_user_session";--> statement-breakpoint
ALTER TABLE "TYL_auth_user" DROP CONSTRAINT "auth_user_email_unique";--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" DROP CONSTRAINT "trackableRecord_trackableId_date_unique";--> statement-breakpoint
ALTER TABLE "TYL_trackable" DROP CONSTRAINT "trackable_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" DROP CONSTRAINT "trackableRecord_trackableId_trackable_id_fk";
--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" DROP CONSTRAINT "trackableRecord_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "TYL_user_session" DROP CONSTRAINT "user_session_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" DROP CONSTRAINT "trackableRecord_trackableId_date_pk";--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" ADD CONSTRAINT "TYL_trackableRecord_trackableId_date_pk" PRIMARY KEY("trackableId","date");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TYL_trackable" ADD CONSTRAINT "TYL_trackable_user_id_TYL_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "TYL_auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TYL_trackableRecord" ADD CONSTRAINT "TYL_trackableRecord_trackableId_TYL_trackable_id_fk" FOREIGN KEY ("trackableId") REFERENCES "TYL_trackable"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TYL_trackableRecord" ADD CONSTRAINT "TYL_trackableRecord_user_id_TYL_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "TYL_auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TYL_user_session" ADD CONSTRAINT "TYL_user_session_user_id_TYL_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "TYL_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "TYL_auth_user" ADD CONSTRAINT "TYL_auth_user_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" ADD CONSTRAINT "TYL_trackableRecord_trackableId_date_unique" UNIQUE NULLS NOT DISTINCT("trackableId","date");