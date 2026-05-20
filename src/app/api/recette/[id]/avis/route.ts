import { NextResponse } from "next/server";
import { dbAll, dbRun } from "../../../../../lib/sqlite";
import { verifyToken } from "../../../../../lib/auth";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const rows = await dbAll(
      `SELECT *, strftime('%d/%m/%Y', created_at) as date_format FROM avis WHERE recette_id = ? ORDER BY created_at DESC`,
      [id]
    );

    let moyenne = 0;
    if (rows.length > 0) {
      const total = rows.reduce((sum: number, a: any) => sum + a.note, 0);
      moyenne = Math.round((total / rows.length) * 10) / 10;
    }

    return NextResponse.json({ avis: rows, moyenne }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { auteur, note, commentaire } = body;

    if (!note || note < 1 || note > 5) {
      return NextResponse.json({ message: "La note doit être entre 1 et 5" }, { status: 400 });
    }

    const tokenUser = verifyToken(request.headers.get('Authorization'));
    let userId = null;
    let auteurName = auteur || "Anonyme";
    if (tokenUser) {
      userId = tokenUser.id;
      auteurName = tokenUser.nom;
    }

    await dbRun(
      "INSERT INTO avis (recette_id, user_id, auteur, note, commentaire) VALUES (?, ?, ?, ?, ?)",
      [id, userId, auteurName, note, commentaire || null]
    );

    return NextResponse.json({ message: "Avis ajouté avec succès" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
