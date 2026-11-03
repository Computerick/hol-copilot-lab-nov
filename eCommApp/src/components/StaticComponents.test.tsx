import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import HomePage from './HomePage';

describe('Header', () => {
    it('renders the storefront title and navigation links', () => {
        render(<MemoryRouter><Header /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('link', { name: 'Admin Login' })).toHaveAttribute('href', '/login');
    });
});

describe('Footer', () => {
    it('renders the copyright notice', () => {
        render(<Footer />);
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });
});

describe('HomePage', () => {
    it('renders the welcome message and product prompt', () => {
        render(<MemoryRouter><HomePage /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: 'Welcome to the The Daily Harvest!' })).toBeInTheDocument();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });
});
