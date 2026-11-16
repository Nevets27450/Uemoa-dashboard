# Audit avant publication — 16 novembre 2026

## Verdict

Les contrôles de structure et les tests DAX exécutés sur le modèle Power BI Desktop réussissent. La validation visuelle complète reste à effectuer après réouverture du projet corrigé. Les sources d’origine et les conditions de réutilisation des CSV restent inconnues ; les données ne doivent pas être ajoutées au dépôt en l’état.

## Résultats réellement vérifiés

| Contrôle | Résultat |
|---|---|
| Actualisation XMLA complète des deux tables source | Réussie |
| Pays / années / observations | 8 / 65 (1960–2024) / 520 |
| Doublons pays–année | 0 |
| Population totale ≠ masculine + féminine, tolérance 1 | 0 |
| Classements : 8 pays × 65 années × 4 indicateurs | 2 080 cas, 0 rang invalide |
| Exclusivité des séries Bénin / autres pays | 2 080 cas, 0 erreur |
| PIB, population et quotient PIB/population par pays–année | 520 cas, 0 écart aux tolérances testées |
| Agrégats régionaux par année | 65 cas, aucun résultat manquant/non positif testé |
| Carte sur sélection 2023–2024 | Identique à 2024, sans cumul des années |
| Format du PIB régional | `221,7 Md USD` |
| Année du SMIG après correction et actualisation | 2025 |
| Rapport enregistré | 6 pages, 87 objets visuels, 37 liens de navigation valides |
| Références de colonnes/mesures et interactions | Aucune référence cassée détectée |
| Limites du canevas | Aucun objet hors page détecté |
| JSON rapport/pages/visuels | 94 fichiers valides ; les objets 2.14 sont contrôlés sur la structure compatible 2.13 disponible |
| Recherche de motifs de secrets courants dans le projet | Aucun motif détecté ; ce contrôle n’est pas un audit de sécurité exhaustif |

Le modèle contient 3 tables, 23 mesures et une relation unidirectionnelle plusieurs-à-un par pays. Les deux anciennes mesures vides sont masquées et retournent explicitement BLANK().

## Repères 2024 après actualisation

- PIB régional : **221 709 832 052,46 USD**.
- Population : **151 675 314**.
- PIB par habitant régional : **1 461,74 USD**.
- Importations régionales pondérées : **29,8337 % du PIB**.
- Exportations régionales pondérées : **26,3250 % du PIB**.
- Rangs du Bénin : PIB **5**, PIB par habitant **3**, importations **7**, exportations **7**.

Ces résultats vérifient les calculs sur les fichiers disponibles ; ils ne constituent pas une validation externe de la fiabilité des données d’origine.

## Corrections apportées

- Anciennes mesures PIB, PIB/habitant et commerce alignées sur les mesures actuellement utilisées. Classements protégés contre les valeurs manquantes ; narratif sans année courante fictive ni référence à une couleur rouge.
- Suppression du recodage artificiel de 2025 en 2024 dans la source SMIG. Millésimes explicités dans la page revenus.
- Sources regroupées sous le paramètre Power Query `DossierDonnees`. Import numérique direct avec culture en-US, sans passage intermédiaire par Currency.Type et arrondi à quatre décimales.
- Colonnes de ratios configurées sans sommation implicite ; unités héritées du modèle, formats locaux trompeurs retirés.
- SMIG affiché via une mesure explicite avec unité USD et taux fixe documenté.
- Interactions croisées désactivées entre les huit courbes, entre les graphiques de revenus et du classement vers les cartes fixes du Bénin. Sélecteurs conservés.
- Huit inscriptions de visuels personnalisés inutilisés retirées ; le nuage de points choisi par l’utilisateur est conservé.
- Documentation réécrite pour les six pages existantes ; aucune page Méthode recréée. CSV exclus de Git.

## Ce qui reste à faire avant de présenter le dashboard comme entièrement validé

1. Fermer le rapport actuellement ouvert **sans réenregistrer son ancienne définition de rapport**, puis rouvrir `Uemoa.pbip`. Les modifications du modèle ont été testées en direct et exportées ; les derniers réglages des visuels et interactions sont dans les fichiers PBIR.
2. Vérifier à l’écran : navigation des six pages, sélecteurs d’année, quatre indicateurs du Focus Bénin, légende doré/vert, lecture des étiquettes et chargement du nuage de points personnalisé.
3. Vérifier les nouvelles interactions : un clic sur un pays dans le classement ne vide pas les cartes du Bénin ; les huit courbes restent visibles.
4. Retrouver les URL et conditions de réutilisation avant de publier les CSV. Le projet source peut être versionné avec les limites du README ; un clone sans données ne sera pas immédiatement exploitable.

La capture Windows a échoué à deux reprises (`window capture timed out`). Aucun contrôle du rendu effectif n’est donc revendiqué. Les tests DAX ont été exécutés sur l’instance Desktop ouverte, pas simulés.

## Fichiers à inclure dans un commit UEMOA

Le dépôt autonome contient les dossiers `Uemoa.Report` et `Uemoa.SemanticModel`, `Uemoa.pbip`, la documentation, les tests, `tools/audit-uemoa.cjs` et `.gitignore`. Les anciens scripts de transformation et les autres projets du dossier de travail ne font pas partie de ce dépôt.

Rejouer les contrôles structurels avec `node tools/audit-uemoa.cjs`. Les requêtes DAX reproductibles sont dans `tests/audit.dax`. Aucun commit ni push n’a été effectué.
