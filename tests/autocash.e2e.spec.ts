import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { ResultsPage } from '../pages/ResultsPage';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';

test.describe('AutoCash E2E - Parcours utilisateur complet', () => {
  test("Recherche et consultation d'un véhicule avec filtres", async ({ page }) => {
    console.log('\nDébut du test E2E AutoCash\n');

    // 1. Accès à la plateforme
    console.log('Étape 1 : Accès à la plateforme');
    const homePage = new HomePage(page);
    await homePage.goto();

    // ✅ Assertion : vérifier que le bouton Marque est visible
    await expect(homePage.brandButton).toBeVisible();
    console.log("Page d'accueil chargée\n");

    // 2. Page d'accueil - Sélection marque et catégorie
    console.log('Étape 2 : Sélection marque et catégorie');

    // Sélectionner la marque
    await homePage.selectBrand('Toyota');
    console.log('✓ Marque sélectionnée : Toyota');

    // Assertion : vérifier que le bouton catégorie est visible
    await expect(homePage.categoryButton).toBeVisible();

    // Sélectionner la catégorie
    await homePage.selectCategory('SUV');
    console.log('✓ Catégorie sélectionnée : SUV');

    // Assertion : vérifier que le bouton Rechercher est visible
    await expect(homePage.showAllAdsButton).toBeVisible();

    // Cliquer sur Rechercher
    await homePage.clickShowAllAds();
    console.log('✓ Affichage de toutes les annonces');

    // ✅ Assertion : vérifier que l'URL contient "achat" ou "voitures"
    await expect(page).toHaveURL(/achat|voitures/i);

    // 3. Page des résultats - Application des filtres
    console.log('Étape 3 : Application des filtres');
    const resultsPage = new ResultsPage(page);

    await resultsPage.openFilters();
    console.log('✓ Section des filtres accessible');

    // Activer le filtre "Éligible au financement"
    await resultsPage.enableFinancingEligibleFilter();
    console.log('✓ Filtre "Éligible au financement" activé');

    // Définir le prix maximum
    const maxPrice = 350000;
    await resultsPage.setMaxPrice(maxPrice);
    console.log(`✓ Prix maximum défini : ${maxPrice} DH`);

    // Appliquer les filtres
    await resultsPage.applyFilters();
    console.log('✓ Filtres appliqués');

    // ✅ Assertion : vérifier qu'au moins un véhicule filtré est visible
    const firstVehicle = resultsPage.firstVehicle;
    await expect(firstVehicle).toBeVisible();
    console.log('✓ Résultats filtrés vérifiés');

    // 4. Sélection du premier véhicule
    console.log('Étape 4 : Sélection du premier véhicule');
    await resultsPage.clickFirstVehicle();
    console.log('✓ Premier véhicule sélectionné');

    // 5. Page détails du véhicule
    console.log('Étape 5 : Vérification des détails du véhicule');
    const vehicleDetailsPage = new VehicleDetailsPage(page);

    await vehicleDetailsPage.verifyVehicleInformationVisible();
    console.log('✓ Informations du véhicule affichées');

    await vehicleDetailsPage.verifyFinancingSimulatorButton();
    console.log('✓ Bouton de simulation de financement présent');

    // ✅ Assertion : vérifier que le bouton financement est visible
    await expect(vehicleDetailsPage.financingSimulatorButton).toBeVisible();

    console.log('Test E2E complété avec succès!\n');

    // Capture d'écran finale
    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  });
});
