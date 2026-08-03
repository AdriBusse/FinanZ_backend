# Start development

Start the backend and PostgreSQL together:

```sh
make backend-up
```

The backend is available on port `4000`. The project directory is mounted into
the backend container, and `nodemon` restarts the application when source files
change.
