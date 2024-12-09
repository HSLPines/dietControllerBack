
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

// CREATE - Criar uma nova refeição
router.post("/", wrap(async (req: { body: { usuario_id: any; nome: any; data_hora: any; alimentos: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: any; message?: string; refeicaoId?: any; }): void; new(): any; }; }; }) => {
    
    const { usuario_id, nome, data_hora, alimentos } = req.body;

    if (!usuario_id || !nome || !data_hora || !alimentos) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const conn = await pool.getConnection();
    try {

        await conn.beginTransaction();

        // Insere a refeição
        const [refeicaoResult] = await conn.query(
            `INSERT INTO Refeicao (usuario_id, nome, data_hora) VALUES (?, ?, ?)`,
            [usuario_id, nome, data_hora]
        );

        const refeicaoId = (refeicaoResult as any).insertId;

        // Insere os alimentos relacionados à refeição
        for (const alimento of alimentos) {

            const { alimento_id, quantidade } = alimento;
            if (!alimento_id || !quantidade) {
                throw new Error("Campos alimento_id e quantidade são obrigatórios para cada alimento.");
            }

            await conn.query(
                `INSERT INTO Refeicao_Alimento (refeicao_id, alimento_id, quantidade) VALUES (?, ?, ?)`,
                [refeicaoId, alimento_id, quantidade]
            );

        }

        await conn.commit();
        res.status(201).json({ message: "Refeição criada com sucesso!", refeicaoId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: (err as Error).message });
    } finally {
        conn.release();

    }
}));

// READ - Listar todas as refeições de um usuário
router.get("/usuario/:usuario_id", wrap(async (req: { params: { usuario_id: any; }; }, res: { json: (arg0: mysql.QueryResult) => void; }) => {
    
    const { usuario_id } = req.params;

    const [refeicoes] = await pool.query(

        `SELECT * FROM Refeicao WHERE usuario_id = ? ORDER BY data_hora DESC`,
        [usuario_id]

    );

    res.json(refeicoes);

}));

// READ - Buscar detalhes de uma refeição específica
router.get("/:id", wrap(async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { refeicao: any; alimentos: mysql.QueryResult; }) => void; }) => {
    const { id } = req.params;

    const [refeicao]: [any[], any] = await pool.query(

        `SELECT * FROM Refeicao WHERE id = ?`,
        [id]

    );

    if (refeicao.length === 0) {
        return res.status(404).json({ error: "Refeição não encontrada." });
    }

    const [alimentos] = await pool.query(

        `SELECT a.id, a.nome, ra.quantidade 
         FROM Refeicao_Alimento ra 
         JOIN Alimento a ON ra.alimento_id = a.id 
         WHERE ra.refeicao_id = ?`,
        [id]

    );

    res.json({ refeicao: refeicao[0], alimentos });

}));

// UPDATE - Atualizar uma refeição
router.put("/:id", wrap(async (req: { params: { id: any; }; body: { nome: any; data_hora: any; alimentos: any; }; }, res: { json: (arg0: { message: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; }): void; new(): any; }; }; }) => {
    const { id } = req.params;
    const { nome, data_hora, alimentos } = req.body;

    const conn = await pool.getConnection();
    try {

        await conn.beginTransaction();

        // Atualiza os dados da refeição
        await conn.query(

            `UPDATE Refeicao SET nome = ?, data_hora = ? WHERE id = ?`,
            [nome, data_hora, id]

        );

        // Remove os alimentos antigos relacionados à refeição
        await conn.query(`DELETE FROM Refeicao_Alimento WHERE refeicao_id = ?`, [id]);

        // Insere os novos alimentos relacionados à refeição
        for (const alimento of alimentos) {

            const { alimento_id, quantidade } = alimento;
            if (!alimento_id || !quantidade) {
                throw new Error("Campos alimento_id e quantidade são obrigatórios para cada alimento.");
            }

            await conn.query(
                `INSERT INTO Refeicao_Alimento (refeicao_id, alimento_id, quantidade) VALUES (?, ?, ?)`,
                [id, alimento_id, quantidade]
            );

        }

        await conn.commit();
        res.json({ message: "Refeição atualizada com sucesso!" });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: (err as Error).message });
    } finally {
        conn.release();
    }

}));

// DELETE - Deletar uma refeição
router.delete("/:id", wrap(async (req: { params: { id: any; }; }, res: { json: (arg0: { message: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; }): void; new(): any; }; }; }) => {
    
    const { id } = req.params;

    const conn = await pool.getConnection();
    try {

        await conn.beginTransaction();

        // Remove os alimentos relacionados à refeição
        await conn.query(`DELETE FROM Refeicao_Alimento WHERE refeicao_id = ?`, [id]);

        // Remove a refeição
        const [result] = await conn.query(`DELETE FROM Refeicao WHERE id = ?`, [id]);

        if ((result as any).affectedRows === 0) {
            throw new Error("Refeição não encontrada.");
        }

        await conn.commit();
        res.json({ message: "Refeição deletada com sucesso!" });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: (err as Error).message });
    } finally {
        conn.release();
    }

}));

export = router;
