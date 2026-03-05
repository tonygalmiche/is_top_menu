# -*- coding: utf-8 -*-
{
    "name": "Top Menu Navigation",
    "version": "1.0",
    "author": "InfoSaône",
    "category": "InfoSaône",
    "description": """
Top Menu Navigation pour Odoo 16
===================================================
Ce module affiche une page de navigation moderne pour tous les menus principaux d'Odoo.
Permet de voir d'un seul coup d'œil tous les sous-menus disponibles avec une recherche intégrée.
""",
    "maintainer": "InfoSaône",
    "website": "http://www.infosaone.com",
    "depends": [
        "base",
        "web",
        # "is_dynacase2odoo",
    ],
    "data": [
        "views/menu_navigator_view.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "is_top_menu/static/src/css/menu_navigator.css",
            "is_top_menu/static/src/xml/menu_navigator.xml",
            "is_top_menu/static/src/js/menu_navigator.js",
        ],
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    "license": "LGPL-3",
}
