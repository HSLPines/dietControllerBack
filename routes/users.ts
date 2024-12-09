
import express = require("express");
import mysql = require("mysql2/promise");
import wrap = require("../../utils/wrap");

const router = express.Router();

const pool = mysql.createPool({

    host: "localhost",
    user: "root",
    password: "root",
    database: "DietController",

});

// CREATE - Criar um novo usuário
router.post("/", wrap(async (req: { body: { nome: any; email: any; senha: any; sexo: any; idade: any; altura: any; peso: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; id?: any; message?: string; }): void; new(): any; }; }; }) => {

    const { nome, email, senha, sexo, idade, altura, peso } = req.body;

    if (!nome || !email || !senha || !sexo || !idade || !altura || !peso) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const [result]: any = await pool.query(

        `INSERT INTO Usuario (nome, email, senha, sexo, idade, altura, peso) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nome, email, senha, sexo, idade, altura, peso]

    );

    res.status(201).json({ id: (result as any).insertId, message: "Usuário criado com sucesso!" });

}));

// READ - Listar todos os usuários
router.get("/", wrap(async (req: any, res: { json: (arg0: mysql.QueryResult) => void; }) => {

    const [rows] = await pool.query("SELECT id, nome, email, sexo, idade, altura, peso, data_criacao FROM Usuario");
    res.json(rows);

}));

// READ - Buscar usuário por ID
router.get("/:id", wrap(async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: any) => void; }) => {

    const { id } = req.params;
    const [rows, fields]: [any, any] = await pool.query("SELECT id, nome, email, sexo, idade, altura, peso, data_criacao FROM Usuario WHERE id = ?", [id]);

    if (rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(rows[0]);

}));

// UPDATE - Atualizar dados do usuário
router.put("/:id", wrap(async (req: { params: { id: any; }; body: { nome: any; email: any; senha: any; sexo: any; idade: any; altura: any; peso: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { message: string; }) => void; }) => {

    const { id } = req.params;
    const { nome, email, senha, sexo, idade, altura, peso } = req.body;

    const [result]: [mysql.ResultSetHeader, any] = await pool.query(

        `UPDATE Usuario SET nome = ?, email = ?, senha = ?, sexo = ?, idade = ?, altura = ?, peso = ? WHERE id = ?`,
        [nome, email, senha, sexo, idade, altura, peso, id]

    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário atualizado com sucesso!" });

}));

// DELETE - Deletar usuário
router.delete("/:id", wrap(async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { message: string; }) => void; }) => {

    const { id } = req.params;

    const [result]: [mysql.ResultSetHeader, any] = await pool.query("DELETE FROM Usuario WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário deletado com sucesso!" });

}));

/*
(async () => {

    const mockUser = {

        nome: "João da Silva",
        email: "joao.silva@example.com",
        senha: "senhaSegura123",
        sexo: "masculino",
        idade: 30,
        altura: 1.75,
        peso: 75.5,

    };

    const [result] = await pool.query(

        `INSERT INTO Usuario (nome, email, senha, sexo, idade, altura, peso) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [mockUser.nome, mockUser.email, mockUser.senha, mockUser.sexo, mockUser.idade, mockUser.altura, mockUser.peso]

    );

    console.log(`Usuário mockado criado com ID: ${result.insertId}`);
    
})();
*/

export = router;
