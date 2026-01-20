import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ResultsPage } from '../pages/ResultsPage';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';

test.describe('AutoCash E2E – Parcours utilisateur complet', () => {

  test('Recherche d’un vehicule avec filtres et consultation des details', async ({ page }) => {

    console.log('\n DEBUT DU TEST E2E AUTOCASH\n');

    // ETAPE 1:  ACCES A LA PLATEFORME

    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(page).toHaveURL(/autocash\.ma/i);
    await expect(homePage.brandButton).toBeVisible();
    await expect(homePage.categoryButton).toBeVisible();

    console.log(' Page d’accueil chargee');

  
    // ETAPE 2: SELECTION MARQUE ET CATEGORIE

    const brand = 'Audi';  
    const category = 'SUV';

    await homePage.selectBrand(brand);
    await homePage.selectCategory(category);
    await homePage.clickShowAllAds();

    await expect(page).toHaveURL(/achat|voiture/i);

    console.log(` Marque "${brand}" et categorie "${category}" selectionnees`);


    // ETAPE 3: APPLICATION DES FILTRES

    const resultsPage = new ResultsPage(page);

    await resultsPage.enableFinancingEligibleFilter();

    const maxPrice = 350000;
    await resultsPage.setMaxPrice(maxPrice);

    // ASSERTION
    await resultsPage.verifyFilteredResults(maxPrice);

    console.log(' Filtres appliques et resultats conformes');

    // ETAPE 4: SELECTION DU PREMIER VEHICULE

    await resultsPage.clickFirstVehicle();

    await expect(page).toHaveURL(/vehicule|voiture/i);

    console.log(' Page details du vehicule chargee');


    // ETAPE 5: VERIFICATION DES DETAILS

    const vehicleDetailsPage = new VehicleDetailsPage(page);

    await vehicleDetailsPage.verifyVehicleInformationVisible();
    await vehicleDetailsPage.verifyFinancingSimulatorButton();

    await expect(vehicleDetailsPage.financingSimulatorButton).toBeVisible();
    await expect(vehicleDetailsPage.financingSimulatorButton).toBeEnabled();

    console.log('\n TEST E2E AUTOCASH TERMINE AVEC SUCCES\n');

    // Capture 
    await page.screenshot({
      path: 'test-results/autocash-e2e.png',
      fullPage: true,
    });
  });

});
