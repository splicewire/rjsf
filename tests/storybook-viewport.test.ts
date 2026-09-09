import { describe, expect, it, vi } from 'vitest';
import { applyStoryViewport } from '../.storybook/viewport';

describe('Storybook viewport application', () => {
    it('sets the requested mobile size and resets the next story to desktop', async () => {
        let current = { width: 1, height: 1 };
        const page = {
            setViewportSize: vi.fn(async (size: typeof current) => { current = size; }),
            evaluate: vi.fn(async () => current),
        };
        await applyStoryViewport(page, { value: 'mobile1', isRotated: false });
        expect(current).toEqual({ width: 320, height: 568 });
        await applyStoryViewport(page, { value: 'mobile1', isRotated: true });
        expect(current).toEqual({ width: 568, height: 320 });
        await applyStoryViewport(page);
        expect(current).toEqual({ width: 1280, height: 720 });
        expect(page.evaluate).toHaveBeenCalledTimes(3);
    });
    it('fails when the browser does not adopt the requested viewport', async () => {
        await expect(applyStoryViewport({
            setViewportSize: async () => {},
            evaluate: async () => ({ width: 1280, height: 720 }),
        }, { value: 'mobile1', isRotated: false })).rejects.toThrow('Story viewport mismatch');
    });
});
