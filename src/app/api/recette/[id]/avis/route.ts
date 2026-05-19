import { NextResponse } from "next/server";
import { getDB } from "../../../../../lib/sqlite";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = getDB();

    return new Promise((resolve) => {
      db.all(
        `SELECT *, strftime('%d/%m/%Y', created_at) as date_format
         FROM avis WHERE recette_id = ? ORDER BY created_at DESC`,
        [id],
        (err: Error | null, rows: any[]) => {
          if (err) {
            console.error("Erreur lecture avis:", err);
            resolve(NextResponse.json({ message: "Erreur serveur" }, { status: 500 }));
          } else {
            const list = rows || [];
            const moyenne =
              list.length > 0
                ? Math.round((list.reduce((s: number, r: any) => s + r.note, 0) / list.length) * 10) / 10
                : 0;
            resolve(NextResponse.json({ avis: list, moyenne }, { status: 200 }));
          }
        }
      );
    });
  } catch (error) {
    console.error("Erreur:", error);
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

    const db = getDB();

    return new Promise((resolve) => {
      db.run(
        "INSERT INTO avis (recette_id, auteur, note, commentaire) VALUES (?, ?, ?, ?)",
        [id, auteur || "Anonyme", note, commentaire || null],
        function (err: Error | null) {
          if (err) {
            console.error("Erreur insertion avis:", err);
            resolve(NextResponse.json({ message: "Erreur lors de l'ajout de l'avis" }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ message: "Avis ajouté avec succès" }, { status: 201 }));
          }
        }
      );
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
