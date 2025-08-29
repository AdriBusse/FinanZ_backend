Here’s a quick, copy-pasteable way to “log in” to a Postgres running in Docker and drop a database safely.

⸻

0) Set variables (adjust to your setup)

CONTAINER=my-postgres         # your container name (see: docker ps)
DB=mydb                       # the database you want to drop
USER=postgres                 # DB superuser (often 'postgres')

You can replace docker exec -it $CONTAINER … with docker compose exec <service> … if you use Compose.

⸻

1) Open psql (login)

docker exec -it $CONTAINER psql -U $USER -d postgres

Inside psql you can list DBs:

\l

Quit with \q.

⸻

2) Drop the database (handles active connections)

You cannot drop the DB you’re currently connected to. Always connect to another DB (e.g., postgres) to issue the drop.

One-liner (no interactive shell):

# Block new connects + kill existing connections
docker exec -it $CONTAINER psql -U $USER -d postgres -c "
  REVOKE CONNECT ON DATABASE \"$DB\" FROM PUBLIC;
  ALTER DATABASE \"$DB\" WITH ALLOW_CONNECTIONS false;
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = '$DB' AND pid <> pg_backend_pid();
"

# Drop it
docker exec -it $CONTAINER dropdb -U $USER "$DB"
# or: docker exec -it $CONTAINER psql -U $USER -d postgres -c "DROP DATABASE \"$DB\";"

Result check:

docker exec -it $CONTAINER psql -U $USER -d postgres -c "\l"


⸻

Notes & gotchas
	•	Don’t try to drop template0, template1, or (usually) postgres—those are system DBs.
	•	If your container requires a password, ensure POSTGRES_PASSWORD was set when you started it; psql will prompt or you can export PGPASSWORD=... before the commands.
	•	If you actually want to nuke everything (the whole cluster), delete the data volume instead of dropping DBs:

docker stop $CONTAINER && docker rm $CONTAINER
docker volume ls             # find the volume (if you used a named volume)
docker volume rm <volume>    # or rm -rf the bind-mounted host directory
# then start a fresh container; Postgres will init a brand-new empty cluster



If you share your docker ps line (name/ports) and the DB name you want to remove, I’ll rewrite the exact two commands for your setup.


Do you mean a database named finanz (so you can restore into it), or a table named finanz? Here are both:

Create an empty database finanz

# set your container + user (adjust)
CONTAINER=<your-postgres-container>
USER=postgres

# create the DB
docker exec -it $CONTAINER createdb -U $USER finanz

# verify
docker exec -it $CONTAINER psql -U $USER -d postgres -c "\l finanz"

If it already exists and you want a clean one:

DB=finanz
docker exec -it $CONTAINER psql -U $USER -d postgres -c "
  REVOKE CONNECT ON DATABASE \"$DB\" FROM PUBLIC;
  ALTER DATABASE \"$DB\" WITH ALLOW_CONNECTIONS false;
  SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB';
"
docker exec -it $CONTAINER dropdb  -U $USER "$DB"
docker exec -it $CONTAINER createdb -U $USER "$DB"

Create an empty table finanz (in some database)

Postgres tables must have at least one column in practice. A minimal skeleton:

# create the table in database 'yourdb'
docker exec -it $CONTAINER psql -U $USER -d yourdb -c \
"CREATE TABLE IF NOT EXISTS public.finanz (
   id BIGSERIAL PRIMARY KEY
);"

# check
docker exec -it $CONTAINER psql -U $USER -d yourdb -c "\d public.finanz"

Replace <your-postgres-container> and yourdb with your actual names. If you really want a zero-column table, Postgres allows it (CREATE TABLE public.finanz ();), but most ORMs/tools don’t handle that well—better to include at least a primary key.