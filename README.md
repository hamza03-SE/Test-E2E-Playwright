# Challenge QA E2E - AutoCash

Test E2E automatisé pour la plateforme AutoCash utilisant Playwright avec TypeScript.

## Objectif

Valider un parcours utilisateur complet sur la plateforme AutoCash, de la recherche de véhicules jusqu'à la consultation des détails et de l'option de financement.

## Scénario testé

### 1. Accès à la plateforme

- Navigation vers `https://www.autocash.ma/fr`

### 2. Page d'accueil

- Sélection de la marque : **Toyota**
- Sélection de la catégorie : **SUV**
- Clic sur "Rechercher"

### 3. Page des résultats

- Activation du filtre "Éligible au financement"
- Définition du prix maximum : **350 000 DH**
- Application des filtres
- Vérification des résultats affichés

### 4. Liste filtrée

- Sélection du premier véhicule

### 5. Page de détails du véhicule

- Vérification de la visibilité des informations
- Vérification de la présence du bouton "Simulez votre financement"

## Technologies utilisées

- **Playwright** : Framework de test E2E
- **TypeScript** : Langage de programmation
- **Page Object Model (POM)** : Pattern de conception pour l'organisation du code

## Structure du projet

```
autocash-test-e2e/
├── pages/
│   ├── HomePage.ts              # Page d'accueil
│   ├── ResultsPage.ts           # Page des résultats
│   └── VehicleDetailsPage.ts    # Page de détails du véhicule
├── tests/
│   └── autocash.e2e.spec.ts     # Test E2E complet
├── playwright.config.ts          # Configuration Playwright
├── package.json
└── README.md
```

## Installation

```bash
# Installer les dépendances
npm install

# Installer les navigateurs Playwright
npx playwright install
```

## Exécution des tests

```bash
# Exécuter le test en mode headless
npm test

# Exécuter le test en mode headed (avec interface graphique)
npx playwright test --headed

# Exécuter avec le mode debug
npx playwright test --debug

# Voir le rapport HTML
npx playwright show-report
```

## Résultats

- **Tous les tests passent** : 1/1 (100%)
- **Durée d'exécution** : ~1 minute
- **Couverture** : Toutes les étapes du scénario validées

## Screenshots

Les screenshots sont automatiquement générés en cas d'échec et sauvegardés dans le dossier `test-results/`.

## Points clés de l'implémentation

### Page Object Model

- **Séparation des responsabilités** : Chaque page a sa propre classe
- **Réutilisabilité** : Les méthodes peuvent être réutilisées dans différents tests
- **Maintenabilité** : Les sélecteurs sont centralisés

### Stratégies de sélection robustes

- Utilisation de `getByRole`, `getByTestId`, `getByText`
- Fallbacks pour gérer les variations de la page
- Attentes explicites avec timeouts adaptés

### Gestion des erreurs

- Try-catch pour gérer les éléments dynamiques
- Logs détaillés pour faciliter le debugging
- Screenshots automatiques en cas d'échec

## Notes

- Le test utilise des waits explicites pour gérer les chargements dynamiques
- Les filtres s'appliquent automatiquement sur la plateforme
- Le prix maximum est vérifié sur les 3 premiers véhicules

---

**Date de soumission** : 18/01/2025


![Playwright Tests](https://https://github.com/hamza03-SE/Test-E2E-Playwright/actions/workflows/playwright.yml/badge.svg)
