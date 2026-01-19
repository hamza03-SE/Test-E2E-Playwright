import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { ResultsPage } from '../pages/ResultsPage';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';

test.describe('AutoCash E2E - Parcours utilisateur complet', () => {
  test("Recherche et consultation d'un véhicule avec filtres", async ({ page }) => {
    console.log('\nDebut du test E2E AutoCash\n');

    // 1. Acces a la plateforme
    console.log('Etape 1 : Acces a la plateforme');
    const homePage = new HomePage(page);
    await homePage.goto();

    // Assertion : vérifier que le bouton Marque est visible
    await expect(homePage.brandButton).toBeVisible();
    console.log("Page d'accueil chargee\n");

    // 2. Page d'accueil : Sélection marque et catégorie
    console.log('Etape 2 : Selection marque et categorie');

    await homePage.selectBrand('Toyota');
    console.log('Marque selectionnee : Toyota');

    await expect(homePage.categoryButton).toBeVisible();
    await homePage.selectCategory('SUV');
    console.log('Categorie selectionnée : SUV');

    await expect(homePage.showAllAdsButton).toBeVisible();
    await homePage.clickShowAllAds();
    console.log('Affichage de toutes les annonces');

    // Assertion : URL doit contenir "achat" ou "voitures"
    await expect(page).toHaveURL(/achat|voitures/i);

    // 3. Page des résultats : Application des filtres
    console.log('Etape 3 : Application des filtres');
    const resultsPage = new ResultsPage(page);

    // Filtre "Éligible au financement"
    await resultsPage.enableFinancingEligibleFilter();

    // Définir le prix maximum
    const maxPrice = 350000;
    await resultsPage.setMaxPrice(maxPrice);

    // Vérifier que les résultats respectent les critères
    await resultsPage.verifyFilteredResults(maxPrice);

    // 4. Sélection du premier véhicule
    console.log('Etape 4 : Selection du premier vehicule');
    await resultsPage.clickFirstVehicle();

    // 5. Page détails du véhicule
    console.log('Etape 5 : Verification des details du vehicule');
    const vehicleDetailsPage = new VehicleDetailsPage(page);

    await vehicleDetailsPage.verifyVehicleInformationVisible();
    console.log('Informations du vehicule affichees');

    await vehicleDetailsPage.verifyFinancingSimulatorButton();
    console.log('Bouton de simulation de financement present');

    await expect(vehicleDetailsPage.financingSimulatorButton).toBeVisible();

    console.log('Test E2E complete avec succes!\n');

    // Capture d'ecran finale
    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  });
});
