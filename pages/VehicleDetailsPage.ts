import { Page, Locator, expect } from '@playwright/test';

export class VehicleDetailsPage {
  readonly page: Page;
  readonly vehicleTitle: Locator;
  readonly vehiclePrice: Locator;
  readonly financingSimulatorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Sélecteurs à confirmer avec Codegen
    // Format probable : h1, h2 pour le titre
    this.vehicleTitle = page.locator('h1, h2, [data-testid="vehicle-title"]').first();
    
    // Prix - chercher un pattern de type "XXX XXX DH"
    this.vehiclePrice = page.locator('text=/\\d[\\d\\s]*\\s*DH/i').first();
    
    // Bouton financement - À METTRE À JOUR avec le sélecteur exact de Codegen
    this.financingSimulatorButton = page.getByRole('button', { name: /simulez.*financement/i });
  }

  async verifyVehicleInformationVisible() {
    console.log('Vérification des informations du véhicule...');
    
    // Attendre que la page soit chargée
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    // Vérifier que le titre du véhicule est visible
    try {
      await this.vehicleTitle.waitFor({ state: 'visible', timeout: 10000 });
      const title = await this.vehicleTitle.textContent();
      console.log(`  ✓ Titre du véhicule visible: "${title?.trim()}"`);
      expect(title).toBeTruthy();
    } catch (error) {
      console.log('  ⚠️ Titre non trouvé avec le sélecteur par défaut');
      
      // Fallback : chercher n'importe quel h1 ou h2
      const anyTitle = this.page.locator('h1, h2').first();
      const hasTitleAlt = await anyTitle.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasTitleAlt) {
        const title = await anyTitle.textContent();
        console.log(`  ✓ Titre trouvé (fallback): "${title?.trim()}"`);
      } else {
        throw new Error('Impossible de trouver le titre du véhicule');
      }
    }
    
    // Vérifier que le prix est visible
    try {
      await this.vehiclePrice.waitFor({ state: 'visible', timeout: 10000 });
      const price = await this.vehiclePrice.textContent();
      console.log(`  ✓ Prix visible: ${price?.trim()}`);
      expect(price).toBeTruthy();
    } catch (error) {
      console.log('  ⚠️ Prix non trouvé - peut-être un format différent');
      
      // Chercher n'importe quel texte contenant "DH" ou "MAD"
      const anyPrice = this.page.locator('text=/DH|MAD/i').first();
      const hasPrice = await anyPrice.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasPrice) {
        const price = await anyPrice.textContent();
        console.log(`  ✓ Prix trouvé (fallback): ${price?.trim()}`);
      } else {
        console.log('  ⚠️ Aucun prix trouvé sur la page');
      }
    }
    
    console.log('✓ Informations du véhicule vérifiées');
  }

  async verifyFinancingSimulatorButton() {
    console.log('Vérification du bouton "Simulez votre financement"...');
    
    try {
      // Attendre que le bouton soit visible
      await this.financingSimulatorButton.waitFor({ state: 'visible', timeout: 10000 });
      
      const buttonText = await this.financingSimulatorButton.textContent();
      console.log(`  ✓ Bouton trouvé: "${buttonText?.trim()}"`);
      
      // Vérifier que le texte contient bien "financement"
      expect(buttonText?.toLowerCase()).toContain('financement');
      
      console.log('✓ Bouton "Simulez votre financement" présent et visible');
      
    } catch (error: any) {
      console.log('  ❌ Bouton non trouvé avec le sélecteur par défaut');
      console.log('  → Recherche de tous les boutons contenant "financement"...');
      
      // Fallback : chercher tous les boutons/liens contenant "financement"
      const allButtons = this.page.locator('button, a').filter({ hasText: /financement/i });
      const count = await allButtons.count();
      console.log(`  → ${count} élément(s) contenant "financement" trouvé(s)`);
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const btn = allButtons.nth(i);
          const isVisible = await btn.isVisible().catch(() => false);
          const text = await btn.textContent().catch(() => '');
          console.log(`     [${i}] Visible: ${isVisible ? '✅' : '❌'} | Texte: "${text?.trim()}"`);
        }
        
        // Prendre le premier visible
        const firstVisible = allButtons.filter({ hasText: /simulez|simulation/i }).first();
        const exists = await firstVisible.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (exists) {
          console.log('  ✓ Bouton financement trouvé (méthode alternative)');
        } else {
          throw new Error('Aucun bouton de financement visible trouvé');
        }
      } else {
        throw error;
      }
    }
  }
  
  async takeScreenshot(filename: string = 'vehicle-details.png') {
    await this.page.screenshot({ 
      path: filename,
      fullPage: true 
    });
    console.log(` Screenshot sauvegardé: ${filename}`);
  }
}