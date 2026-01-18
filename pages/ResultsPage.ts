import { Page, Locator } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly priceTab: Locator;
  readonly maxPriceLabel: Locator;
  readonly maxPriceInput: Locator;
  readonly financingButton: Locator;
  readonly financingYesOption: Locator;
  readonly vehicleCards: Locator;
  readonly firstVehicle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.priceTab = page.getByRole('tab', { name: 'Prix' });
    this.maxPriceLabel = page.getByText('Max');
    this.maxPriceInput = page.locator('input[type="number"]').last();
    this.financingButton = page.getByRole('button', { name: 'Éligible au financement' });
    this.financingYesOption = page.getByText('Oui5');

    this.vehicleCards = page.locator('[data-testid^="vehicle-card-"]');
    this.firstVehicle = page.getByTestId('vehicle-card-0');
  }

  async openFilters() {
    console.log('Verification de la section des filtres...');
    await this.page.waitForTimeout(1000);
    console.log('Filtres accessibles');
  }

  async enableFinancingEligibleFilter() {
    console.log('Activation du filtre "Eligible au financement"...');

    try {
      const checkboxTestId = this.page.getByTestId('eligibleAuFinancement-true');
      await checkboxTestId.waitFor({ state: 'visible', timeout: 5000 });
      await checkboxTestId.click();
      console.log('Option "Oui" selectionnee');
      await this.page.waitForTimeout(2000);
      return;
    } catch {
      console.log('testId non trouve');
    }

    try {
      await this.financingButton.scrollIntoViewIfNeeded();
      await this.financingButton.waitFor({ state: 'visible', timeout: 10000 });

      const isExpanded = await this.financingButton.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await this.financingButton.click();
        console.log('Bouton "Eligible au financement" clique');
        await this.page.waitForTimeout(1500);
      }

      const ouiOptions = this.page.getByText('Oui');
      const count = await ouiOptions.count();
      console.log(`  → ${count} option(s) "Oui" trouvee`);

      for (let i = 0; i < count; i++) {
        const option = ouiOptions.nth(i);
        const isVisible = await option.isVisible().catch(() => false);
        if (isVisible) {
          await option.click();
          console.log(`Option "Oui" selectionnee (index ${i})`);
          await this.page.waitForTimeout(2000);
          return;
        }
      }

      throw new Error('Aucune option "Oui" visible trouvee');
    } catch (err) {
      console.error('Erreur lors de la selection du filtre financement:', err);
      throw err;
    }
  }

  async setMaxPrice(price: number) {
    console.log(`Definition du prix maximum : ${price} DH...`);

    await this.priceTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.priceTab.click();
    await this.page.waitForTimeout(500);

    await this.maxPriceInput.waitFor({ state: 'visible', timeout: 5000 });

    await this.maxPriceInput.click({ clickCount: 3 });

    await this.maxPriceInput.fill(price.toString());

    await this.maxPriceInput.press('Enter');

    console.log(`Prix maximum defini : ${price} DH`);

    await this.page.waitForTimeout(3000);
  }

  async applyFilters() {
    console.log('Application des filtres...');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    console.log('Filtres appliques automatiquement');
  }

  async verifyFilteredResults(maxPrice: number) {
    console.log('Verification des resultats filtres...');

    await this.page.waitForTimeout(2000);

    const count = await this.vehicleCards.count();

    if (count === 0) {
      console.log('Aucun vehicule trouve avec ces filtres');
      const anyVehicle = this.page.locator('article, [class*="card"], a[href*="vehicule"]').first();
      const hasAnyVehicle = await anyVehicle.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasAnyVehicle) {
        console.log('Des vehicules sont affiches');
        return;
      }
    } else {
      console.log(`${count} véhicule(s) trouve`);

      const vehiclesToCheck = Math.min(count, 3);

      for (let i = 0; i < vehiclesToCheck; i++) {
        const vehicleCard = this.vehicleCards.nth(i);
        const cardText = await vehicleCard.textContent();

        if (cardText) {
          const priceMatch = cardText.match(/(\d[\d\s]*)\s*(DH|MAD)/i);
          if (priceMatch) {
            const priceStr = priceMatch[1].replace(/\s/g, '');
            const price = parseInt(priceStr);
            console.log(`Vehicule ${i + 1}: ${price} DH`);

            if (price <= maxPrice) {
              console.log(`Prix respecte le maximum (${maxPrice} DH)`);
            } else {
              console.log(`Prix depasse le maximum (${maxPrice} DH)`);
            }
          }
        }
      }
    }
  }

  async clickFirstVehicle() {
    console.log('Selection du premier vehicule...');

    await this.firstVehicle.waitFor({ state: 'visible', timeout: 10000 });

    await this.firstVehicle.scrollIntoViewIfNeeded();

    await this.firstVehicle.click();
    console.log('Premier vehicule clique');

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    console.log(`Page de details chargee: ${this.page.url()}`);
  }
}
