import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import Header from './Header';

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');

beforeAll(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
        configurable: true,
        value(this: HTMLDialogElement) {
            this.setAttribute('open', '');
        }
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
        configurable: true,
        value(this: HTMLDialogElement) {
            this.removeAttribute('open');
        }
    });
});

afterAll(() => {
    if (originalShowModal) {
        Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal);
    } else {
        delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
    }

    if (originalClose) {
        Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose);
    } else {
        delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close;
    }
});

describe('Contact Us', () => {
    it('keeps the existing header routes and opens a keyboard-ready contact dialog', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><Header /></MemoryRouter>);

        // Act
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        // Assert
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('link', { name: 'Admin Login' })).toHaveAttribute('href', '/login');
        expect(screen.getByRole('dialog', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
    });

    it('closes on the dialog cancel event and reopens with empty fields', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><Header /></MemoryRouter>);
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Avery');
        const dialog = screen.getByRole('dialog', { name: 'Contact Us' });

        // Act
        fireEvent(dialog, new Event('cancel', { cancelable: true }));
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        // Assert
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
    });

    it('submits the contact form, confirms the message, and opens a clean form afterward', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><Header /></MemoryRouter>);
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Avery');
        await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'avery@example.com');
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Please contact me.');

        // Act
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        // Assert
        expect(screen.getByRole('status')).toHaveTextContent('Thank you for your message');
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Name' })).not.toBeInTheDocument();

        // Act
        await user.click(screen.getByRole('button', { name: 'Continue' }));
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        // Assert
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
    });

    it('places Submit after the message field', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><Header /></MemoryRouter>);

        // Act
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        // Assert
        const message = screen.getByRole('textbox', { name: 'Message' });
        const submit = screen.getByRole('button', { name: 'Submit' });
        expect(message.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('clears entered values when the dialog is closed and reopened', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><Header /></MemoryRouter>);
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Avery');
        await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'avery@example.com');
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Please contact me.');

        // Act
        await user.click(screen.getByRole('button', { name: 'Close' }));
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        // Assert
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
    });

    it('closes the dialog when the backdrop is selected', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><Header /></MemoryRouter>);
        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        const dialog = screen.getByRole('dialog', { name: 'Contact Us' });

        // Act
        fireEvent.click(dialog);

        // Assert
        expect(screen.queryByRole('dialog', { name: 'Contact Us' })).not.toBeInTheDocument();
    });
});
