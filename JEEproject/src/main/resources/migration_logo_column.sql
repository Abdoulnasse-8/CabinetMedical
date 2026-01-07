-- Migration SQL pour modifier la colonne logo de TEXT à LONGTEXT
-- À exécuter une seule fois dans votre base de données MySQL

USE cabinet_medical;

-- Vérifier si la colonne existe et modifier son type
ALTER TABLE cabinets MODIFY COLUMN logo LONGTEXT;

-- Vérifier le résultat
DESCRIBE cabinets;


