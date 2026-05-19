const sqlite3 = require("sqlite3").verbose();
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "recettes.db");

let db: any = null;

function runMigrations(database: any) {
  database.serialize(() => {
    database.run(`CREATE TABLE IF NOT EXISTS recettes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      pays TEXT NOT NULL,
      region TEXT,
      continent TEXT,
      type TEXT,
      regime TEXT,
      description TEXT,
      piquant INTEGER DEFAULT 0,
      temps INTEGER DEFAULT 30
    )`);

    // Migrations : ajout des colonnes si elles n'existent pas encore
    database.run(`ALTER TABLE recettes ADD COLUMN regime TEXT`, () => {});
    database.run(`ALTER TABLE recettes ADD COLUMN ingredients TEXT`, () => {});
    database.run(`ALTER TABLE recettes ADD COLUMN etapes TEXT`, () => {});
    database.run(`ALTER TABLE recettes ADD COLUMN image TEXT`, () => {});

    database.run(
      `CREATE TABLE IF NOT EXISTS avis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recette_id INTEGER NOT NULL,
        auteur TEXT DEFAULT 'Anonyme',
        note INTEGER NOT NULL CHECK(note BETWEEN 1 AND 5),
        commentaire TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recette_id) REFERENCES recettes(id) ON DELETE CASCADE
      )`,
      (err: any) => {
        if (err) console.error("Erreur création table avis:", err);
        else console.log("✅ Tables initialisées");
      }
    );
  });
}

export function getDB(): any {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err: any) => {
      if (err) console.error("Erreur connexion SQLite:", err);
      else {
        console.log("✅ Connecté à SQLite");
        runMigrations(db);
      }
    });
  }
  return db;
}

export function initDB(): Promise<void> {
  return new Promise((resolve) => {
    getDB();
    resolve();
  });
}

export function closeDB() {
  if (db) {
    db.close((err: any) => {
      if (err) console.error("Erreur fermeture BD:", err);
    });
    db = null;
  }
}
