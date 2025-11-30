# Data Visualization Dashboard

A MERN stack (MongoDB, Express, React/Next.js, Node.js) dashboard for visualizing data with D3.js, as per the assignment requirements.

## Features

- **Dashboard**: Interactive data visualization dashboard using Next.js and Tailwind CSS.
- **Charts**:
  - Scatter Plot: Intensity vs. Likelihood (Radius: Relevance, Color: Region).
  - Bar Chart: Relevance by Year.
- **Filters**: End Year, Topics, Sector, Region, PEST, Source, SWOT, Country, City.
- **API**: Node.js/Express backend with MongoDB integration via Prisma ORM.
- **Data Source**: Filters and charts are dynamically populated from the MongoDB database.

## Tech Stack
- **Dashboard**: Next.js 16, Tailwind CSS 4, D3.js 7, TypeScript.
- **Backend**: Node.js, Express, Prisma, TypeScript.
- **Database**: MongoDB (running in Docker).


### Prerequisites

- Node.js (v18 or higher)

### 1. Database Setup

The project is configured to use **MongoDB Atlas**.

1.  Create a `.env` file in the `backend` directory.
2.  Add your MongoDB Atlas connection string:
    ```env
    DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/visualization-dashboard"
    PORT=4000
    ```
 3.  Place the data file for seeding:
     - Preferred path: `backend/data/jsondata.json`
     - Fallback path: `backend/jsondata.json`
     The seed script automatically checks both paths.

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Seed the database:
    ```bash
    npm run seed
    ```
     This will:
     - Read `jsondata.json` and sanitize empty values
     - Derive `year` field from `end_year`, `published`, or `added`
     - Wipe existing `Record` documents and bulk insert new ones


### 3. Run the Application

1.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:4000`.

2.  Start the frontend development server:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.



## Configuration

- **Backend Port**: Default is `4000`.
- **MongoDB URL**: Defined in `backend/.env` as `DATABASE_URL`.
 - **Frontend API Base URL**: Set `NEXT_PUBLIC_API_BASE_URL` in the frontend env to point to the backend URL (defaults to `http://localhost:4000` in development).

## Verification

- **Linting**: Run `npm run lint` in both `backend` and `frontend` directories.
- **Building**: Run `npm run build` in both `backend` and `frontend` directories.

## API Endpoints

- `GET /api/meta`: Returns distinct values for filters.
- `GET /api/records`: Returns records; supports query params like `end_year`, `topic`, `region`, `limit`.
- `GET /api/summary/year`: Returns aggregated relevance and counts by year; supports the same filters.

## Production Deployment

### Deploy Backend on Render

- Create a new Web Service on Render and connect your repo.
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Environment Variables:
  - `DATABASE_URL` = your MongoDB Atlas URI
  - Do not set `PORT`; Render provides it automatically.
- Seed the database against Atlas before/after deploy:
  ```bash
  cd backend
  # Use the same Atlas DATABASE_URL in .env locally
  npm run seed
  ```
- Verify after deploy:
  - `https://<render-app>.onrender.com/api/meta`
  - `https://<render-app>.onrender.com/api/records?limit=5`

### Deploy Frontend on Vercel

- Import the repo in Vercel and set Root Directory to `frontend`.
- Set environment variable:
  - `NEXT_PUBLIC_API_BASE_URL=https://<render-app>.onrender.com`
- Trigger a deploy and verify the dashboard loads filters and charts.

## Troubleshooting

- Empty filters or charts: Ensure Atlas is seeded (`npm run seed`) and `DATABASE_URL` is correct.
- Frontend calling localhost in production: Set `NEXT_PUBLIC_API_BASE_URL` on Vercel to your Render URL.
- CORS errors: The backend enables CORS; ensure you are calling the correct public URL.
