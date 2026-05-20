import { NextResponse } from "next/server";
import { dbRun } from "../../../../lib/sqlite";
import { verifyToken } from "../../../../lib/auth";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = verifyToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbRun("DELETE FROM favoris WHERE user_id = ? AND recette_id = ?", [user.id, id]);

    return NextResponse.json({ message: "Favori supprimé" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
