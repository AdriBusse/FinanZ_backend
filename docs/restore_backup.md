Here’s a quick, copy-pasteable way to “log in” to a Postgres running in Docker and drop a database safely.


0) Set variables (adjust to your setup)

CONTAINER=my-postgres         # your container name/id (see: docker ps)
DB=mydb                       # the database you want to drop
USER=postgres                 # DB superuser (often 'postgres')

1) create backup manually
```
  docker exec $CONTAINER pg_dump -U $USER $DB | gzip --stdout > dump.sql.gz
```


2) Drop the database (handles active connections)
```
  docker exec -it $CONTAINER dropdb -U $USER "$DB"
``` 

3) Create new db
```
  docker exec -it $CONTAINER createdb -U $USER $DB
```

4) Load dump
```
  docker exec -i $CONTAINER psql -U $USER -d $DB < dump.sql
```

4.1) Load dump when relation settet (not testet yet)
```
	docker exec -i $CONTAINER pg_restore -U $USER -C -f dump.sql

```
