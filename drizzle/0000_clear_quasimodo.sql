CREATE TABLE `practiceAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`practiceSlug` varchar(64) NOT NULL,
	`practiceTitle` varchar(255) NOT NULL,
	`contentVersion` varchar(64) NOT NULL,
	`questionCount` int NOT NULL,
	`firstTryCorrectCount` int NOT NULL DEFAULT 0,
	`completedCount` int NOT NULL DEFAULT 0,
	`totalResponseCount` int NOT NULL DEFAULT 0,
	`status` enum('in_progress','completed','discarded') NOT NULL DEFAULT 'in_progress',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `practiceAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practiceResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attemptId` int NOT NULL,
	`termId` varchar(64) NOT NULL,
	`selectedIndex` int NOT NULL,
	`isCorrect` boolean NOT NULL,
	`sequenceNo` int NOT NULL,
	`answeredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `practiceResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `practiceAttempts` ADD CONSTRAINT `practiceAttempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `practiceResponses` ADD CONSTRAINT `practiceResponses_attemptId_practiceAttempts_id_fk` FOREIGN KEY (`attemptId`) REFERENCES `practiceAttempts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `practiceAttempts_user_started_idx` ON `practiceAttempts` (`userId`,`startedAt`);--> statement-breakpoint
CREATE INDEX `practiceAttempts_status_idx` ON `practiceAttempts` (`status`);--> statement-breakpoint
CREATE INDEX `practiceResponses_attempt_sequence_idx` ON `practiceResponses` (`attemptId`,`sequenceNo`);--> statement-breakpoint
CREATE INDEX `practiceResponses_attempt_term_idx` ON `practiceResponses` (`attemptId`,`termId`);