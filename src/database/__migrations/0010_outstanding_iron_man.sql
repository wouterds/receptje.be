ALTER TABLE `ai-completions` ADD `recipe_id` BINARY(16);--> statement-breakpoint
CREATE INDEX `recipe_id_idx` ON `ai-completions` (`recipe_id`);