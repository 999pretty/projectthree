import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Hero } from '../Hero';

// Mock next/image since it's not available in test environment
vi.mock('next/image', () => ({
  default: (props: any) => <img alt={props.alt ?? ''} {...props} />,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock i18n routing
vi.mock('@i18n/routing', () => ({
  LocaleLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock Button component
vi.mock('@ui/components/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return children;
    }
    return <button {...props}>{children}</button>;
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowRightIcon: () => <span data-testid="arrow-right-icon" />,
}));

// Mock image imports
vi.mock('../../../../public/images/hero-image-dark.png', () => ({
  default: 'hero-image-dark.png',
}));

vi.mock('../../../../public/images/hero-image.png', () => ({
  default: 'hero-image.png',
}));

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Your revolutionary Next.js SaaS'
    );
  });

  it('displays the feature announcement badge', () => {
    render(<Hero />);
    expect(screen.getByText('New:')).toBeInTheDocument();
    expect(screen.getByText('Amazing feature of your SaaS')).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<Hero />);
    
    const getStartedButton = screen.getByRole('link', { name: /get started/i });
    const docsButton = screen.getByRole('link', { name: /documentation/i });
    
    expect(getStartedButton).toHaveAttribute('href', '/auth/login');
    expect(docsButton).toHaveAttribute('href', '/docs');
  });

  it('shows the tools section', () => {
    render(<Hero />);
    expect(screen.getByText('Built & shipped with these awesome tools')).toBeInTheDocument();
    expect(screen.getByTitle('nextjsproject')).toBeInTheDocument();
    expect(screen.getByTitle('Vercel')).toBeInTheDocument();
    expect(screen.getByTitle('Prisma')).toBeInTheDocument();
    expect(screen.getByTitle('Tailwind CSS')).toBeInTheDocument();
  });
}); 