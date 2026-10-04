# Queuesync

Queuesync is a modern, responsive web application designed to manage campus queue lines efficiently. It allows students to take a digital place in a line and updates them on their turn, while providing service desks (providers) with an intuitive dashboard to call the next student.

## Folder Structure

The project is thoughtfully structured into distinct parts for separation of concerns and maintainability.

```text
Queuesync/
├── backend/                  # Node.js Express backend
│   ├── apis/                 # API route definitions
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middlewares (auth, validation)
│   ├── repositories/         # Database access layer
│   ├── services/             # Business logic (e.g. authService, smsService)
│   └── server.js             # Express application entry point
├── database/                 # Database setup and schema
│   └── schema.sql            # MySQL table schemas & initial data
├── frontend/                 # React frontend application
│   ├── components/           # Reusable UI components
│   ├── pages/                # Main application views (Login, Provider, etc.)
│   ├── services/             # API client and integrations
│   ├── styles/               # CSS modules and global styles
│   └── App.jsx               # Main React routing and structure
├── .gitignore                # Ignored files (node_modules, .env, etc.)
├── package.json              # Project dependencies & scripts
└── vite.config.js            # Vite configuration for frontend build
```

## Features

- **Authentication**: Role-based access control for Students and Providers.
- **Provider Dashboard**: Service providers can easily manage their queues, mark students as complete, and call the next person in line.
- **Dynamic Service Desks**: Providers can create custom service desks when registering.
- **Live Updates**: Students can track their wait time and position in real-time.
- **SMS Notifications**: Integration ready for Twilio to send SMS alerts when a student's turn approaches.

## Database Setup

Queuesync uses MySQL.

1. Ensure MySQL is running on your machine.
2. Run the provided schema file to initialize the database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Copy `.env.example` to `.env` and update the database credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (runs both frontend and backend concurrently):
   ```bash
   npm run dev
   ```

## Author
Ram Charan (GitHub: [ramcharanlugalapu81](https://github.com/ramcharanlugalapu81))
