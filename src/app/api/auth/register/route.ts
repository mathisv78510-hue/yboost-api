import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbGet, dbRun } from "../../../../lib/sqlite";

const JWT_SECRET = process.env.JWT_SECRET || "plats_du_monde_secret_key";

export async function POST(request: Request) {
  try {
    const { nom, email, password } = await request.json();

    if (!nom || !email || !password) {
      return NextResponse.json({ message: "Nom, email et mot de passe sont requis" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Le mot de passe doit faire au moins 6 caractères" }, { status: 400 });
    }

    const existing = await dbGet("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbRun(
      "INSERT INTO users (nom, email, password) VALUES (?, ?, ?)",
      [nom, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.lastID, nom, email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Compte créé avec succès",
      token,
      user: { id: result.lastID, nom, email },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
