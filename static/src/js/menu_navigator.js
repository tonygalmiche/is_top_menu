/** @odoo-module **/

import { Component, useState, onWillStart, onMounted, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

console.log('[MENU_NAVIGATOR] Module loading...');

/**
 * Composant qui affiche tous les sous-menus d'un menu parent
 * dans une belle présentation en grille
 */
export class MenuNavigator extends Component {
    setup() {
        console.log('[MENU_NAVIGATOR] MenuNavigator setup');
        this.menuService = useService("menu");
        this.actionService = useService("action");
        
        this.state = useState({
            searchTerm: "",
            isReady: false,
        });

        // Attendre que le menu soit bien chargé
        onWillStart(async () => {
            // Petit délai pour permettre au menuService de se mettre à jour
            await new Promise(resolve => setTimeout(resolve, 100));
            this.state.isReady = true;
        });

        // Écouter les changements de menu
        onMounted(() => {
            this.env.bus.on("MENUS:APP-CHANGED", this, this.onMenuChanged);
        });

        onWillUnmount(() => {
            this.env.bus.off("MENUS:APP-CHANGED", this);
        });
    }

    onMenuChanged() {
        // Forcer le rafraîchissement quand le menu change
        this.state.isReady = false;
        setTimeout(() => {
            this.state.isReady = true;
        }, 50);
    }

    /**
     * Récupère le menu parent à partir de l'action
     */
    get currentApp() {
        return this.menuService.getCurrentApp();
    }

    /**
     * Récupère l'arbre des sous-menus du menu courant
     */
    get menuTree() {
        const currentApp = this.currentApp;
        if (!currentApp) {
            return [];
        }
        const menuTree = this.menuService.getMenuAsTree(currentApp.id);
        const children = menuTree ? menuTree.childrenTree : [];
        
        // Filtrer le menu "🏠" lui-même pour ne pas l'afficher dans la liste
        return children.filter(menu => menu.name !== "🏠");
    }

    /**
     * Filtre les menus selon le terme de recherche
     */
    get filteredMenus() {
        if (!this.state.searchTerm) {
            return this.menuTree;
        }
        
        const searchTerm = this.state.searchTerm.toLowerCase();
        return this.filterMenusRecursive(this.menuTree, searchTerm);
    }

    /**
     * Filtre récursif des menus
     */
    filterMenusRecursive(menus, searchTerm) {
        const result = [];
        for (const menu of menus) {
            if (menu.name.toLowerCase().includes(searchTerm)) {
                result.push(menu);
            } else if (menu.childrenTree && menu.childrenTree.length > 0) {
                const filteredChildren = this.filterMenusRecursive(menu.childrenTree, searchTerm);
                if (filteredChildren.length > 0) {
                    result.push({
                        ...menu,
                        childrenTree: filteredChildren
                    });
                }
            }
        }
        return result;
    }

    /**
     * Regroupe les menus par sections (menus de niveau 1)
     */
    get menuSections() {
        const sections = [];
        for (const menu of this.filteredMenus) {
            sections.push({
                id: menu.id,
                name: menu.name,
                children: menu.childrenTree || [],
                actionID: menu.actionID,
                hasAction: !!menu.actionID
            });
        }
        return sections;
    }

    /**
     * Gestionnaire de recherche
     */
    onSearchInput(ev) {
        this.state.searchTerm = ev.target.value;
    }

    /**
     * Gestionnaire de clic sur un menu
     */
    onMenuItemClick(ev) {
        ev.preventDefault();
        
        const menuId = parseInt(ev.currentTarget.dataset.menuId);
        const actionId = ev.currentTarget.dataset.actionId;
        
        console.log('[MENU_NAVIGATOR] Menu clicked:', menuId, actionId);
        
        if (actionId && actionId !== 'false') {
            this.actionService.doAction(parseInt(actionId));
        } else if (menuId) {
            this.menuService.selectMenu(menuId);
        }
    }

    /**
     * Génère le href pour un lien de menu
     */
    getMenuItemHref(menu) {
        const parts = [`menu_id=${menu.id}`];
        if (menu.actionID) {
            parts.push(`action=${menu.actionID}`);
        }
        return "#" + parts.join("&");
    }

    /**
     * Nom du menu principal
     */
    get appName() {
        const currentApp = this.currentApp;
        return currentApp ? currentApp.name : "Navigation";
    }
}

MenuNavigator.template = "is_top_menu.MenuNavigator";

console.log('[MENU_NAVIGATOR] MenuNavigator component defined');

// Enregistrer le composant comme action client
registry.category("actions").add("is_top_menu.menu_navigator", MenuNavigator);

console.log('[MENU_NAVIGATOR] Component registered as action');
