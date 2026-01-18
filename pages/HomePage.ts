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
      timeout: 60000
    });
    console.log(' Page chargée');
  }

  async selectBrand(brandName: string) {
    console.log(`Sélection de la marque : ${brandName}`);
    
    // Cliquer sur le bouton "Marque"
    await this.brandButton.waitFor({ state: 'visible' });
    await this.brandButton.click();
    await this.page.waitForTimeout(500);
    
    // Essayer d'abord avec getByRole (méthode standard)
    try {
      const brandOption = this.page.getByRole('option', { name: `Checkbox ${brandName}` });
      await brandOption.waitFor({ state: 'visible', timeout: 3000 });
      await brandOption.click();
      console.log(` Marque "${brandName}" selectionnee (via getByRole)`);
    } catch {
      // Fallback : chercher directement par texte dans le menu ouvert
      console.log(`  → Tentative alternative...`);
      const brandText = this.page.getByText(brandName, { exact: true });
      await brandText.click();
      console.log(` Marque "${brandName}" selectionnee (via getByText)`);
    }
    await this.page.waitForTimeout(1000);
  }

  async selectCategory(categoryName: string) {
    console.log(`Selection de la categorie : ${categoryName}`);
    
    // Cliquer sur le bouton "Categorie"
    await this.categoryButton.waitFor({ state: 'visible' });
    await this.categoryButton.click();
    await this.page.waitForTimeout(500);
    
    // Selectionner la categorie
    const categoryOption = this.page.getByRole('option', { name: `Checkbox ${categoryName}` });
    await categoryOption.waitFor({ state: 'visible' });
    await categoryOption.click();
    console.log(`Categorie "${categoryName}" selectionnee`);
    
    await this.page.waitForTimeout(1000);
  }

  async clickShowAllAds() {
    console.log('Clic sur "Rechercher"...');
    
    await this.page.waitForTimeout(1000);
    await this.showAllAdsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.showAllAdsButton.click();
    console.log('Navigation vers les resultats');
    
    await this.page.waitForLoadState('networkidle');
  }
}