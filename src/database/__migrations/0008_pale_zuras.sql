ALTER TABLE `recipes` ADD `deleted_at` timestamp;--> statement-breakpoint
CREATE INDEX `deleted_at_idx` ON `recipes` (`deleted_at`);