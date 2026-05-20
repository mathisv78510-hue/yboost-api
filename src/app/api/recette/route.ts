import { NextResponse } from "next/server";
import { dbAll, dbRun } from "../../../lib/sqlite";

export async function GET() {
  try {
    const rows = await dbAll("SELECT * FROM recettes");
    return NextResponse.json(rows, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, pays, region, continent, type, regime, description, ingredients, etapes, image, difficulty, temps } = body;

    if (!nom || !pays) {
      return NextResponse.json({ message: "Les champs nom et pays sont requis" }, { status: 400 });
    }

    await dbRun(
      "INSERT INTO recettes (nom, pays, region, continent, type, regime, description, ingredients, etapes, image, difficulty, temps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nom, pays, region || null, continent || null, type || null, regime || null, description || null,
       ingredients ? JSON.stringify(ingredients) : null,
       etapes ? JSON.stringify(etapes) : null,
       image || null, difficulty || 0, temps || 30]
    );

    return NextResponse.json({ message: "Recette créée avec succès" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
