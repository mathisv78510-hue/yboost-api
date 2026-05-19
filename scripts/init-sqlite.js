const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "recettes.db");

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Erreur connexion BD:", err);
    process.exit(1);
  }
});

const seedRecettes = [
  { nom: "Spaghetti Carbonara", pays: "Italie", region: "Rome", continent: "Europe", type: "Plat principal", description: "Pâtes à la crème d'œuf et guanciale.", piquant: 0, temps: 25 },
  { nom: "Sushi", pays: "Japon", region: "Tokyo", continent: "Asie", type: "Entrée", description: "Riz vinaigré avec poisson cru.", piquant: 1, temps: 30 },
  { nom: "Tacos", pays: "Mexique", region: "Mexico", continent: "Amérique", type: "Street food", description: "Tortillas garnies de viande et légumes.", piquant: 3, temps: 15 },
];

// Créer la table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS recettes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      pays TEXT NOT NULL,
      region TEXT,
      continent TEXT,
      type TEXT,
      description TEXT,
      piquant INTEGER DEFAULT 0,
      temps INTEGER DEFAULT 30
    )`
  );

  // Insérer les données
  const insert = db.prepare("INSERT INTO recettes (nom, pays, region, continent, type, description, piquant, temps) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

  for (const recette of seedRecettes) {
    insert.run(recette.nom, recette.pays, recette.region, recette.continent, recette.type, recette.description, recette.piquant, recette.temps);
  }

  // Finaliser le statement avant de fermer
  insert.finalize((err) => {
    if (err) {
      console.error("❌ Erreur finalize:", err);
    } else {
      console.log("✅ Base de données SQLite initialisée");
      console.log(`📁 Fichier: ${DB_PATH}`);
      console.log(`📊 Documents insérés: ${seedRecettes.length}`);
    }

    // Fermer la BD une fois tout finalisé
    db.close((err) => {
      if (err) {
        console.error("❌ Erreur fermeture BD:", err);
        process.exit(1);
      }
    });
  });
});
