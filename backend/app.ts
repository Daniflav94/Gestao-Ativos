import express from "express";
import path from "path";
import { router } from "./routes/router"

require("dotenv").config();

const cors = require('cors');

const port = process.env.PORT;

const app = express();


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

app.use(cors({origin: "gestao-ativos-smoky.vercel.app"}));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
