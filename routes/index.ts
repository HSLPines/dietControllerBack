
import express = require("express");
import usersRouter = require("./users");
import wrap = require("../../utils/wrap");
import refeicoesRouter = require("./refeicoes"); 


const app = express();
app.use(express.json());

app.get("/", wrap(async (req: any, res: { json: (arg0: { message: string; }) => void; }) => {
    res.json({ message: "Bem-vindo ao DietController API!" });
}));

app.use("/usuarios", usersRouter);

app.use("/refeicoes", refeicoesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
