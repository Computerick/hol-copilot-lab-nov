import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createRootMock, renderRootMock } = vi.hoisted(() => ({
    createRootMock: vi.fn(),
    renderRootMock: vi.fn()
}));

vi.mock('react-dom/client', () => ({
    default: { createRoot: createRootMock }
}));

vi.mock('./App.tsx', () => ({
    default: () => null
}));

describe('application entry point', () => {
    beforeEach(() => {
        vi.resetModules();
        createRootMock.mockReturnValue({ render: renderRootMock });
        createRootMock.mockClear();
        renderRootMock.mockClear();
        document.body.innerHTML = '<div id="root"></div>';
    });

    it('creates a React root and renders the application', async () => {
        await import('./main');

        expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'));
        expect(renderRootMock).toHaveBeenCalledOnce();
    });
});
