import jwt from "jsonwebtoken";

export const loggerMiddleware = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
};

export const verifyCredentialsMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Faltan email o password");
  }
  next();
};

export const validateTokenMiddleware = (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).send("Token no proporcionado");
    }
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, "az_AZ");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Token inválido o expirado");
  }
};
