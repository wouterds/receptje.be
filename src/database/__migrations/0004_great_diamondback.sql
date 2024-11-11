ALTER TABLE `ai-completions` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `ai-completions` MODIFY COLUMN `prompt` varchar(128) NOT NULL;