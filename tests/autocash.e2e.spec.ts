import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { ResultsPage } from '../pages/ResultsPage';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';

test.describe('AutoCash E2E - Parcours utilisateur complet', () => {
  test('Recherche et consultation d\'un véhicule avec filtres', async ({ page }) => {
    console.log('\n Début du test E2E AutoCash\n');

    // 1. Accès à la plateforme
    console.log(' Étape 1 : Accès à la plateforme');
    const homePage = new HomePage(page);
    await homePage.goto();
    console.log('Page d\'accueil chargée\n');

    // 2. Page d'accueil - Sélection marque et catégorie
    console.log('Étape 2 : Sélection marque et catégorie');
    
    // Utilisez les noms EXACTS des marques/catégories disponibles
    // Exemples : Toyota, Renault, Peugeot, Dacia, Mercedes-Benz, etc.
    await homePage.selectBrand('Toyota');
    console.log('✓ Marque sélectionnée : Toyota');
    
    // Utilisez les noms EXACTS des catégories disponibles
    // Exemples : SUV, Berline, Citadine, Break, Coupé, etc.
    await homePage.selectCategory('SUV');
    console.log(' Catégorie sélectionnée : SUV');
    
    await homePage.clickShowAllAds();
    console.log(' Affichage de toutes les annonces\n');

    // 3. Page des résultats - Application des filtres
    console.log(' Étape 3 : Application des filtres');
    const resultsPage = new ResultsPage(page);
    
    await resultsPage.openFilters();
    console.log('Section des filtres accessible');
    
    // D'abord activer le filtre "Éligible au financement"
    await resultsPage.enableFinancingEligibleFilter();
    console.log(' Filtre "Éligible au financement" activé');
    
    // Ensuite définir le prix maximum de 350 000 DH
    const maxPrice = 350000;
    await resultsPage.setMaxPrice(maxPrice);
    console.log(` Prix maximum défini : ${maxPrice} DH`);
    
    // Appliquer les filtres (la recherche se fait automatiquement)
    await resultsPage.applyFilters();
    console.log(' Filtres appliqués');
    
    // Vérification des résultats filtrés
    await resultsPage.verifyFilteredResults(maxPrice);
    console.log(' Résultats filtrés vérifiés\n');

    // 4. Liste filtrée - Sélection du premier véhicule
    console.log(' Étape 4 : Sélection du premier véhicule');
    await resultsPage.clickFirstVehicle();
    console.log('✓ Premier véhicule sélectionné\n');

    // 5. Page de détails du véhicule - Vérifications
    console.log(' Étape 5 : Vérification des détails du véhicule');
    const vehicleDetailsPage = new VehicleDetailsPage(page);
    
    await vehicleDetailsPage.verifyVehicleInformationVisible();
    console.log(' Informations du véhicule affichées');
    
    await vehicleDetailsPage.verifyFinancingSimulatorButton();
    console.log(' Bouton de simulation de financement présent\n');

    console.log(' Test E2E complété avec succès!\n');
    
    // Capture d'écran finale
    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  });
});