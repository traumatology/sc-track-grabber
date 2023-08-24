# Soundcloud track grabber

Telegram bot that checks for new songs from specified profiles every minute, saves 
them to supabase bucket and notifies through telegram.

also used drizzle for the first time. queries and filtering looks clean. migrations
are mid, prisma's full-cli approach is more comfortable than use drizzle-kit to generate migration 
and then execute typescript to apply it (ik it could be automated, but i would prefer instant migration 
option by default). 

worth adding that drizzle-kit has some problems with .js imports in typescript code. my project wont
compile if i remove .js extensions, so i need to compile to javascript and generate migration 
from it. perhaps thats intended behavior i don t know. 

drizzle is awesome tool anyways