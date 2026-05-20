import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbGet } from "../../../../lib/sqlite";

const JWT_SECRET = process.env.JWT_SECRET || "plats_du_monde_secret_key";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 });
    }

    const user = await dbGet("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, nom: user.nom, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, nom: user.nom, email: user.email },
    }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
