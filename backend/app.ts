import express from "express";
import path from "path";
import { router } from "./routes/router"

require("dotenv").config();

const cors = require('cors');

const port = process.env.PORT;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({origin: "http://localhost:5173"}));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
