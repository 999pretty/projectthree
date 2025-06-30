# Nextjsproject

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.5-38B2AC?logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.75.1-FF4154?logo=react-query&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.7.0-blueviolet)
![Drizzle](https://img.shields.io/badge/Drizzle-0.43.1-C5F74F?logo=drizzle&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.2.7-orange)
![Hono](https://img.shields.io/badge/Hono-4.7.8-E36002)

The robust example of a production-ready, scalable SaaS applications built with modern technologies and best practices.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
  - [Monorepo Architecture](#monorepo-architecture)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
  - [Database Layer](#database-layer)
- [Code Quality](#-code-quality)
  - [Linting Configuration](#linting-configuration)
  - [Key Components](#key-components)
  - [Rule Categories](#rule-categories)
  - [Benefits](#benefits)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
- [Usage/Installation](#-usageinstallation)
  - [Step 1: Clone Repository](#step-1-clone-repository)
  - [Step 2: Configure Environment Variables](#step-2-configure-environment-variables)
  - [Step 3: Install Dependencies](#step-3-install-dependencies)
  - [Step 4: Initialize Database](#step-4-initialize-database)
  - [Step 5: Run Development Server](#step-5-run-development-server)
  - [Building for Production](#building-for-production)
  - [Linting and Testing](#linting-and-testing)
- [Development Best Practices](#️-development-best-practices)
- [API Documentation](#-api-documentation)
- [Technology Stack](#️-technology-stack)
- [Testing](#-testing)
- [Package Architecture](#-package-architecture)
- [Security Features](#-security-features)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Multi-Tenant Architecture](#-multi-tenant-architecture)
- [Migration & Upgrades](#-migration--upgrades)
- [License](#-license)
- [Roadmap](#️-roadmap)
  - [Current Features](#current-features)
  - [Future Enhancements](#future-enhancements)
- [Environment Variables](#-environment-variables)

## 🔍 Overview

Nextjsproject is a comprehensive, production-ready SaaS example that provides everything you need to build and scale modern web applications. Built with the latest technologies and following industry best practices, it offers a robust foundation for launching a Next.js SaaS product.

## ✨ Features

### Frontend

- **Latest Next.js 15** with App Router architecture and React Server Components
- **TypeScript 5.8** with strict type checking and advanced configurations
- **Modern React 19** with Suspense, concurrent features, and server components
- **Tailwind CSS 4.1** with custom design system and responsive layouts
  - CSS variables for theming
  - Dark/light mode support with `next-themes`
  - Custom utility classes and component variants
- **Shadcn UI** components with Radix UI primitives
- **Advanced Form Handling**
  - React Hook Form with Zod validation
  - Type-safe form schemas
  - Real-time validation and error handling
  - Input OTP components for 2FA
- **TanStack Query** for server state management
  - Intelligent caching and background syncing
  - Optimistic updates and error boundaries
  - Loading states and pagination
- **Performance Optimizations**
  - React Server Components by default
  - Dynamic imports and code splitting
  - Image optimization with Next.js Image
  - Font optimization and loading strategies
- **Internationalization (i18n)**
  - Next-intl integration
  - Multi-language support (English, German)
  - Locale-based routing and currency handling

### Authentication & Security

- **Better Auth** integration with multiple providers
  - Google, GitHub OAuth
  - Email/password authentication
  - Magic link authentication
  - Two-factor authentication (2FA)
- **Advanced Security Features**
  - CSRF protection
  - Rate limiting
  - Secure session management
  - Role-based access control (RBAC)
  - Organization-based permissions

### Backend

- **Hono API Framework** with type-safe routing
- **Dual Database Support**
  - Prisma ORM with PostgreSQL/MySQL
  - Drizzle ORM as alternative
  - Type-safe database queries
  - Migration management
- **Multi-tenancy & Organizations**
  - Organization-based data isolation
  - Invitation system
  - Role management
  - Billing per organization
- **Payment Processing**
  - Stripe integration
  - Subscription management
  - Webhook handling
  - Multiple payment providers support
- **Email System**
  - Transactional emails with React Email
  - Multiple email providers (Resend, SendGrid, etc.)
  - Template system with i18n support
- **File Storage**
  - S3-compatible storage
  - Image processing and optimization
  - Secure file uploads

### AI Integration

- **AI SDK Integration**
  - OpenAI, Anthropic support
  - Chat interfaces
  - Streaming responses
  - Token usage tracking

### DevOps & Quality

- **Monorepo Structure** with Turbo for build optimization
- **Comprehensive Testing**
  - Vitest for unit testing
  - Playwright for E2E testing
  - Testing Library for component testing
- **Code Quality Tools**
  - Biome for linting and formatting
  - ESLint with security rules
  - Husky for git hooks
  - Conventional commits
- **CI/CD Ready**
  - GitHub Actions workflows
  - Automated testing and deployment
  - Semantic releases

## 📁 Project Structure

```
.
├── apps/
│   └── web/                  # Next.js application
│       ├── app/              # App Router pages
│       ├── modules/          # Feature modules
│       ├── public/           # Static assets
│       └── content/          # MDX content
├── packages/
│   ├── ai/                   # AI integration
│   ├── api/                  # API routes and handlers
│   ├── auth/                 # Authentication logic
│   ├── database/             # Database schemas and queries
│   ├── i18n/                 # Internationalization
│   ├── logs/                 # Logging configuration
│   ├── mail/                 # Email templates and providers
│   ├── payments/             # Payment processing
│   ├── storage/              # File storage
│   └── utils/                # Shared utilities
├── config/                   # Application configuration
├── tooling/                  # Shared tooling configurations
│   ├── tailwind/             # Tailwind config
│   └── typescript/           # TypeScript configs
└── scripts/                  # Utility scripts
```

## 🏗️ Architecture

### Monorepo Architecture

The project uses a monorepo structure with Turbo for efficient builds and dependency management:

- **Shared Packages**: Common functionality abstracted into reusable packages
- **Type Safety**: End-to-end TypeScript with shared types across packages
- **Build Optimization**: Turbo caching and parallel builds
- **Development Experience**: Hot reloading across the entire monorepo

### Frontend Architecture

- **App Router**: Leveraging Next.js 15 App Router with nested layouts
- **Server Components**: React Server Components by default for better performance
- **Module-Based Structure**: Features organized in self-contained modules
- **Design System**: Consistent UI with Shadcn components and Tailwind
- **State Management**: Server state with TanStack Query, client state with React hooks

### Backend Architecture

- **API-First Design**: Hono-based APIs with OpenAPI documentation
- **Service Layer**: Business logic separated into service modules
- **Repository Pattern**: Database access abstracted through repositories
- **Multi-tenancy**: Organization-based data isolation and access control
- **Event-Driven**: Webhook handling and async processing

### Database Layer

- **Dual ORM Support**: Choose between Prisma or Drizzle
- **Type-Safe Queries**: Generated types and query builders
- **Migration Management**: Version-controlled schema changes
- **Connection Pooling**: Optimized database connections
- **Multi-tenant Data**: Organization-scoped data access

## 🔍 Code Quality

This project implements a comprehensive code quality system combining multiple tools for maximum reliability and maintainability.

### Linting Configuration

The multi-tiered approach includes:

### Key Components

- **Biome Configuration**: Modern, fast linter and formatter with TypeScript support, React patterns, and security rules
- **ESLint Configuration**: Advanced linting with security plugins (SonarJS, security, accessibility)
- **TypeScript Configuration**: Strict type checking with advanced compiler options
- **Husky Integration**: Pre-commit hooks ensuring code quality before commits

### Rule Categories

The linting rules focus on several key areas:

1. **Type Safety** - Strict TypeScript checking with no implicit any
2. **Security** - Prevention of common vulnerabilities and security anti-patterns
3. **Performance** - Identification of performance bottlenecks and inefficient patterns
4. **Accessibility** - WCAG compliance and inclusive design practices
5. **Code Consistency** - Unified code style across the entire codebase
6. **React Best Practices** - Modern React patterns and hooks usage
7. **Next.js Optimization** - Framework-specific optimizations and patterns

### Benefits

This setup provides several advantages:

- **Early Issue Detection** - Catch bugs during development before production
- **Consistent Codebase** - Maintain unified standards across team members
- **Security Hardening** - Identify and prevent security vulnerabilities
- **Performance Optimization** - Flag performance issues before they impact users
- **Accessibility Compliance** - Ensure applications are usable by everyone
- **Developer Education** - Learn best practices through automated feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (specified in engines)
- pnpm 9.3.0+ (recommended package manager)
- Git
- Database (PostgreSQL recommended for production)

## 💻 Usage/Installation

Follow these steps to set up and run the project:

### Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd nextjsproject-nextjs
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following essential variables:
- `DATABASE_URL`: Your database connection string
- `BETTER_AUTH_SECRET`: Secret for authentication
- OAuth provider credentials (Google, GitHub)
- Payment provider keys (Stripe)
- Email provider configuration

### Step 3: Install Dependencies

```bash
pnpm install
```

### Step 4: Initialize Database

```bash
# Generate database client
pnpm --filter database generate

# Run database migrations
pnpm --filter database migrate

# (Optional) Seed the database
pnpm --filter database seed
```

### Step 5: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
pnpm build
pnpm start
```

### Linting and Testing

```bash
# Run linting
pnpm lint

# Fix linting issues
pnpm format

# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Type checking
pnpm --filter web type-check
```

## 🛠️ Development Best Practices

### Package Management
- **Workspace Dependencies**: Use `workspace:*` for internal package dependencies
- **Version Consistency**: Keep shared dependencies aligned across packages
- **Dependency Auditing**: Regular security audits with `pnpm audit`

### Database Development
```bash
# Development workflow
pnpm --filter database push        # Push schema changes without migration
pnpm --filter database migrate     # Create and apply migrations
pnpm --filter database studio      # Visual database browser
pnpm --filter database generate    # Regenerate client types
```

### Component Development
- **Modular Structure**: Keep components in feature-specific modules
- **Shadcn Integration**: Use `pnpm --filter web shadcn-ui` to add new components
- **Storybook**: Document components with stories for visual testing
- **Accessibility**: Test with screen readers and keyboard navigation

### API Development
- **Type Safety**: Use Hono's type-safe routing with Zod validation
- **Documentation**: Auto-generated OpenAPI specs at `/api/docs`
- **Testing**: Include both unit tests and integration tests
- **Error Handling**: Consistent error responses with proper HTTP status codes

### Performance Monitoring
```bash
# Bundle analysis
pnpm analyze              # Overall bundle analysis
pnpm analyze:server       # Server bundle analysis  
pnpm analyze:browser      # Client bundle analysis

# Dependency analysis
pnpm analyze:deps         # Why is this package included?
pnpm analyze:duplicates   # Find duplicate dependencies
```

## 📚 API Documentation

The API documentation is automatically generated using OpenAPI/Swagger and available at:

- **Development**: `http://localhost:3000/api/docs`
- **OpenAPI Spec**: `http://localhost:3000/api/app-openapi`

The documentation includes:
- Authentication endpoints
- Organization management
- Payment processing
- User management
- File upload endpoints

## 🛠️ Technology Stack

- **Frontend**:
  - Next.js 15.3.1 (App Router, Server Components)
  - React 19.1.0 (Latest with concurrent features)
  - TypeScript 5.8.3 (Strict mode)
  - Tailwind CSS 4.1.5 (Latest with CSS-in-JS)
  - Shadcn UI + Radix UI (Accessible components)
  - TanStack Query 5.75.1 (Server state)

- **Backend**:
  - Hono 4.7.8 (Fast web framework)
  - Better Auth 1.2.7 (Modern authentication)
  - Prisma 6.7.0 / Drizzle 0.43.1 (Database ORMs)
  - Zod 3.24.3 (Schema validation)

- **Database**:
  - PostgreSQL (Production recommended)
  - SQLite (Development default)

- **Payments**:
  - Stripe (Primary)
  - LemonSqueezy, Polar (Alternative providers)

- **Email**:
  - React Email (Templates)
  - Resend, SendGrid (Providers)

- **Storage**:
  - AWS S3 (Primary)
  - Cloudflare R2 (Alternative)

- **AI**:
  - AI SDK 4.3.13
  - OpenAI, Anthropic (Providers)

- **Testing & Quality**:
  - Vitest 3.2.4 (Unit testing)
  - Playwright 1.52.0 (E2E testing)
  - Biome 1.9.4 (Linting/Formatting)
  - ESLint 9.29.0 (Additional linting)

- **DevOps**:
  - Turbo 2.5.3 (Monorepo builds)
  - Husky 9.1.7 (Git hooks)
  - GitHub Actions (CI/CD)

## 🧪 Testing

The project includes comprehensive testing setup:

### Unit Testing
```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test --watch
```

### E2E Testing
```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode
pnpm --filter web e2e
```

### Component Testing
Individual components include test files alongside their implementation using Testing Library and Vitest.

## 🔧 Package Architecture

The monorepo is organized into focused packages, each with specific responsibilities:

### Core Packages
- **`packages/auth`** - Authentication providers, session management, RBAC
- **`packages/database`** - Schema definitions, migrations, type-safe queries
- **`packages/api`** - API routes, middleware, OpenAPI documentation
- **`packages/payments`** - Stripe, LemonSqueezy integration, webhook handlers

### Feature Packages  
- **`packages/ai`** - OpenAI/Anthropic integration, chat interfaces, token tracking
- **`packages/mail`** - Email templates, provider abstraction, i18n support
- **`packages/storage`** - S3/R2 file handling, image optimization
- **`packages/i18n`** - Translation management, locale utilities

### Utility Packages
- **`packages/logs`** - Structured logging, error tracking
- **`packages/utils`** - Shared utilities and helper functions

### Inter-Package Communication
- Packages communicate through well-defined TypeScript interfaces
- Database types are generated and shared across all packages
- API contracts ensure type safety between frontend and backend
- Event-driven patterns for decoupled integrations

## 🔒 Security Features

Nextjsproject implements comprehensive security measures:

### Authentication Security
- **Session Management**: Secure, httpOnly cookies with CSRF protection
- **OAuth Integration**: Vetted providers with secure token handling
- **Two-Factor Authentication**: TOTP support with backup codes
- **Rate Limiting**: Configurable limits to prevent brute force attacks

### API Security
- **CORS Configuration**: Strict origin policies
- **Request Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: ORM-based queries with parameterization
- **XSS Protection**: Content Security Policy headers

### Data Protection
- **Organization Isolation**: Row-level security for multi-tenant data
- **Encryption at Rest**: Database and file storage encryption
- **Secure Headers**: HSTS, CSP, and other security headers
- **Vulnerability Scanning**: Automated dependency checking

## 🚨 Troubleshooting

### Common Development Issues

**Database Connection Errors**
```bash
# Check database URL format
echo $DATABASE_URL

# Regenerate Prisma client
pnpm --filter database generate

# Reset database in development
pnpm --filter database push --force-reset
```

**Authentication Issues**
- Verify `BETTER_AUTH_SECRET` is set and consistent
- Check OAuth provider credentials and callback URLs
- Ensure database tables are properly migrated

**Build Failures**
```bash
# Clear all build caches
pnpm clean

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for TypeScript errors
pnpm --filter web type-check
```

**Environment Variable Issues**
- Use `.env.example` as reference for required variables
- Ensure sensitive variables are not committed to git
- Check that environment variables are loaded in correct order

### Performance Issues
- **Large Bundle Size**: Use `pnpm analyze` to identify heavy dependencies
- **Slow Database Queries**: Enable query logging and optimize with indexes
- **Memory Leaks**: Check for unclosed database connections and event listeners

## 🤝 Contributing

Contributions are welcome! Please follow our development workflow:

### Development Workflow
1. Fork the project and create your feature branch
2. Follow conventional commit format (`feat:`, `fix:`, `docs:`, etc.)
3. Write tests for new functionality
4. Ensure all linting and tests pass
5. Update documentation as needed
6. Submit a Pull Request with clear description

### Code Standards
- **Style Guide**: Enforced by Biome configuration
- **TypeScript**: Strict mode with no implicit any
- **Testing**: Minimum 80% coverage for new features
- **Security**: Follow OWASP guidelines for web applications

### Package Development
When adding new packages:
- Follow the existing package structure
- Add proper TypeScript configurations
- Include comprehensive README documentation
- Ensure proper dependency management
- Add to the main Turbo pipeline

### Git Workflow
- Use feature branches for all changes
- Squash commits before merging
- Include package scope in commit messages
- Tag releases following semantic versioning

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). A commit message should be structured as follows:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Commit Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries
- `ci`: Changes to CI configuration files and scripts
- `revert`: Reverts a previous commit

#### Scope Guidelines
The scope should be the name of the package/module affected (as perceived by the person reading the changelog):
- `auth`, `database`, `api`, `payments`, `ai`, `mail`, `storage`, `i18n`, `logs`, `utils`
- `web` for frontend-specific changes
- `config` for configuration changes
- `deps` for dependency updates

#### Commit Examples
```bash
feat(auth): add password reset functionality
fix(api): handle null response from external service
docs(readme): update installation instructions
style(components): format according to style guide
refactor(database): optimize query performance
test(utils): add unit tests for date formatter
chore(deps): update dependencies
ci(github): add semantic release workflow
```

#### Breaking Changes
Breaking changes should be indicated by adding a `!` after the type/scope or by adding a footer starting with `BREAKING CHANGE:`.

```bash
feat(api)!: remove deprecated endpoints

BREAKING CHANGE: The following endpoints have been removed:
- /api/v1/legacy
- /api/v1/deprecated
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 Multi-Tenant Architecture

Nextjsproject is built with multi-tenancy as a core feature, enabling SaaS applications to serve multiple organizations:

### Organization-Based Isolation
- **Data Separation**: Each organization's data is completely isolated
- **User Management**: Users can belong to multiple organizations with different roles
- **Billing Isolation**: Separate billing and subscription management per organization
- **Custom Branding**: Organization-specific themes and branding (planned)

### Implementation Details
- **Row-Level Security**: Database queries automatically filter by organization context
- **API Middleware**: Automatic organization context injection in API routes
- **Frontend Context**: Organization-aware components and routing
- **Invitation System**: Secure organization invitation workflows

### Scaling Considerations
- **Database Sharding**: Ready for horizontal scaling strategies
- **Resource Limits**: Per-organization resource quotas and limits
- **Performance Monitoring**: Organization-specific performance metrics
- **Backup Strategy**: Organization-aware backup and disaster recovery

## 🔄 Migration & Upgrades

### Upgrading Nextjsproject
When new versions are released:

```bash
# Check current version
git tag --list | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -1

# Update to latest version
git fetch origin
git checkout v<latest-version>

# Review breaking changes
cat CHANGELOG.md

# Update dependencies
pnpm install

# Run migrations
pnpm --filter database migrate
```

### Database Migrations
- **Development**: Use `pnpm --filter database migrate` for schema changes
- **Production**: Always backup before running migrations
- **Rollback**: Keep rollback scripts for critical schema changes
- **Testing**: Test migrations against production-like data

### Breaking Changes
- Review `CHANGELOG.md` for breaking changes
- Check migration guides in documentation
- Update environment variables as needed
- Test thoroughly in staging environment

## 🗺️ Roadmap

### Current Features

- ✅ Complete authentication system with multiple providers
- ✅ Multi-tenant organization management
- ✅ Payment processing with multiple providers
- ✅ Internationalization support
- ✅ AI integration capabilities
- ✅ Comprehensive email system
- ✅ File storage and processing
- ✅ Admin dashboard and user management
- ✅ API documentation and OpenAPI specs
- ✅ Comprehensive testing setup

### Future Enhancements

- 🔄 **Enhanced AI Features**
  - Advanced prompt management
  - Custom model fine-tuning
  - AI-powered analytics

- 🔄 **Advanced Analytics**
  - Custom event tracking
  - Revenue analytics dashboard
  - User behavior insights

- 🔄 **Mobile Application**
  - React Native companion app
  - API optimization for mobile  
  - Offline capability

- 🔄 **Enterprise Features**
  - Advanced RBAC system
  - Audit logging
  - SOC 2 compliance tools
  - Advanced security features

- 🔄 **Developer Experience**
  - CLI tool for rapid development
  - Visual schema editor
  - Advanced debugging tools

## 🌍 Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following categories:

### Database Configuration
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
# or for development with SQLite
DATABASE_URL="file:./dev.db"
```

### Authentication
```bash
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Payment Providers
```bash
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# LemonSqueezy (optional)
LEMONSQUEEZY_API_KEY="your-api-key"
LEMONSQUEEZY_STORE_ID="your-store-id"
```

### Email Configuration
```bash
# Resend (recommended)
RESEND_API_KEY="re_..."

# SendGrid (alternative)
SENDGRID_API_KEY="SG..."
```

### File Storage
```bash
# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="your-bucket"

# Cloudflare R2 (alternative)
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"
```

### AI Integration
```bash
# OpenAI
OPENAI_API_KEY="sk-..."

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."
```

### Monitoring (Optional)
```bash
# Sentry
SENTRY_DSN="https://your-sentry-dsn"

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-..."
```

For a complete list of environment variables and their descriptions, see the `.env.example` file in the repository. 