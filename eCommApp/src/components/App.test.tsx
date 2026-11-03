import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

vi.mock('./HomePage', () => ({ default: () => <h1>Home route</h1> }));
vi.mock('./ProductsPage', () => ({ default: () => <h1>Products route</h1> }));
vi.mock('./LoginPage', () => ({ default: () => <h1>Login route</h1> }));
vi.mock('./AdminPage', () => ({ default: () => <h1>Admin route</h1> }));
vi.mock('./CartPage', () => ({ default: () => <h1>Cart route</h1> }));

describe('App', () => {
    it.each([
        ['/', 'Home route'],
        ['/products', 'Products route'],
        ['/login', 'Login route'],
        ['/admin', 'Admin route'],
        ['/cart', 'Cart route']
    ])('renders the page configured for %s', (path, heading) => {
        render(
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    });
});
