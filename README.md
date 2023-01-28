# Easyshare

- [Pre-requis](#pre-requis)
- [Installer le projet](#installer-le-projet)
- [Demarrer le projet](#demarrer-le-projet)

## Pre-requis
- Avoir [Docker](https://www.docker.com), sinon l'installer selon le système de votre machine. 

## Installer le projet
- Cloner le projet sur votre machine via SSH (idéalement) ou HTTPS :
  - si SSH : 
    ```
    git clone git@github.com:mathcovax/easyshare.git
    ```
  - si HTTPS :
    ```
    git clone https://github.com/mathcovax/easyshare.git
    ```

## Demarrer le projet
- Lancer Docker
- Lancer le projet via cette commande :
  ```
  docker composer up -d
  ```
  L'installation des dépendances du projet seront lancés automatiquement.
- Lancer un navigateur sur `localhost:8080`.
