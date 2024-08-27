CREATE TABLE `meta` (
	`user` text PRIMARY KEY NOT NULL,
	`updated` integer DEFAULT (current_timestamp) NOT NULL,
	`settings` text
);
--> statement-breakpoint
CREATE TABLE `trackable` (
	`updated` integer DEFAULT (current_timestamp) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`settings` text DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE `trackableRecord` (
	`updated` integer DEFAULT (current_timestamp) NOT NULL,
	`trackableId` text NOT NULL,
	`date` integer DEFAULT (current_timestamp) NOT NULL,
	`value` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`trackableId`, `date`),
	FOREIGN KEY (`trackableId`) REFERENCES `trackable`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `trackableRecord_trackableId_date_unique` ON `trackableRecord` (`trackableId`,`date`);