ALTER TABLE "artists" ADD COLUMN "username" varchar(30);--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_username_unique" UNIQUE("username");