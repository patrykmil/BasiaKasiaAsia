# basia_kasia_asia

Forum project with Node.js + Express backend, React frontend, and SQLite database.

## Azure hosting

- Azure Terraform and deploy scripts are in `azure/`
- This setup hosts both frontend and backend in Azure App Service

Deployment steps:
1. Install Azure CLI and Terraform
2. Configure Azure credentials
3. Update `azure/terraform.tfvars.example` to `azure/terraform.tfvars` with your Azure subscription details
4. Run `terraform init`, `terraform apply --auto-approve` and `./azure/update-app.sh` to deploy the app

## Local setup

- backend env file: copy `backend/.env.example` to `backend/.env`
- frontend env file: copy `frontend/.env.example` to `frontend/.env`
- SQLite path can be changed using `DB_PATH`

## Services

- backend API: `backend/`
- frontend app: `frontend/`