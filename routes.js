import { Router } from "express";
import { getUser, getUserByEmail, addUser, verifyCredential } from "./utils.js";
import jwt from "jsonwebtoken";
import {
  validateTokenMiddleware,
  verifyCredentialsMiddleware,
} from "./middlewares.js";
const router = Router();

router.get("/usuarios/list", validateTokenMiddleware, async (req, res) => {
  const usuarios = await getUser();
  res.json(usuarios);
});

router.post("/usuarios", async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    await addUser(email, password, rol, lenguage);
    res.send("Usuario creado con éxito");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/login", verifyCredentialsMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    await verifyCredential(email, password);
    const token = jwt.sign({ email }, "az_AZ");
    res.send({ token });
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

router.get("/usuarios", validateTokenMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    console.log({ email });
    const usuario = await getUserByEmail(email);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    delete usuario.password;

    res.json([usuario]);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error.message);
  }
});

export default router;
