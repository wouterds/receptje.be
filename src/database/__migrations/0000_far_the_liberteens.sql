CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`fingerprint` varchar(32) NOT NULL,
	`first_name` varchar(64) NOT NULL,
	`last_name` varchar(64) NOT NULL,
	`email` varchar(128) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `fingerprint_idx` ON `users` (`fingerprint`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `users` (`created_at`);