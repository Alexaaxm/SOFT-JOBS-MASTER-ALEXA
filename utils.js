import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "softjobs",
  allowExitOnIdle: true,
});

export const addUser = async (email, password, rol, lenguage) => {
  try {
    const passwordEncriptada = bcrypt.hashSync(password, 10);
    const values = [email, passwordEncriptada, rol, lenguage];

    const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
    await pool.query(consulta, values);

    console.log("Usuario agregado");
  } catch (error) {
    console.error("Error al agregar usuario:", error.message);
    throw new Error("No se pudo agregar el usuario.");
  }
};

export const getUser = async (id = null) => {
  try {
    const consulta = id
      ? "SELECT * FROM usuarios WHERE id = $1"
      : "SELECT * FROM usuarios";
    const values = id ? [id] : [];
    const { rows } = await pool.query(consulta, values);
    return rows;
  } catch (error) {
    console.error("Error al obtener el usuario:", error.message);
    throw new Error("No se pudo obtener el usuario.");
  }
};

export const getUserByEmail = async (email) => {
  try {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(consulta, values);
    if (rows.length > 0) {
      return rows[0];
    } else {
      throw new Error("No se pudo obtener el usuario.");
    }
  } catch (error) {
    throw new Error("No se pudo obtener el usuario.");
  }
};

export const verifyCredential = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" };
  return true;
};
