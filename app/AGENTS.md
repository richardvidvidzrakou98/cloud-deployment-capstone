# AgroLink Ghana Development Guide

## Project Information

This is a React application built with TanStack Start, TypeScript, and Vite for AgroLink Ghana - an e-commerce platform for agricultural products.

## Technology Stack

- **Framework**: TanStack Start (React)
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query
- **Routing**: TanStack Router

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent component structure
- Follow the existing project patterns

### Component Structure

- Keep components focused and reusable
- Use composition over inheritance
- Organize components logically in the `/src/components` directory

### Routes

The application uses TanStack Router with file-based routing:

- `index.tsx` - Home page
- `products.tsx` - Product listing
- `products.$id.tsx` - Individual product details
- `cart.tsx` - Shopping cart
- `checkout.tsx` - Checkout flow
- `about.tsx` - About page
- `contact.tsx` - Contact page

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

When making changes:

1. Maintain code quality and consistency
2. Test changes thoroughly
3. Follow the established patterns
4. Update documentation as needed
