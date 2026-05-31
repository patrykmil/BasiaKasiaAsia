# basia_kasia_asia

Forum project with Node.js + Express backend, React frontend, and SQLite database.

## Azure hosting

- Azure Terraform and deploy scripts are in `azure/`
- This setup hosts both frontend and backend in Azure App Service
- Backend SQLite database is stored at `/home/data/database.db` on App Service persistent storage

See deployment steps in `azure/README.md`.

## Local setup

- backend env file: copy `backend/.env.example` to `backend/.env`
- frontend env file: copy `frontend/.env.example` to `frontend/.env`
- SQLite path can be changed using `DB_PATH`

## Services

- backend API: `backend/`
- frontend app: `frontend/`
