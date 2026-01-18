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

    // Assertion : verifier que le bouton Marque est visible
    await expect(homePage.brandButton).toBeVisible();
    console.log("Page d'accueil chargee\n");

    console.log('Etape 2 : Selection marque et categorie');

    // Selectionner la marque
    await homePage.selectBrand('Toyota');
    console.log('Marque selectionnee : Toyota');

    // Assertion : verifier que le bouton categorie est visible
    await expect(homePage.categoryButton).toBeVisible();

    // Selectionner la categorie
    await homePage.selectCategory('SUV');
    console.log('Categorie selectionnée : SUV');

    // Assertion : verifier que le bouton Rechercher est visible
    await expect(homePage.showAllAdsButton).toBeVisible();

    // Cliquer sur Rechercher
    await homePage.clickShowAllAds();
    console.log('Affichage de toutes les annonces');

    //Assertion : verifier que l'URL contient "achat" ou "voitures"
    await expect(page).toHaveURL(/achat|voitures/i);

    // 3. Page des resultats - Application des filtres
    console.log('Etape 3 : Application des filtres');
    const resultsPage = new ResultsPage(page);

    await resultsPage.openFilters();
    console.log('Section des filtres accessible');

    // Activer le filtre "Éligible au financement"
    await resultsPage.enableFinancingEligibleFilter();
    console.log('Filtre "Eligible au financement" active');

    // Definir le prix maximum
    const maxPrice = 350000;
    await resultsPage.setMaxPrice(maxPrice);
    console.log(`Prix maximum defini : ${maxPrice} DH`);

    // Appliquer les filtres
    await resultsPage.applyFilters();
    console.log('Filtres appliques');

    // Assertion : verifier qu'au moins un vehicule filtre est visible
    const firstVehicle = resultsPage.firstVehicle;
    await expect(firstVehicle).toBeVisible();
    console.log('Resultats filtres verifies');

    // 4. Selection du premier vehicule
    console.log('Etape 4 : Selection du premier vehicule');
    await resultsPage.clickFirstVehicle();
    console.log('Premier vehicule selectionne');

    // 5. Page détails du véhicule
    console.log('Etape 5 : Verification des details du vehicule');
    const vehicleDetailsPage = new VehicleDetailsPage(page);

    await vehicleDetailsPage.verifyVehicleInformationVisible();
    console.log('Informations du vehicule affichees');

    await vehicleDetailsPage.verifyFinancingSimulatorButton();
    console.log('Bouton de simulation de financement present');

    //Assertion : verifier que le bouton financement est visible
    await expect(vehicleDetailsPage.financingSimulatorButton).toBeVisible();

    console.log('Test E2E complete avec succes!\n');

    // Capture d'ecran finale
    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  });
});
