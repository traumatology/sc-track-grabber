DROP TABLE "artists";--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "artist_account_id" integer;--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "author_id";