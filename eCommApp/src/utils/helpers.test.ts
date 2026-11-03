import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('formatPrice', () => {
    it('formats a price as US dollars with two decimal places', () => {
        expect(formatPrice(1234.5)).toBe('$1,234.50');
    });
});

describe('calculateTotal', () => {
    it('calculates the total using each item quantity', () => {
        expect(calculateTotal([{ price: 2.5, quantity: 2 }, { price: 4, quantity: 3 }])).toBe(17);
    });

    it('returns zero for an empty cart', () => {
        expect(calculateTotal([])).toBe(0);
    });
});

describe('validateEmail', () => {
    it.each([
        ['shopper@example.com', true],
        ['first.last+tag@example.co.uk', true],
        ['missing-at.example.com', false],
        ['missing-domain@', false],
        ['contains space@example.com', false]
    ])('validates %s', (email, expected) => {
        expect(validateEmail(email)).toBe(expected);
    });
});
