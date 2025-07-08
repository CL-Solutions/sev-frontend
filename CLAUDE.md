# SEV Frontend - Project Guidelines

## UI Framework

This is a **shadcn/ui** project. For all UI development, we should prefer using shadcn/ui components.

### Adding Components

To add new shadcn/ui components, use:
```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add accordion
```

### Layout Examples

For building the base website layout, refer to the shadcn/ui blocks documentation:
https://ui.shadcn.com/blocks/sidebar#blocks

These blocks provide production-ready layout patterns that can be used as a foundation for the application structure.

## Project Setup

- Next.js 15.3.5 with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui component library