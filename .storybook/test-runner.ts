import type { TestRunnerConfig } from '@storybook/test-runner';

/**
 * Visual-regression SEAM (component-seams ticket 04/08; WIRED-BUT-INERT here — splice stand-up,
 * ticket 28): self-hosted Storybook test-runner + Playwright, snapshots → `.tests/vr` (no
 * external SaaS; Chromatic rejected). Mirrored from the beam stand-up (ticket 23) / schemastud
 * pilot.
 *
 * NOT BASELINED in this ticket. Standing up splice's Storybook is scoped to config + seed + one
 * smoke story; baselining is owner-env work that graduates with the splice catalog wave (ticket
 * 29), exactly as schemastud's seam sat inert from ticket 08 until it was baselined in ticket 14
 * and beam's from ticket 23. The image-snapshot step stays gated behind VR_SNAPSHOTS, so a bare
 * `test-storybook` run is just the per-story smoke; a `VR_SNAPSHOTS=1 test-storybook` run
 * writes/compares baselines under `.tests/vr` in BOTH ambient color schemes (treatment-axes
 * ticket 13: light AND dark required).
 *
 * Refresh baselines after an intentional visual change: `VR_SNAPSHOTS=1 test-storybook -u`.
 */
const config: TestRunnerConfig = {
    async postVisit(page, context) {
        if (!process.env.VR_SNAPSHOTS) return;
        const { toMatchImageSnapshot } = await import('jest-image-snapshot');
        expect.extend({ toMatchImageSnapshot });

        const snapshot = async (scheme: 'light' | 'dark') => {
            await page.evaluate((dark) => {
                document.documentElement.classList.toggle('dark', dark);
            }, scheme === 'dark');
            const image = await page.screenshot();
            expect(image).toMatchImageSnapshot({
                customSnapshotsDir: '.tests/vr',
                customSnapshotIdentifier: `${context.id}--${scheme}`,
            });
        };

        // Ambient axis: both schemes are required baselines (ticket 13).
        await snapshot('light');
        await snapshot('dark');
        // Leave the preview in its default (light) state for the next story's smoke assertion.
        await page.evaluate(() => document.documentElement.classList.remove('dark'));
    },
};

export default config;
