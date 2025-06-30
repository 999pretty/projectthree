import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PostContent } from '../PostContent';

// Mock MDX content
vi.mock('@content-collections/mdx/react', () => ({
  MDXContent: ({ code, components }: { code: string; components: any }) => (
    <div data-testid="mdx-wrapper">
      <div data-testid="mdx-code">{code}</div>
      <div data-testid="mdx-components">
        {/* Test the link component */}
        {components.a({ href: 'https://test.com', children: 'Test Link' })}
      </div>
    </div>
  ),
}));

// Mock shared lib content
vi.mock('@shared/lib/content', () => ({
  slugifyHeadline: (text: string) => text.toLowerCase().replace(/\s+/g, '-'),
}));

// Mock i18n routing
vi.mock('@i18n/routing', () => ({
  LocaleLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a data-testid="locale-link" href={href}>{children}</a>
  ),
}));

// Mock mdx-components
vi.mock('../utils/mdx-components', () => ({
  mdxComponents: {
    a: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href} rel="noopener noreferrer" target="_blank">{children}</a>
    ),
  },
}));

describe('PostContent', () => {
  describe('MDX rendering', () => {
    it('passes content correctly to MDXContent', () => {
      const testContent = '# Test Content';
      render(<PostContent content={testContent} />);
      
      const mdxCode = screen.getByTestId('mdx-code');
      expect(mdxCode).toHaveTextContent(testContent);
    });
  });

  describe('Link component', () => {
    it('provides custom link component to MDXContent', () => {
      render(<PostContent content="" />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://test.com');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveTextContent('Test Link');
    });
  });

  describe('Container styling', () => {
    it('applies required class names', () => {
      render(<PostContent content="" />);
      
      const container = screen.getByTestId('mdx-wrapper').parentElement;
      expect(container).toHaveClass('prose', 'dark:prose-invert', 'mx-auto', 'mt-6', 'max-w-2xl');
    });
  });
}); 