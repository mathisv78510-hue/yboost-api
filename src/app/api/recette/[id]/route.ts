import { NextResponse } from "next/server";
import { getDB } from "../../../../lib/sqlite";

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const db = getDB();

    return new Promise((resolve) => {
      db.get("SELECT * FROM recettes WHERE id = ?", [id], (err: Error | null, row: any) => {
        if (err) {
          console.error("Erreur:", err);
          resolve(
            NextResponse.json({ message: "Erreur lors de la lecture de la recette" }, { status: 500 })
          );
        } else if (!row) {
          resolve(
            NextResponse.json({ message: "Recette non trouvée" }, { status: 404 })
          );
        } else {
          resolve(NextResponse.json(row, { status: 200 }));
        }
      });
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ message: "Erreur lors de la lecture de la recette" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const { nom, pays, region, continent, type, regime, description, ingredients, etapes, image, piquant, temps } = body;

    if (!nom || !pays) {
      return NextResponse.json(
        { message: "Les champs nom et pays sont requis" },
        { status: 400 }
      );
    }

    const db = getDB();

    return new Promise((resolve) => {
      db.run(
        "UPDATE recettes SET nom = ?, pays = ?, region = ?, continent = ?, type = ?, regime = ?, description = ?, ingredients = ?, etapes = ?, image = ?, piquant = ?, temps = ? WHERE id = ?",
        [nom, pays, region || null, continent || null, type || null, regime || null, description || null,
         ingredients ? JSON.stringify(ingredients) : null,
         etapes ? JSON.stringify(etapes) : null,
         image || null, piquant || 0, temps || 30, id],
        function (this: any, err: Error | null) {
          if (err) {
            console.error("Erreur update:", err);
            resolve(
              NextResponse.json(
                { message: "Erreur lors de la mise à jour" },
                { status: 500 }
              )
            );
          } else if (this.changes === 0) {
            resolve(
              NextResponse.json(
                { message: "Recette non trouvée" },
                { status: 404 }
              )
            );
          } else {
            resolve(
              NextResponse.json(
                { message: "Recette mise à jour avec succès", id, nom, pays },
                { status: 200 }
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

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const db = getDB();

    return new Promise((resolve) => {
      db.run(
        "DELETE FROM recettes WHERE id = ?",
        [id],
        function (this: any, err: Error | null) {
          if (err) {
            console.error("Erreur delete:", err);
            resolve(
              NextResponse.json(
                { message: "Erreur lors de la suppression" },
                { status: 500 }
              )
            );
          } else if (this.changes === 0) {
            resolve(
              NextResponse.json(
                { message: "Recette non trouvée" },
                { status: 404 }
              )
            );
          } else {
            resolve(
              NextResponse.json(
                { message: "Recette supprimée avec succès" },
                { status: 200 }
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