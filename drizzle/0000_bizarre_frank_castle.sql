CREATE TABLE IF NOT EXISTS "artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"soundcloud_url" text,
	CONSTRAINT "artists_soundcloud_url_unique" UNIQUE("soundcloud_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" integer PRIMARY KEY NOT NULL,
	"track_file_url" text,
	"author_id" integer
);
