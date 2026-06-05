<p align="center">
  <img src="frontend/src/assets/img/Logo-mini.png" alt="Logo Basia Kasia Asia" width="110" />
</p>

<h1 align="center">Basia Kasia Asia</h1>

<p align="center">
  Pełnostackowe forum społecznościowe z Reactem, Expressem, SQLite,
  uwierzytelnianiem JWT, narzędziami administracyjnymi i infrastrukturą
  wdrożeniową dla Azure.
</p>

<p align="center">
  <a href="frontend/package.json"><img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111" /></a>
  <a href="frontend/package.json"><img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" /></a>
  <a href="backend/package.json"><img alt="Express" src="https://img.shields.io/badge/Express-5-111?logo=express&logoColor=white" /></a>
  <a href="backend/package.json"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" /></a>
  <a href="backend/package.json"><img alt="SQLite" src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white" /></a>
  <a href="azure/main.tf"><img alt="Azure App Service" src="https://img.shields.io/badge/Azure-App%20Service-0078D4?logo=microsoftazure&logoColor=white" /></a>
  <a href="azure/main.tf"><img alt="Terraform" src="https://img.shields.io/badge/Terraform-ready-844FBA?logo=terraform&logoColor=white" /></a>
  <a href="backend/package.json"><img alt="Licencja" src="https://img.shields.io/badge/licencja-ISC-green" /></a>
</p>

## Opis projektu

Basia Kasia Asia to aplikacja forumowa dla tematycznych dyskusji
społecznościowych. Użytkownicy mogą przeglądać fora i wątki, zakładać konta,
logować się, publikować wątki i komentarze oraz zarządzać swoim profilem.
Administratorzy mają dodatkowe narzędzia do moderowania użytkowników i forów.

Repozytorium jest podzielone na trzy główne części:

| Obszar | Ścieżka | Rola |
| --- | --- | --- |
| Frontend | `frontend/` | Aplikacja SPA w React 19 z Vite, Tailwind CSS, Radix UI, TanStack Table, komponentami Lexical i usługami Axios. |
| Backend | `backend/` | API Express 5 w TypeScript z modelami Sequelize, bazą SQLite, JWT, logowaniem i seedowaniem danych. |
| Infrastruktura | `azure/` | Terraform oraz skrypty aktualizacyjne do wdrożenia frontendu i backendu na Azure Linux App Service. |

## Funkcje

- Publiczna strona główna, strona o projekcie, lista forów, widok wątków i szczegóły wątku.
- Logowanie, rejestracja, wylogowanie, chroniona trasa profilu i autoryzacja przez token JWT.
- API dla forów, wątków, komentarzy, odpowiedzi i użytkowników.
- Panel administratora z tabelami użytkowników i forów.
- Blokowanie i odblokowywanie użytkowników przez administratorów.
- Automatyczne utworzenie bazy SQLite przy pierwszym starcie backendu.
- Dane startowe z rolami, użytkownikami, forami, wątkami i komentarzami.
- Logowanie żądań i działania aplikacji przez Morgan oraz Winston.
- Wdrożenie na Azure App Service z użyciem Terraform i skryptów pomocniczych.

## Stack technologiczny

| Warstwa | Narzędzia |
| --- | --- |
| UI | React, Vite, TypeScript, Tailwind CSS, Radix UI, Lucide, Sonner |
| Dane i pomocnicze UI | Axios, TanStack Table, Lexical, date-fns |
| API | Node.js, Express, TypeScript, CORS |
| Autoryzacja | JWT, bcrypt |
| Baza danych | SQLite, Sequelize, sequelize-typescript |
| Operacje | Terraform, Azure App Service, Nix dev shell |

## Wymagania

- Node.js 22 jest rekomendowany do pracy lokalnej (`backend/.nvmrc` wskazuje
  `v22.21.0`).
- npm.
- Opcjonalnie: Nix dla środowiska developerskiego z `flake.nix`.
- Opcjonalnie: Azure CLI i Terraform do wdrożenia w chmurze.

## Uruchomienie lokalne

Po sklonowaniu projektu zainstaluj zależności backendu i frontendu osobno.

```bash
cd BasiaKasiaAsia

cd backend
npm install
npm run dev
```

W drugim terminalu:

```bash
cd BasiaKasiaAsia/frontend
npm install
cp .env.example .env
npm run dev
```

Domyślne adresy lokalne:

| Usługa | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8000` |
| Sprawdzenie stanu API | `http://localhost:8000/health` |

Plik `.env` frontendu jest opcjonalny przy domyślnym uruchomieniu lokalnym,
ponieważ kod używa wartości domyślnej `http://localhost:8000`.

## Konfiguracja środowiska

Backend czyta konfigurację z `process.env`. Ma bezpieczne domyślne wartości do
uruchomienia lokalnego, więc może wystartować bez pliku `.env`. Ustaw poniższe
zmienne w shellu, menedżerze procesu albo platformie hostingowej, gdy chcesz
nadpisać domyślne zachowanie:

```env
PORT=8000
NODE_ENV=development
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=24h
DEFAULT_ADMIN_PASSWORD=admin123
DB_PATH=db/database.db
CORS_ORIGIN=http://localhost:5173
```

Zmienne frontendu znajdują się w `frontend/.env` i są ładowane przez Vite:

```env
VITE_API_BASE_URL=http://localhost:8000
```

`VITE_API_BASE_URL` powinno zawierać wyłącznie adres bazowy backendu. Frontend sam
dodaje `/api/v1` dla zasobów forumowych oraz `/api/auth` dla autoryzacji.

## Mapa API

| Zakres | Bazowa ścieżka | Przykłady |
| --- | --- | --- |
| Autoryzacja | `/api/auth` | `POST /register`, `POST /login`, `POST /logout` |
| Użytkownicy | `/api/v1` | `GET /me`, `GET /users`, `POST /users/:id/ban`, `POST /users/:id/unban` |
| Fora | `/api/v1` | `GET /forums`, `GET /forums/:id`, `POST /forums` |
| Wątki | `/api/v1` | `GET /threads`, `GET /forums/:forumId/threads`, `POST /threads` |
| Komentarze | `/api/v1` | `GET /threads/:threadId/comments`, `GET /comments/:commentId/replies`, `POST /comments` |

Chronione trasy oczekują nagłówka `Authorization: Bearer <token>`. Trasy
administracyjne wymagają dodatkowo, aby zalogowany użytkownik miał rolę `admin`.

## Dane startowe

Gdy baza SQLite jest pusta, backend dodaje:

- role: `user`, `moderator`, `admin`;
- przykładowych użytkowników;
- fora: `Japanese Cuisine`, `Handcraft`, `Plants`;
- przykładowe wątki i komentarze.

Aplikacja tworzy też domyślnego administratora, jeśli żaden administrator nie
istnieje:

| Pole | Domyślna wartość |
| --- | --- |
| Email | `admin@example.com` |
| Hasło | wartość `DEFAULT_ADMIN_PASSWORD`, domyślnie `admin123` |

## Wdrożenie na Azure

Konfiguracja Terraform znajduje się w `azure/` i tworzy dwie aplikacje Linux Web
App:

- `${app_name}-frontend` serwującą build Vite przez `pm2 serve`;
- `${app_name}-backend` uruchamiającą `node dist/src/index.js`.

Podstawowy przebieg:

```bash
cd azure
cp terraform.tfvars.template terraform.tfvars
terraform init
terraform apply
./update-app.sh
```

Wymagane zmienne Terraform:

```hcl
jwt_secret             = "replace-with-a-long-random-secret"
default_admin_password = "replace-with-a-strong-password"
```

Po wykonaniu `terraform apply` Terraform wypisze adresy URL App Service dla
frontendu i backendu.

## Struktura projektu

```text
BasiaKasiaAsia/
  azure/       Konfiguracja Terraform i skrypty wdrożeniowe
  backend/     API Express, modele Sequelize, serwisy, trasy i middleware
  frontend/    SPA React, strony, komponenty, hooki, serwisy i zasoby
  flake.nix    Opcjonalne środowisko Nix z Node.js i Prettierem
```
