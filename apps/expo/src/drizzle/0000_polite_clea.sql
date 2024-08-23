CREATE TABLE `trackable` (
	`created` integer DEFAULT (current_timestamp) NOT NULL,
	`updated` integer DEFAULT (current_timestamp) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`settings` text DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE `trackableRecord` (
	`created` integer DEFAULT (current_timestamp) NOT NULL,
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