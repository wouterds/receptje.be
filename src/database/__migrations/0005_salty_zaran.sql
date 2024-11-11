CREATE TABLE `recipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`identifier` varchar(128) NOT NULL,
	`name` varchar(128) NOT NULL,
	`portions` int NOT NULL,
	`preparation_time` int NOT NULL,
	`ingredients` json NOT NULL,
	`steps` json NOT NULL,
	`keywords` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `recipes` (`user_id`);--> statement-breakpoint
CREATE INDEX `identifier_idx` ON `recipes` (`identifier`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `recipes` (`created_at`);