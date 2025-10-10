# CONTRIBUTING.md

# Guide de Contribution - CarHub

Merci de votre intérêt pour contribuer à CarHub. Ce document fournit les directives pour contribuer efficacement au projet.

## Table des Matières

1. [Code de Conduite](#code-de-conduite)
2. [Comment Contribuer](#comment-contribuer)
3. [Signaler un Bug](#signaler-un-bug)
4. [Proposer une Fonctionnalité](#proposer-une-fonctionnalité)
5. [Processus de Pull Request](#processus-de-pull-request)
6. [Conventions de Code](#conventions-de-code)
7. [Structure des Commits](#structure-des-commits)
8. [Configuration de l'Environnement](#configuration-de-lenvironnement)

## Code de Conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite qui promeut un environnement respectueux et inclusif pour tous les contributeurs.

## Comment Contribuer

### Types de Contributions Acceptées

- Correction de bugs
- Amélioration de fonctionnalités existantes
- Ajout de nouvelles fonctionnalités
- Amélioration de la documentation
- Optimisation des performances
- Ajout ou amélioration des tests
- Correction de fautes de frappe
- Amélioration de l'accessibilité
- Amélioration de l'interface utilisateur

## Signaler un Bug

Avant de signaler un bug, veuillez vérifier qu'il n'a pas déjà été signalé dans les [Issues](https://github.com/votre-repo/carhub/issues).

### Informations à Fournir

Lorsque vous signalez un bug, incluez les informations suivantes :

1. **Titre descriptif** : Un titre clair et concis du problème

2. **Description détaillée** : 
   - Description précise du bug
   - Comportement attendu
   - Comportement actuel

3. **Étapes pour reproduire** :
   ```
   1. Aller sur la page '...'
   2. Cliquer sur '...'
   3. Faire défiler jusqu'à '...'
   4. Observer l'erreur
   ```

4. **Environnement** :
   - Système d'exploitation (Windows, macOS, Linux)
   - Navigateur et version
   - Version de Node.js
   - Version du projet

5. **Captures d'écran** : Si applicable, ajoutez des captures d'écran

6. **Logs d'erreur** : Copiez les messages d'erreur de la console

7. **Code concerné** : Si possible, identifiez le fichier et la ligne de code

### Exemple de Rapport de Bug

```markdown
Titre : Erreur lors de l'ajout d'un véhicule au panier

Description :
Lorsqu'un utilisateur tente d'ajouter un véhicule au panier depuis la page de détails,
une erreur 500 est retournée et le véhicule n'est pas ajouté.

Étapes pour reproduire :
1. Se connecter en tant que client
2. Naviguer vers la page de détails d'un véhicule
3. Cliquer sur "Ajouter au panier"
4. Observer l'erreur dans la console

Environnement :
- OS : Windows 11
- Navigateur : Chrome 120.0
- Node.js : v18.17.0
- Version du projet : 1.2.0

Erreur console :
```
POST /api/cart/add 500 (Internal Server Error)
TypeError: Cannot read property 'id' of undefined
```

Capture d'écran : [joindre la capture]
```

## Proposer une Fonctionnalité

### Avant de Proposer

- Vérifiez que la fonctionnalité n'existe pas déjà
- Recherchez dans les issues ouvertes et fermées
- Assurez-vous que la fonctionnalité s'aligne avec les objectifs du projet

### Informations à Fournir

1. **Titre descriptif** : Un titre clair de la fonctionnalité

2. **Problème résolu** : Quel problème cette fonctionnalité résout-elle ?

3. **Solution proposée** : Description détaillée de la fonctionnalité

4. **Alternatives** : Autres solutions envisagées

5. **Cas d'usage** : Exemples concrets d'utilisation

6. **Impact** : Impact sur les utilisateurs et le code existant

### Exemple de Proposition

```markdown
Titre : Ajout d'un système de notation des véhicules

Problème :
Les utilisateurs ne peuvent actuellement pas évaluer les véhicules qu'ils ont achetés,
ce qui limite la confiance et les retours sur la qualité.

Solution proposée :
Implémenter un système de notation sur 5 étoiles permettant aux clients ayant effectué
un achat de laisser un avis et une note sur le véhicule.

Fonctionnalités :
- Note de 1 à 5 étoiles
- Commentaire textuel optionnel
- Affichage de la note moyenne sur la fiche véhicule
- Liste des avis clients
- Modération des avis par les administrateurs

Alternatives :
- Système de likes/dislikes (trop simple)
- Système de notation sur 10 (trop complexe)

Impact :
- Modification de la base de données (nouvelle table reviews)
- Nouvelle page de gestion des avis dans l'admin
- Modification des composants de détails véhicule
- Ajout d'API endpoints pour les avis
```

## Processus de Pull Request

### Avant de Soumettre

1. **Fork du projet**
   ```bash
   git clone https://github.com/votre-username/carhub.git
   cd carhub
   ```

2. **Créer une branche**
   ```bash
   git checkout -b feature/ma-fonctionnalite
   # ou
   git checkout -b fix/correction-bug
   ```

3. **Installer les dépendances**
   ```bash
   # Pour le client
   cd Frontend/react-client-frontend
   npm install
   
   # Pour l'admin
   cd Frontend/react-app-admin-car
   npm install
   ```

### Pendant le Développement

1. **Respecter les conventions de code** (voir section suivante)

2. **Tester les modifications**
   ```bash
   npm run dev    # Vérifier en mode développement
   npm run build  # Vérifier que le build fonctionne
   npm run lint   # Vérifier le linting
   ```

3. **Documenter le code**
   - Ajouter des commentaires pour le code complexe
   - Mettre à jour la documentation si nécessaire

4. **Commits réguliers**
   ```bash
   git add .
   git commit -m "type: description"
   git push origin feature/ma-fonctionnalite
   ```

### Soumettre la Pull Request

1. **Créer la PR sur GitHub**
   - Aller sur votre fork
   - Cliquer sur "New Pull Request"
   - Sélectionner votre branche

2. **Remplir le template**
   - Description claire des changements
   - Référence aux issues concernées
   - Captures d'écran si applicable
   - Checklist complétée

3. **Attendre la review**
   - Répondre aux commentaires
   - Effectuer les modifications demandées
   - Mettre à jour la PR

### Checklist de Pull Request

- [ ] Le code compile sans erreur
- [ ] Tous les tests passent
- [ ] Le code suit les conventions du projet
- [ ] La documentation est mise à jour
- [ ] Les commits respectent les conventions
- [ ] Pas de conflits avec la branche main
- [ ] Le code a été testé manuellement
- [ ] Les dépendances sont à jour
- [ ] Aucun warning de sécurité

## Conventions de Code

### Frontend Client (TypeScript)

#### Nommage

```typescript
// Composants : PascalCase
export const UserProfile = () => { }

// Fonctions : camelCase
function getUserData() { }

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com"

// Types/Interfaces : PascalCase
interface UserData {
  id: string
  name: string
}

// Fichiers de composants : PascalCase.tsx
// UserProfile.tsx

// Fichiers utilitaires : camelCase.ts
// formatDate.ts
```

#### Structure des Composants

```typescript
import { useState, useEffect } from 'react'
import type { User } from '@/shared/types/user'

interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

export const UserProfile = ({ userId, onUpdate }: UserProfileProps) => {
  // 1. Hooks
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // 2. Effects
  useEffect(() => {
    loadUser()
  }, [userId])

  // 3. Functions
  const loadUser = async () => {
    setLoading(true)
    // Implementation
    setLoading(false)
  }

  // 4. Render
  if (loading) return <div>Chargement...</div>

  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  )
}
```

### Frontend Admin (JavaScript)

#### Structure similaire
```javascript
import { useState, useEffect } from 'react'

export const UserProfile = ({ userId, onUpdate }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUser()
  }, [userId])

  const loadUser = async () => {
    setLoading(true)
    // Implementation
    setLoading(false)
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  )
}
```

### Style et Formatage

- Utiliser Prettier pour le formatage automatique
- Indentation : 2 espaces
- Point-virgule : Optionnel mais cohérent
- Quotes : Simple quotes pour JSX, double quotes pour autres
- Longueur de ligne : Maximum 100 caractères

### ESLint

Respecter les règles ESLint configurées dans le projet :
```bash
npm run lint
```

## Structure des Commits

Utiliser la convention [Conventional Commits](https://www.conventionalcommits.org/) :

### Format
```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types de Commits

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage (pas de changement de code)
- `refactor` : Refactorisation
- `perf` : Amélioration des performances
- `test` : Ajout ou modification de tests
- `chore` : Tâches de maintenance
- `ci` : Configuration CI/CD
- `build` : Système de build

### Exemples

```bash
feat(client): ajout du système de favoris

Implémentation complète du système de favoris permettant aux utilisateurs
de sauvegarder leurs véhicules préférés.

- Ajout du composant FavoriteButton
- Création du service favoritesService
- Mise à jour du store
- Tests unitaires ajoutés

Closes #123
```

```bash
fix(admin): correction de l'affichage des statistiques

Les graphiques ne s'affichaient pas correctement sur mobile.

Fixes #456
```

```bash
docs: mise à jour du README avec instructions d'installation
```

```bash
refactor(client): amélioration de la structure du composant CarCard
```

## Configuration de l'Environnement

### Outils Recommandés

- **Éditeur** : VS Code
- **Extensions VS Code** :
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  - GitLens

### Configuration VS Code

Créer `.vscode/settings.json` :

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Git Hooks

Le projet utilise Husky pour les hooks Git :

- `pre-commit` : Lint et format du code
- `commit-msg` : Vérification du format des messages

## Questions et Support

- Consultez la documentation dans le dossier `/docs`
- Recherchez dans les [Issues](https://github.com/votre-repo/carhub/issues)
- Ouvrez une nouvelle issue si nécessaire
- Rejoignez nos discussions sur [GitHub Discussions](https://github.com/votre-repo/carhub/discussions)

## Remerciements

Merci à tous les contributeurs qui ont participé à ce projet. Vos contributions sont précieuses et appréciées.
