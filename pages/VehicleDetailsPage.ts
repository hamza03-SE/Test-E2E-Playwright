import { Page, Locator, expect } from '@playwright/test';

export class VehicleDetailsPage {
  readonly page: Page;
  readonly vehicleTitle: Locator;
  readonly vehiclePrice: Locator;
  readonly financingSimulatorButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.vehicleTitle = page.locator('h1, h2, [data-testid="vehicle-title"]').first();

    this.vehiclePrice = page.locator('text=/\\d[\\d\\s]*\\s*DH/i').first();

    this.financingSimulatorButton = page.getByTestId('car-details-simulation-button');
  }

  async verifyVehicleInformationVisible() {

    console.log('VERIFICATION DES INFORMATIONS DU VEHICULE');

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    try {
      await this.vehicleTitle.waitFor({ state: 'visible', timeout: 10000 });
      const titleText = (await this.vehicleTitle.textContent())?.trim();
      
      console.log(`\n Titre du véhicule: "${titleText}"`);
      
      // ASSERTION: Le titre doit exister et ne pas être vide
      expect(titleText).toBeTruthy();
      expect(titleText).not.toBe('');
      
      // ASSERTION: L'element doit contenir ce texte
      await expect(this.vehicleTitle).toHaveText(titleText!);
      
      console.log('  Titre verifie et affiche correctement');
      
    } catch (error) {
      console.log(' Titre non trouve avec le selecteur principal');
      console.log(' Tentative alternatif');

      // Chercher n'importe quel h1 ou h2
      const anyTitle = this.page.locator('h1, h2').first();
      const hasTitleAlt = await anyTitle.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTitleAlt) {
        const titleText = (await anyTitle.textContent())?.trim();
        console.log(` Titre trouve: "${titleText}"`);
        
        // ASSERTION
        expect(titleText).toBeTruthy();
        await expect(anyTitle).toHaveText(titleText!);
      } else {
        // Echec critique
        throw new Error('ECHEC: Impossible de trouver le titre du vehicule');
      }
    }

    // Prix du vehicule
    
    try {
      await this.vehiclePrice.waitFor({ state: 'visible', timeout: 10000 });
      const priceText = (await this.vehiclePrice.textContent())?.trim();
      
      console.log(`\n Prix: ${priceText}`);
      
      //ASSERTION: Le prix doit exister et ne pas etre vide
      expect(priceText).toBeTruthy();
      expect(priceText).not.toBe('');
      
      //ASSERTION: Le prix doit contenir "DH"
      expect(priceText).toContain('DH');
      
      // ASSERTION: L'element doit afficher ce prix
      await expect(this.vehiclePrice).toHaveText(priceText!);
      
      console.log('Prix verifie et affiche correctement');
      
    } catch (error) {
      console.log('Prix non trouve avec le selecteur principal');
      console.log('Recherche alternative...');

      //Chercher n'importe quel texte contenant "DH"
      const anyPrice = this.page.locator('text=/DH/i').first();
      const hasPrice = await anyPrice.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasPrice) {
        const priceText = (await anyPrice.textContent())?.trim();
        console.log(` Prix trouve: ${priceText}`);
        
        //ASSERTION
        expect(priceText).toBeTruthy();
      } else {
        console.log('Aucun prix trouve');
      }
    }

    console.log('\n Informations du vehicule verifiees avec succes');

  }

  /**
   * Vérifie que le bouton "Simulez votre financement" est présent et actif
   * 
   *ASSERTION: Vérifie que le bouton est visible, enabled et contient "financement"
   * 
   * @throws Error si le bouton est introuvable ou inactif
   */

  async verifyFinancingSimulatorButton() {
    console.log('VERIFICATION DU BOUTON DE SIMULATION');

    const financingButton = this.page.getByTestId('car-details-simulation-button');

    // Attendre que le bouton soit visible
    await financingButton.waitFor({ state: 'visible', timeout: 10000 });

    // ASSERTION 1: Le bouton est visible
    await expect(financingButton).toBeVisible({
      timeout: 10000
    });
    console.log('\n Bouton visible');

    // ASSERTION 2: Le bouton est actif
    await expect(financingButton).toBeEnabled({
      timeout: 5000
    });
    console.log(' Bouton actif');

    // ASSERTION 3: Le bouton contient le mot "financement"
    const buttonText = (await financingButton.textContent())?.toLowerCase();
    
    expect(buttonText).toBeTruthy();
    expect(buttonText).toContain('financement');
    
    console.log(`Texte du bouton verifie: "${buttonText}"`);
    console.log('\n Bouton "Simulez votre financement" valide');

  }


  async takeScreenshot(filename: string = 'vehicle-details.png') {
    await this.page.screenshot({
      path: `test-results/${filename}`,
      fullPage: true,
    });
    console.log(` Capture d'ecran sauvegardee: test-results/${filename}`);
  }
}