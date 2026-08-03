# Start development

Start the backend and PostgreSQL together:

```sh
make backend-up
```

The backend is available on port `4000`. The project directory is mounted into
the backend container, and `nodemon` restarts the application when source files
change.

## Google authentication

Set `GOOGLE_WEB_CLIENT_ID` to the web OAuth client ID also configured in the
mobile app. Deploy schema changes with migrations; automatic schema
synchronization is disabled:

```sh
npm run migration:run
```

Deploy the migration and backend before releasing a Google-enabled app build.
