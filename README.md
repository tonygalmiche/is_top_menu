# Top Menu Navigation

Module Odoo 16 pour afficher une page de navigation moderne avec tous les sous-menus.

## Fonctionnalités

- **Page de navigation complète** : Affiche tous les sous-menus d'un menu principal dans une belle présentation en grille
- **Recherche intégrée** : Recherchez rapidement un menu spécifique
- **Interface moderne** : Design responsive avec effets de survol
- **Compatible OWL** : Utilise le framework OWL d'Odoo pour une future migration vers Odoo 18/20

## Installation

1. Copier le module dans le répertoire des addons Odoo
2. Mettre à jour la liste des modules
3. Installer le module `is_top_menu`

## Utilisation

Le module ajoute automatiquement un nouveau menu "Tous les menus" comme premier sous-menu de "Gestion de la qualité".

Quand vous cliquez sur ce menu, une page s'affiche avec :
- Le titre du menu principal
- Une barre de recherche
- Tous les sous-menus organisés en sections
- Navigation directe vers chaque menu

## Extension

Pour ajouter cette fonctionnalité à d'autres menus principaux :

1. Ouvrez `views/menu_navigator_view.xml`
2. Ajoutez un nouveau record similaire à `gestion_qualite_tous_menus`
3. Changez le `parent_id` pour pointer vers le menu parent souhaité

Exemple :
```xml
<record id="autre_menu_tous_menus" model="ir.ui.menu">
    <field name="name">Tous les menus</field>
    <field name="sequence">5</field>
    <field name="parent_id" ref="module.autre_menu"/>
    <field name="action" ref="menu_navigator_action"/>
</record>
```

## Architecture

- `static/src/js/menu_navigator.js` : Composant OWL principal
- `static/src/xml/menu_navigator.xml` : Templates QWeb
- `static/src/css/menu_navigator.css` : Styles CSS
- `views/menu_navigator_view.xml` : Actions et menus

## Dépendances

- `base`
- `web`
- `is_dynacase2odoo`
