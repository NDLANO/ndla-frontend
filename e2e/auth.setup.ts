import { test, expect, chromium } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import { map } from 'lodash';

test('authenticate', async ({ page }) => {
    if (process.env.RECORD_FIXTURES) {
        await page.goto('/login?state=/minndla');
        await page.getByRole('link').getByText('Feide test users').click();
        await page.getByLabel('Username').fill('');
        await page.getByLabel('Password', { exact: true }).fill('');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page.getByRole('heading').getByText('Min NDLA')).toBeVisible();

        await page.context().storageState({ path: STORAGE_STATE });
    } else {
        const expAt = (32518706430 - 1687564890 - 60) * 1000 + new Date().getTime();
        const test = {
            "token_type": "Bearer",
            "expires_at": expAt,
            "scope": "email groups-org openid userid userid-feide userinfo-language userinfo-name",
            "ndla_expires_at": expAt,
        }
        const PKCE = "PYCTbNGA-Y_a6CBtMnDYtTsIjB7E8xLNMMVab-tgvZs"
        await page.context().addCookies([{ name: 'feide_auth', value: JSON.stringify(test), expires: 2147483647, path: '/', domain: 'localhost' }, { name: 'PKCE_code', value: PKCE, expires: 2147483647, path: '/', domain: 'localhost' }])

        await page.context().storageState({ path: STORAGE_STATE })
    }
});
