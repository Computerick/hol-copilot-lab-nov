import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';

const renderLoginPage = () => render(
    <MemoryRouter initialEntries={['/login']}>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<h1>Admin dashboard</h1>} />
        </Routes>
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('shows an error for invalid credentials', () => {
        renderLoginPage();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wrong' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'credentials' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('navigates to admin when credentials are valid', () => {
        renderLoginPage();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByRole('heading', { name: 'Admin dashboard' })).toBeInTheDocument();
    });
});
