import { NextResponse } from "next/server";
import { dbGet, dbRun } from "../../../../lib/sqlite";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recette = await dbGet("SELECT * FROM recettes WHERE id = ?", [id]);

    if (!recette) {
      return NextResponse.json({ message: "Recette non trouvée" }, { status: 404 });
    }

    return NextResponse.json(recette, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { nom, pays, region, continent, type, regime, description, ingredients, etapes, image, difficulty, temps } = body;

    if (!nom || !pays) {
      return NextResponse.json({ message: "Les champs nom et pays sont requis" }, { status: 400 });
    }

    const result = await dbRun(
      "UPDATE recettes SET nom = ?, pays = ?, region = ?, continent = ?, type = ?, regime = ?, description = ?, ingredients = ?, etapes = ?, image = ?, difficulty = ?, temps = ? WHERE id = ?",
      [nom, pays, region || null, continent || null, type || null, regime || null, description || null,
       ingredients ? JSON.stringify(ingredients) : null,
       etapes ? JSON.stringify(etapes) : null,
       image || null, difficulty || 0, temps || 30, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ message: "Recette non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recette mise à jour avec succès" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const result = await dbRun("DELETE FROM recettes WHERE id = ?", [id]);

    if (result.changes === 0) {
      return NextResponse.json({ message: "Recette non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recette supprimée avec succès" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
