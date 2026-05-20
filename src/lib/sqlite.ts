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
      difficulty INTEGER DEFAULT 0,
      temps INTEGER DEFAULT 30
    )`);

    // Migrations ajout des colonnes si elles n'existent pas encore
    database.run(`ALTER TABLE recettes ADD COLUMN regime TEXT`, () => {});
    database.run(`ALTER TABLE recettes ADD COLUMN ingredients TEXT`, () => {});
    database.run(`ALTER TABLE recettes ADD COLUMN etapes TEXT`, () => {});
    database.run(`ALTER TABLE recettes ADD COLUMN image TEXT`, () => {});
    database.run(`ALTER TABLE recettes ADD COLUMN difficulty INTEGER DEFAULT 0`, () => {});
    // Migration des données : copie piquant → difficulty pour les anciennes lignes
    database.run(`UPDATE recettes SET difficulty = piquant WHERE difficulty = 0 AND piquant > 0`, () => {});

    database.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err: any) => {
      if (err) console.error("Erreur création table users:", err);
    });

    database.run(
      `CREATE TABLE IF NOT EXISTS avis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recette_id INTEGER NOT NULL,
        user_id INTEGER,
        auteur TEXT DEFAULT 'Anonyme',
        note INTEGER NOT NULL CHECK(note BETWEEN 1 AND 5),
        commentaire TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recette_id) REFERENCES recettes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`,
      (err: any) => {
        if (err) console.error("Erreur création table avis:", err);
      }
    );

    database.run(`ALTER TABLE avis ADD COLUMN user_id INTEGER`, () => {});

    database.run(
      `CREATE TABLE IF NOT EXISTS favoris (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        recette_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, recette_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recette_id) REFERENCES recettes(id) ON DELETE CASCADE
      )`,
      (err: any) => {
        if (err) console.error("Erreur création table favoris:", err);
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

// Récupère plusieurs lignes
export function dbAll(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    getDB().all(sql, params, (err: any, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Récupère une seule ligne
export function dbGet(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    getDB().get(sql, params, (err: any, row: any) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

// INSERT / UPDATE / DELETE
export function dbRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    getDB().run(sql, params, function (this: any, err: any) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
