ALTER TABLE "user_session" DROP CONSTRAINT "user_session_user_id_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "auth_user" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "trackable" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "trackableRecord" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_key" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_session" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_session" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "hashed_password" varchar;--> statement-breakpoint
ALTER TABLE "user_session" ADD COLUMN "expires_at" timestamp with time zone;--> statement-breakpoint
UPDATE user_session SET expires_at = to_timestamp(idle_expires / 1000);
ALTER TABLE "user_session" ALTER COLUMN expires_at SET NOT NULL;
DO $$ BEGIN
 ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
START TRANSACTION;
UPDATE auth_user SET hashed_password = user_key.hashed_password FROM user_key
WHERE user_key.user_id = auth_user.id
AND user_key.hashed_password IS NOT NULL;
ALTER TABLE auth_user ALTER COLUMN hashed_password SET NOT NULL;
COMMIT;
ALTER TABLE "user_key" DROP COLUMN IF EXISTS "hashed_password";--> statement-breakpoint
ALTER TABLE "user_session" DROP COLUMN IF EXISTS "active_expires";--> statement-breakpoint
ALTER TABLE "user_session" DROP COLUMN IF EXISTS "idle_expires";