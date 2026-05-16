# Peblo AI Notes Workspace

A modern, AI-powered collaborative notes and productivity platform.

## Features

- Secure authentication (JWT, HttpOnly cookies, bcrypt)
- Notes creation and editing with rich text & markdown
- Auto-save functionality
- Tags & Categories organization
- AI summaries, action item extraction, and suggested titles
- Search and filtering (Title, Content, Tags)
- Public note sharing with unique UUID links
- Productivity insights dashboard

## Architecture

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn UI, Zustand, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **Database**: PostgreSQL (Neon / Supabase).
- **AI Integration**: OpenAI (or Gemini / Claude).

## Setup Instructions

### 1. Database Setup
Ensure you have a PostgreSQL database running (e.g., local Postgres, Neon, or Supabase).

### 2. Backend Setup
1. Navigate to the \`backend\` directory: \`cd backend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file based on \`.env.example\` and fill in your details:
   - \`DATABASE_URL\`
   - \`JWT_SECRET\`
   - \`OPENAI_API_KEY\` (or appropriate API key)
4. Run Prisma migrations: \`npx prisma db push\` (or \`npx prisma migrate dev\`)
5. Start the backend server: \`npm run dev\`

### 3. Frontend Setup
1. Navigate to the \`frontend\` directory: \`cd frontend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env.local\` file based on \`.env.example\`:
   - \`NEXT_PUBLIC_API_URL=http://localhost:5000/api\`
4. Start the frontend server: \`npm run dev\`

## Deployment Instructions

### Frontend (Vercel)
1. Push the repository to GitHub.
2. Import the \`frontend\` directory into Vercel.
3. Set the \`NEXT_PUBLIC_API_URL\` environment variable to your deployed backend URL.

### Backend (Railway / Render)
1. Create a new Web Service and connect the GitHub repository.
2. Set the root directory to \`backend\`.
3. Set the build command to \`npm run build && npx prisma generate\`.
4. Set the start command to \`npm start\`.
5. Add all required environment variables (\`DATABASE_URL\`, \`JWT_SECRET\`, \`OPENAI_API_KEY\`, \`FRONTEND_URL\`).

### Database
Use Neon PostgreSQL or Supabase and copy the connection string to your backend's \`DATABASE_URL\`.

## AI Setup
Get an API key from OpenAI, Anthropic, or Google. Add it to the backend \`.env\` as \`OPENAI_API_KEY\` (or another corresponding key based on your chosen provider). The AI logic in \`src/ai\` is built to integrate with standard completion endpoints.
