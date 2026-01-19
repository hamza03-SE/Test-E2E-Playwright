import { Page, Locator, expect } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;

  // Filtres
  readonly financingCheckbox: Locator;
  readonly priceTab: Locator;
  readonly maxPriceInput: Locator;

  // Résultats
  readonly vehicleCards: Locator;
  readonly firstVehicle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Filtre "Éligible au financement"
    this.financingCheckbox = page.getByTestId('eligibleAuFinancement-true');

    // Filtre prix
    this.priceTab = page.getByRole('tab', { name: 'Prix' });
    this.maxPriceInput = page.locator('input[type="number"]').last();

    // Résultats
    this.vehicleCards = page.locator('[data-testid^="vehicle-card-"]');
    this.firstVehicle = page.getByTestId('vehicle-card-0');
  }

  /**
   * Active le filtre "Éligible au financement"
   */
  async enableFinancingEligibleFilter() {
    console.log('Activation du filtre "Eligible au financement"...');

    await this.financingCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await this.financingCheckbox.click();

    // Assertion
    await expect(this.financingCheckbox).toBeChecked();

    console.log('Filtre "Eligible au financement" active');
  }

  /**
   * Definit le prix maximum
   */
  async setMaxPrice(price: number) {
    console.log(`Definition du prix maximum : ${price} DH...`);

    await this.priceTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.priceTab.click();

    await this.maxPriceInput.waitFor({ state: 'visible', timeout: 5000 });

    await this.maxPriceInput.click({ clickCount: 3 });
    await this.maxPriceInput.fill(price.toString());
    await this.maxPriceInput.press('Enter');

    console.log(`Prix maximum defini : ${price} DH`);
  }

  /**
   * Verifie que les resultats respectent le prix maximum
   */
  async verifyFilteredResults(maxPrice: number) {
    console.log('Verification des resultats filtres...');

    await this.page.waitForTimeout(2000);

    const count = await this.vehicleCards.count();
    console.log(`${count} vehicule(s) trouve`);

    if (count === 0) {
      console.log('Aucun vehicule trouve avec ces filtres');
      return;
    }

    const vehiclesToCheck = Math.min(count, 3);

    for (let i = 0; i < vehiclesToCheck; i++) {
      const vehicleCard = this.vehicleCards.nth(i);

      // attendre que la carte soit visible
      await vehicleCard.waitFor({ state: 'visible', timeout: 5000 });
      await vehicleCard.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);

      // récupérer le texte de la carte de manière plus fiable
      const text = await vehicleCard.innerText().catch(() => '');

      if (!text || text.trim().length === 0) {
        console.warn(` Carte ${i + 1} vide`);
        continue;
      }

      console.log(`Vehicule ${i + 1} texte : ${text.slice(0, 50)}...`);

      // Extraction du prix
      const priceMatch = text.match(/(\d[\d\s]*)\s*(DH|MAD)/i);
      if (priceMatch) {
        const priceStr = priceMatch[1].replace(/\s/g, '');
        const price = parseInt(priceStr);
        console.log(`Prix vehicule ${i + 1}: ${price} DH`);

        // Assertion : prix respecte le maximum
        expect(price).toBeLessThanOrEqual(maxPrice); //inf
      } else {
        console.warn(`Prix non trouve pour la carte ${i + 1}`);
      }
    }
  }
  /**
   * Clique sur le premier véhicule de la liste
   */
  async clickFirstVehicle() {
    console.log('Selection du premier vehicule...');

    await this.firstVehicle.waitFor({ state: 'visible', timeout: 10000 });
    await this.firstVehicle.scrollIntoViewIfNeeded();
    await this.firstVehicle.click();

    await this.page.waitForLoadState('domcontentloaded');

    console.log(`Page de details chargee : ${this.page.url()}`);
  }
}
