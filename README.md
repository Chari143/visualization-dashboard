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

## Verification

- **Linting**: Run `npm run lint` in both `backend` and `frontend` directories.
- **Building**: Run `npm run build` in both `backend` and `frontend` directories.
