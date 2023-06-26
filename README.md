# Summer Olympics Medals Dashboard

https://github.com/JoshuaBonacorsi/SummerOlympicsMedals

## Présentation

Le projet a pour objectif de créer un site web interactif pour visualiser des données. 
Le site permet de naviguer à travers les données et d'explorer différents aspects du sujet à l'aide de graphiques interactifs.

## Dataset

Le dataset utilisé est le "Summer Olympics Medals" dataset sur Kaggle. 

Il provient de https://www.kaggle.com/datasets/divyansh22/summer-olympics-medals, avec des informations sur les médaillés des jeux olympiques d'été entre 1976 et 2008. Le dataset a été prétraité et nettoyé en python avant d'être utilisé pour le site web.

## Librairies utilisées

Le site web utilise les librairies suivantes :

- D3.js : pour la création de graphiques interactifs
- DC.js : pour la création de tableaux de bord interactifs
- Crossfilter : pour l'agrégation et la manipulation de données

## Fonctionnement du site

Le site web permet à l'utilisateur de visualiser les données à travers différents graphiques interactifs. Les graphiques peuvent être filtrés et triés en utilisant des menus déroulants et des curseurs, pour explorer différents aspects des données.
Le site propose également des tableaux de bord interactifs, qui permettent de visualiser les données sous forme de tableaux, de graphiques et de cartes. 
Les tableaux de bord peuvent être personnalisés pour répondre aux besoins de l'utilisateur.

Pour utiliser le site web, l'utilisateur doit simplement naviguer sur le site et cliquer sur les graphiques afin de filtrer les résultats selon certaines dimensions (pays, type de médailles...). Les graphiques et les tableaux de bord se mettent à jour en temps réel en fonction des choix de l'utilisateur. 

## Installation et exécution

Toutes les librairies sont stockées en local dans les fichiers du projets.

Il suffit uniquement d'avoir Flask d'installé sur son ordinateur, et de faire un "python app.py" dans le répertoire "Summer Olympics Medals"
