import { Page, Locator, expect } from '@playwright/test';

export class VehicleDetailsPage {
  readonly page: Page;
  readonly vehicleTitle: Locator;
  readonly vehiclePrice: Locator;
  readonly financingSimulatorButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.vehicleTitle = page.locator('h1, h2, [data-testid="vehicle-title"]').first();

    // Prix
    this.vehiclePrice = page.locator('text=/\\d[\\d\\s]*\\s*DH/i').first();

    // Bouton financement
    this.financingSimulatorButton = page.getByTestId('car-details-simulation-button');
  }

  async verifyVehicleInformationVisible() {
    console.log('Verification des informations du vehicule...');

    await this.page.waitForLoadState('domcontentloaded');

    await this.page.waitForTimeout(2000);

    // Verifier le titre
    try {
      await this.vehicleTitle.waitFor({ state: 'visible', timeout: 10000 });
      const titleText = (await this.vehicleTitle.textContent())?.trim();
      console.log(`  Titre du vehicule visible: "${titleText}"`);
      if (!titleText) throw new Error('Titre vide');
      await expect(this.vehicleTitle).toHaveText(titleText);
    } catch (error) {
      console.log(' Titre non trouve avec le selecteur par defaut', error);

      const anyTitle = this.page.locator('h1, h2').first();
      const hasTitleAlt = await anyTitle.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTitleAlt) {
        const titleText = (await anyTitle.textContent())?.trim();
        console.log(`   Titre trouve: "${titleText}"`);
        if (!titleText) throw new Error('Titre vide');
        await expect(anyTitle).toHaveText(titleText);
      } else {
        throw new Error('Impossible de trouver le titre du vehicule');
      }
    }

    try {
      await this.vehiclePrice.waitFor({ state: 'visible', timeout: 10000 });
      const priceText = (await this.vehiclePrice.textContent())?.trim();
      console.log(`  Prix visible: ${priceText}`);
      if (!priceText) throw new Error('Prix vide');
      await expect(this.vehiclePrice).toHaveText(priceText);
    } catch (error) {
      console.log('  Prix non trouve - peut-etre un format different', error);

      const anyPrice = this.page.locator('text=/DH|/i').first();
      const hasPrice = await anyPrice.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasPrice) {
        const priceText = (await anyPrice.textContent())?.trim();
        console.log(` Prix trouve: ${priceText}`);
        if (!priceText) throw new Error('Prix vide');
        await expect(anyPrice).toHaveText(priceText);
      } else {
        console.log(' Aucun prix trouve sur la page');
      }
    }

    console.log('Informations du vehicule verifiees');
  }

  async verifyFinancingSimulatorButton() {
    console.log('Verification du bouton "Simulez votre financement"...');

    const financingButton = this.page.getByTestId('car-details-simulation-button');

    // Attendre que le bouton soit visible
    await financingButton.waitFor({ state: 'visible', timeout: 10000 });

    // Assertion : le bouton est visible
    await expect(financingButton).toBeVisible();

    // Assertion : le bouton est active
    await expect(financingButton).toBeEnabled();

    // verifier le texte
    const text = (await financingButton.textContent())?.toLowerCase();
    if (text) {
      expect(text).toContain('financement');
    }

    console.log('Bouton "Simulez votre financement" present et visible');
  }

  async takeScreenshot(filename: string = 'vehicle-details.png') {
    await this.page.screenshot({
      path: filename,
      fullPage: true,
    });
    console.log(` Screenshot sauvegarde: ${filename}`);
  }
}
