import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

const renderAdminPage = () => render(<MemoryRouter><AdminPage /></MemoryRouter>);

describe('AdminPage', () => {
    it('shows that no sale is active initially', () => {
        renderAdminPage();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('applies a sale percentage entered as a number', () => {
        renderAdminPage();

        fireEvent.change(screen.getByLabelText(/Set Sale Percent/), { target: { value: '25' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows an error when the sale percentage is not numeric', () => {
        renderAdminPage();

        fireEvent.change(screen.getByLabelText(/Set Sale Percent/), { target: { value: 'abc' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('ends a sale and resets the input', () => {
        renderAdminPage();
        const input = screen.getByLabelText(/Set Sale Percent/);

        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        fireEvent.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(input).toHaveValue('0');
    });
});
