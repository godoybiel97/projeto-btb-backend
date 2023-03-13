import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

// app.get("/", (req, res) => {
//     return res.json({message: "Ok"})
// })

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => console.log(`Servidor inicializado na porta ${PORT}`));
