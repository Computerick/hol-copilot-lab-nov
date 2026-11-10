import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('shows the store copyright notice', () => {
        // Arrange
        render(<Footer />);

        // Act
        const notice = screen.getByText('© 2025 The Daily Harvest. All rights reserved.');

        // Assert
        expect(notice).toBeInTheDocument();
    });
});
