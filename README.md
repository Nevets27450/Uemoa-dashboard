# UEMOA — Explorer les économies

Projet Power BI PBIP issu d’un challenge d’analyse exploratoire. Six pages : Accueil, Vue d’ensemble, Évolution, Revenus & repères, Commerce extérieur et Focus Bénin.

## Ouvrir et actualiser

1. Utiliser une version récente de Power BI Desktop compatible PBIP/PBIR.
2. Conserver `Uemoa.Report`, `Uemoa.SemanticModel` et `Uemoa.pbip` côte à côte, puis ouvrir `Uemoa.pbip`.
3. Dans Transformer les données → Gérer les paramètres, renseigner **DossierDonnees** avec le chemin absolu du dossier contenant `donnees_uemoa_large.csv` et `smig_uemoa_2025.csv`.
4. Actualiser. Sans les CSV locaux, un clone neuf ne permet pas de charger les données ; le cache `.pbi` est exclu de Git.

Le nuage de points est le visuel personnalisé `sdmpbiscatter7ECA4FA316914C4B866A0CF7AD36E312`. Son chargement dépend du réseau et des règles de l’organisation. Les autres graphiques sont natifs.

## Données et limites

| Fichier | Périmètre | Provenance |
|---|---|---|
| `donnees_uemoa_large.csv` | 8 pays, 1960–2024, 520 observations pays/année | Téléchargement en ligne ; URL et conditions de réutilisation non retrouvées |
| `smig_uemoa_2025.csv` | 8 pays, année 2025 indiquée dans le fichier | Téléchargement en ligne ; URL et conditions de réutilisation non retrouvées |

Les CSV ne sont pas distribués dans ce dépôt. Retrouver les sources et les conditions de réutilisation avant d’y ajouter les données. Les dates et montants du SMIG n’ont pas été vérifiés auprès d’une source externe.

Le nom technique `smig_uemoa_2024` est conservé pour la compatibilité. Ses données gardent désormais **2025**, sans recodage vers 2024. La page revenus présente explicitement deux millésimes : SMIG 2025 et PIB par habitant 2024.

Le SMIG annuel en USD utilise une annualisation ×12 et un taux fixe historique de **564,98 FCFA/USD**, pas un taux courant. Le PIB est en USD courants : les courbes ne mesurent pas la croissance réelle. Le PIB par habitant n’est pas une mesure de salaire ou d’inégalité.

## Calculs

- Cartes : dernière année sélectionnée ; une sélection 2023–2024 affiche 2024, sans additionner les années.
- Courbes : contexte annuel propre à chaque point.
- PIB par habitant régional : somme des PIB / somme des populations.
- Ratios commerciaux régionaux : pourcentages pondérés par le PIB ; les sources sont déjà sur l’échelle 0–100.
- Classements : valeurs décroissantes, rang 1 = plus grande valeur ; blancs exclus, ex aequo avec sauts de rang.
- Focus Bénin : série dorée réservée au Bénin, série verte pour les autres pays. Un rang élevé des importations ne signifie pas une meilleure performance économique.

## Contrôles et GitHub

Depuis la racine : `node tools/audit-uemoa.cjs`. Le script vérifie les références, les liens, les interactions et les limites des pages. Les tests réellement exécutés dans Power BI sont consignés dans [AUDIT.md](AUDIT.md).

Ce dépôt contient uniquement le projet UEMOA, sa documentation et ses contrôles. Les CSV, caches Power BI et secrets sont exclus par `.gitignore`. Aucun commit ni push n’est effectué par les scripts d’audit.
