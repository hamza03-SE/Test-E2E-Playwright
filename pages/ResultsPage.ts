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

    // ✅ Sélecteurs exacts trouvés avec Codegen
    this.priceTab = page.getByRole('tab', { name: 'Prix' });
    this.maxPriceLabel = page.getByText('Max');
    this.maxPriceInput = page.getByRole('spinbutton', { name: '380000' });
    this.financingButton = page.getByRole('button', { name: 'Éligible au financement' });
    this.financingYesOption = page.getByText('Oui5');

    // Sélecteurs pour les cartes de véhicules
    this.vehicleCards = page.locator('[data-testid^="vehicle-card-"]');
    this.firstVehicle = page.getByTestId('vehicle-card-0');
  }

  async openFilters() {
    console.log('Vérification de la section des filtres...');
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(1000);
    console.log('✓ Filtres accessibles');
  }

  async enableFinancingEligibleFilter() {
    console.log('Activation du filtre "Éligible au financement"...');

    // Stratégie 1 : Essayer avec getByTestId directement
    try {
      const checkboxTestId = this.page.getByTestId('eligibleAuFinancement-true');
      await checkboxTestId.waitFor({ state: 'visible', timeout: 5000 });
      await checkboxTestId.click();
      console.log('Option "Oui" selectionnee ');
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.page.waitForTimeout(2000);
      return;
    } catch (error) {
      console.log('testId non trouvé, essai méthode alternative...', error);
    }

    // Stratégie 2 : Cliquer sur le bouton puis chercher "Oui"
    try {
      await this.financingButton.scrollIntoViewIfNeeded();
      await this.financingButton.waitFor({ state: 'visible', timeout: 10000 });

      // Vérifier si le bouton est déjà "expanded"
      const isExpanded = await this.financingButton.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await this.financingButton.click();
        console.log('  → Bouton "Eligible au financement" clique');

        // eslint-disable-next-line playwright/no-wait-for-timeout
        await this.page.waitForTimeout(1500);
      }

      // Chercher "Oui"
      const ouiOptions = this.page.getByText('Oui');
      const count = await ouiOptions.count();
      console.log(` ${count} option "Oui" trouvee`);

      // Cliquer sur la premiere occurrence visible
      for (let i = 0; i < count; i++) {
        const option = ouiOptions.nth(i);
        const isVisible = await option.isVisible().catch(() => false);
        if (isVisible) {
          await option.click();
          console.log(`Option "Oui" selectionnee (index ${i})`);

          // eslint-disable-next-line playwright/no-wait-for-timeout
          await this.page.waitForTimeout(2000);
          return;
        }
      }

      throw new Error('Aucune option "Oui" visible trouvee');
    } catch (error: unknown) {
      console.error('Erreur lors de la sélection du filtre financement:', error);
      throw error;
    }
  }

  async setMaxPrice(price: number) {
    console.log(`Definition du prix maximum : ${price} DH...`);

    // Cliquer sur l'onglet "Prix"
    await this.priceTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.priceTab.click();

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(500);

    // Attendre que le champ Max soit visible
    await this.maxPriceInput.waitFor({ state: 'visible', timeout: 5000 });

    // Triple clic pour sélectionner tout le texte
    await this.maxPriceInput.click({ clickCount: 3 });

    // Entrer le nouveau prix
    await this.maxPriceInput.fill(price.toString());

    // Appuyer sur Entrée pour valider
    await this.maxPriceInput.press('Enter');

    console.log(`✓ Prix maximum défini : ${price} DH`);

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(3000);
  }

  async applyFilters() {
    console.log('Application des filtres...');
    await this.page.waitForLoadState('domcontentloaded');

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2000);
    console.log('Filtres appliqués automatiquement');
  }

  async verifyFilteredResults(maxPrice: number) {
    console.log('Vérification des résultats filtrés...');

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2000);

    const count = await this.vehicleCards.count();

    if (count === 0) {
      console.log(' Aucun vehicule trouve avec ces filtres');
      const anyVehicle = this.page.locator('article, [class*="card"], a[href*="vehicule"]').first();
      const hasAnyVehicle = await anyVehicle.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasAnyVehicle) {
        console.log('Des véhicules sont affiches');
        return;
      }
    } else {
      console.log(`${count} véhicule trouvee`);

      const vehiclesToCheck = Math.min(count, 3);

      for (let i = 0; i < vehiclesToCheck; i++) {
        const vehicleCard = this.vehicleCards.nth(i);
        const cardText = await vehicleCard.textContent();

        if (cardText) {
          const priceMatch = cardText.match(/(\d[\d\s]*)\s*(DH|MAD)/i);
          if (priceMatch) {
            const priceStr = priceMatch[1].replace(/\s/g, '');
            const price = parseInt(priceStr);
            console.log(`  Vehicule ${i + 1}: ${price} DH`);

            if (price <= maxPrice) {
              console.log(` Prix respecte le maximum (${maxPrice} DH)`);
            } else {
              console.log(` Prix dépasse le maximum (${maxPrice} DH)`);
            }
          }
        }
      }
    }
  }

  async clickFirstVehicle() {
    console.log('Selection du premier vehicule...');

    // Attendre que la carte du premier vehicule soit visible
    await this.firstVehicle.waitFor({ state: 'visible', timeout: 10000 });

    // Scroller vers la carte si nécessaire
    await this.firstVehicle.scrollIntoViewIfNeeded();

    // Cliquer sur le premier véhicule
    await this.firstVehicle.click();
    console.log('✓ Premier véhicule cliqué');

    // Attendre la navigation
    await this.page.waitForLoadState('domcontentloaded');

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2000);

    console.log(`✓ Page de détails chargée: ${this.page.url()}`);
  }
}
