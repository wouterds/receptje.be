ALTER TABLE `ai-completions` MODIFY COLUMN `id` BINARY(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `ai-completions` MODIFY COLUMN `user_id` BINARY(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `id` BINARY(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `user_id` BINARY(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` BINARY(16) NOT NULL;