import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PostListItem } from '../PostListItem';

// Mock dependencies
vi.mock('next/image', () => ({
  default: ({ fill, priority, ...props }: any) => {
    const imgProps = {
      ...props,
      'data-testid': 'mocked-image',
      'data-fill': fill ? 'true' : undefined,
      'data-priority': priority ? 'true' : undefined,
    };
    return <img alt={props.alt ?? ''} {...imgProps} />;
  },
}));

vi.mock('@i18n/routing', () => ({
  LocaleLink: ({ children, ...props }: { children: React.ReactNode }) => (
    <span data-testid="mocked-locale-link" {...props}>{children}</span>
  ),
}));

describe('PostListItem', () => {
  // Test data setup
  const basePost = {
    title: 'Test Post',
    date: '2024-03-20',
    path: 'test-post',
    body: 'Test body',
    content: 'Test content',
    published: true,
    locale: 'en',
    authorName: '',
    tags: [],
  };

  describe('Title rendering', () => {
    it('renders the post title', () => {
      render(<PostListItem post={basePost} />);
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
  });

  describe('Date formatting', () => {
    it('formats the date correctly', () => {
      render(<PostListItem post={basePost} />);
      expect(screen.getByText('3/20/2024')).toBeInTheDocument();
    });

    it('handles invalid date gracefully', () => {
      const postWithInvalidDate = { ...basePost, date: 'invalid-date' };
      render(<PostListItem post={postWithInvalidDate} />);
      expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    });
  });

  describe('Optional content rendering', () => {
    it('renders excerpt when provided', () => {
      const postWithExcerpt = { ...basePost, excerpt: 'Test excerpt' };
      render(<PostListItem post={postWithExcerpt} />);
      expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    });

    it('does not render excerpt when not provided', () => {
      render(<PostListItem post={basePost} />);
      expect(screen.queryByText('Test excerpt')).not.toBeInTheDocument();
    });

    it('renders author section when author name is provided', () => {
      const postWithAuthor = { ...basePost, authorName: 'John Doe' };
      render(<PostListItem post={postWithAuthor} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('does not render author section when author name is empty', () => {
      render(<PostListItem post={basePost} />);
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Tag rendering', () => {
    it('renders each tag with correct formatting', () => {
      const postWithTags = { ...basePost, tags: ['test', 'blog'] };
      render(<PostListItem post={postWithTags} />);
      expect(screen.getByText('#test')).toBeInTheDocument();
      expect(screen.getByText('#blog')).toBeInTheDocument();
    });

    it('does not render tags section when tags array is empty', () => {
      render(<PostListItem post={basePost} />);
      const tags = screen.queryByText((content) => content.startsWith('#'));
      expect(tags).not.toBeInTheDocument();
    });
  });

  describe('Image handling', () => {
    it('renders post image with correct attributes when provided', () => {
      const postWithImage = { ...basePost, image: '/test.jpg' };
      render(<PostListItem post={postWithImage} />);
      const image = screen.getByTestId('mocked-image');
      expect(image).toHaveAttribute('src', '/test.jpg');
      expect(image).toHaveAttribute('alt', 'Test Post');
      expect(image).toHaveAttribute('data-fill', 'true');
    });

    it('does not render image section when image is not provided', () => {
      render(<PostListItem post={basePost} />);
      expect(screen.queryByTestId('mocked-image')).not.toBeInTheDocument();
    });
  });
}); 