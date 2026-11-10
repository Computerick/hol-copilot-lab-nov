import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LoginPage from './LoginPage';

const renderLoginPage = () => render(
    <MemoryRouter initialEntries={['/login']}>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<h2>Admin dashboard</h2>} />
        </Routes>
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('shows an error for invalid credentials and allows a valid login', async () => {
        // Arrange
        const user = userEvent.setup();
        renderLoginPage();
        const username = screen.getByPlaceholderText('Username');
        const password = screen.getByPlaceholderText('Password');

        // Act
        await user.type(username, 'visitor');
        await user.type(password, 'incorrect');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        // Assert
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();

        // Act
        await user.clear(username);
        await user.clear(password);
        await user.type(username, 'admin');
        await user.type(password, 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        // Assert
        expect(screen.getByRole('heading', { name: 'Admin dashboard' })).toBeInTheDocument();
    });
});
