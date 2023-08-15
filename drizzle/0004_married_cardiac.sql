CREATE TABLE IF NOT EXISTS "artists" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "artist_id" integer;--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "artist_account_id";