ALTER TABLE "TYL_trackable" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "TYL_trackable" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "TYL_trackable" ADD COLUMN "updated" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "TYL_trackableRecord" ADD COLUMN "updated" timestamp DEFAULT now();