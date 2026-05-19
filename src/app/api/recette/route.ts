import { NextResponse } from "next/server";
import { getDB } from "../../../lib/sqlite";

export function GET() {
  try {
    const db = getDB();

    return new Promise((resolve) => {
      db.all("SELECT * FROM recettes", (err: Error | null, rows: any) => {
        if (err) {
          console.error("Erreur:", err);
          resolve(
            NextResponse.json({ message: "Erreur lors de la lecture des recettes" }, { status: 500 })
          );
        } else {
          resolve(NextResponse.json(rows || [], { status: 200 }));
        }
      });
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ message: "Erreur lors de la lecture des recettes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, pays, region, continent, type, regime, description, ingredients, etapes, image, piquant, temps } = body;

    // Validation
    if (!nom || !pays) {
      return NextResponse.json(
        { message: "Les champs nom et pays sont requis" },
        { status: 400 }
      );
    }

    const db = getDB();

    return new Promise((resolve) => {
      db.run(
        "INSERT INTO recettes (nom, pays, region, continent, type, regime, description, ingredients, etapes, image, piquant, temps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [nom, pays, region || null, continent || null, type || null, regime || null, description || null,
         ingredients ? JSON.stringify(ingredients) : null,
         etapes ? JSON.stringify(etapes) : null,
         image || null, piquant || 0, temps || 30],
        function (err: Error | null) {
          if (err) {
            console.error("Erreur insertion:", err);
            resolve(
              NextResponse.json(
                { message: "Erreur lors de la création de la recette" },
                { status: 500 }
              )
            );
          } else {
            resolve(
              NextResponse.json(
                { message: "Recette créée avec succès", nom, pays },
                { status: 201 }
              )
            );
          }
        }
      );
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}