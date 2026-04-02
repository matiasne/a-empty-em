# Test

A modern, production-ready Next.js application built with TypeScript and PostgreSQL integration.

## Features

- ⚡ **Next.js 14** with App Router and React Server Components
- 🔷 **TypeScript** for type safety and better developer experience
- 🐘 **PostgreSQL** database integration with Drizzle ORM
- 🎨 **Tailwind CSS** for modern, responsive styling
- 🧩 **Radix UI** components for accessible UI primitives
- ✅ **Zod** for runtime type validation
- 🔧 **ESLint & Prettier** for code quality and formatting
- 📱 **Responsive Design** that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Development**: ESLint, Prettier, TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- PostgreSQL database
- npm, yarn, or pnpm

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/test_db"
   NODE_ENV="development"
   ```

4. **Set up the database**:
   ```bash
   # Generate migration files (if schema changes)
   npm run db:generate
   
   # Run migrations to create tables
   npm run db:migrate
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run db:generate` - Generate database migration files
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── users/            # User-specific components
├── db/                   # Database configuration and schema
│   ├── migrations/       # Database migration files
│   ├── schema.ts         # Database schema definitions
│   ├── migrate.ts        # Migration runner
│   └── index.ts          # Database connection
├── lib/                  # Utility functions and configurations
│   ├── validations/      # Zod validation schemas
│   └── utils.ts          # General utility functions
└── types/                # TypeScript type definitions
```

## Database

This project uses PostgreSQL with Drizzle ORM for type-safe database operations.

### Schema

The initial schema includes:
- **Users table**: Basic user information with name and email

### Migrations

Database migrations are managed with Drizzle Kit:

```bash
# Generate new migration after schema changes
npm run db:generate

# Run pending migrations
npm run db:migrate

# Open database studio
npm run db:studio
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## Styling

The project uses Tailwind CSS with a custom design system that includes:
- CSS custom properties for theming
- Consistent spacing and typography
- Responsive breakpoints
- Dark mode support (configurable)

## Code Quality

- **ESLint** for identifying and fixing code issues
- **Prettier** for consistent code formatting
- **TypeScript** for compile-time type checking
- **Zod** for runtime validation

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.