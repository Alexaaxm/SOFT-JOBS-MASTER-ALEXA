import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { loggerMiddleware } from "./middlewares.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(loggerMiddleware);
app.use("/", routes);

app.listen(3000, console.log("¡Servidor encendido!"));
