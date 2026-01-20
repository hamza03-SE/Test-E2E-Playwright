import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly brandButton: Locator;
  readonly categoryButton: Locator;
  readonly showAllAdsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.brandButton = page.getByRole('button', { name: 'Marque' });
    this.categoryButton = page.getByRole('button', { name: 'Catégorie' });
    this.showAllAdsButton = page.getByRole('button', { name: 'Rechercher' });
  }

  async goto() {
    console.log('Navigation vers AutoCash...');
    await this.page.goto('https://www.autocash.ma/fr', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    console.log('Page chargee');

    await this.page.waitForTimeout(2000);

    // Fermer la popup de cookies
    await this.closeCookiePopup();
  }

  async closeCookiePopup() {
    try {
      console.log('Recherche de cookies...');
      
      await this.page.waitForTimeout(2000);
      
      const acceptSelectors = [
        this.page.getByRole('button', { name: 'Accepter' }),
        this.page.getByRole('button', { name: /accepter/i }),
        this.page.locator('button:has-text("Accepter")'),
        this.page.locator('button[type="button"]:has-text("Accepter")'),
        this.page.locator('//button[contains(text(), "Accepter")]'),
      ];

      for (const selector of acceptSelectors) {
        try {
          const isVisible = await selector.isVisible({ timeout: 3000 }).catch(() => false);
          if (isVisible) {
            console.log('Bouton Accepter trouve');
            await selector.click({ force: true });
            console.log('Popup cookies fermee');
            await this.page.waitForTimeout(2000);
            return;
          }
        } catch (e) {
          continue;
        }
      }
      
      console.log(' Popup cookies non trouvee ou deja fermee');
    } catch (error) {
      console.log(' Erreur lors de la fermeture de la popup cookies');
    }
  }

  async selectBrand(brandName: string) {
    console.log(`Selection de la marque : ${brandName}`);

    await this.brandButton.waitFor({ state: 'visible' });
    await this.brandButton.click();

    await this.page.waitForTimeout(1000);

    try {
      const brandOption = this.page.getByRole('option', { name: `Checkbox ${brandName}` });
      await brandOption.waitFor({ state: 'visible', timeout: 5000 });
      await brandOption.scrollIntoViewIfNeeded();
      await brandOption.click();
      console.log(`Marque "${brandName}" selectionnee`);
    } catch {
      console.log(` Tentative alternative...`);

      await this.page.keyboard.press('Escape');

      await this.page.waitForTimeout(500);

      await this.brandButton.click();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.page.waitForTimeout(500);

      const brandInList = this.page.locator(`text="${brandName}"`).first();
      await brandInList.waitFor({ state: 'visible', timeout: 5000 });
      await brandInList.click({ force: true });
      console.log(`Marque "${brandName}" selectionnee`);
    }

    await this.page.waitForTimeout(1500);

    // Verifier que la marque est bien affichee dans le bouton
    const buttonText = await this.brandButton.textContent();
    if (buttonText?.includes(brandName)) {
      console.log(`Verification : "${brandName}" visible dans le bouton`);
    } else {
      console.log(`Attention : "${brandName}" ne semble pas selectionne`);
    }
  }

  async selectCategory(categoryName: string) {
    console.log(`Selection de la categorie : ${categoryName}`);

    await this.categoryButton.waitFor({ state: 'visible' });
    await this.categoryButton.click();

    await this.page.waitForTimeout(500);

    const categoryOption = this.page.getByRole('option', { name: `Checkbox ${categoryName}` });
    await categoryOption.waitFor({ state: 'visible' });
    await categoryOption.click();
    console.log(`Categorie "${categoryName}" selectionnee`);

    await this.page.waitForTimeout(2000);
    
    // Verification
    const buttonText = await this.categoryButton.textContent();
    if (buttonText?.includes(categoryName)) {
      console.log(` Verification : "${categoryName}" visible dans le bouton`);
    }
  }

  async clickShowAllAds() {
    console.log('Clic sur "Rechercher"...');

    await this.page.waitForTimeout(1000);

    await this.showAllAdsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.showAllAdsButton.click();
    console.log('Navigation vers les resultats');

    await this.page.waitForLoadState('domcontentloaded');
  }
}