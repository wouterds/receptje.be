CREATE TABLE `ai-completions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`prompt` varchar(64) NOT NULL,
	`response` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai-completions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `ai-completions` (`user_id`);--> statement-breakpoint
CREATE INDEX `prompt_idx` ON `ai-completions` (`prompt`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `ai-completions` (`created_at`);