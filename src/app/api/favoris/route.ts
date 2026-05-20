import { NextResponse } from "next/server";
import { dbAll, dbRun } from "../../../lib/sqlite";
import { verifyToken } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    const user = verifyToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const rows = await dbAll("SELECT recette_id FROM favoris WHERE user_id = ?", [user.id]);
    const ids = rows.map((r) => r.recette_id);

    return NextResponse.json({ favoris: ids }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = verifyToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const { recette_id } = await request.json();
    if (!recette_id) {
      return NextResponse.json({ message: "recette_id requis" }, { status: 400 });
    }

    await dbRun("INSERT OR IGNORE INTO favoris (user_id, recette_id) VALUES (?, ?)", [user.id, recette_id]);

    return NextResponse.json({ message: "Favori ajouté" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
