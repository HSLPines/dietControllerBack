import appsettings = require("./appsettings");
import express = require("express");
import { init } from "./data/sql";

const app = express();

// Não queremos o header X-Powered-By
app.disable("x-powered-by");
// Não queremos o header ETag nas views
app.disable("etag");

app.use(require("cookie-parser")());
app.use(require("compression")());

app.use(express.json({ limit: 10485760, inflate: true, strict: false })); // http://expressjs.com/en/api.html#express.json
app.use(express.urlencoded({ limit: 10485760, inflate: true, extended: true })); // http://expressjs.com/en/api.html#express.urlencoded

// Nosso middleware para evitar cache das páginas e api
// (deixa depois do static, pois os arquivos static devem usar cache e coisas)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
	res.header("Expires", "-1");
	res.header("Pragma", "no-cache");
	next();
});

app.use("/", require("./routes/index"));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.status(err.status || 500);
	res.json(err.status == 404 ? "Não encontrado" : (err.message || err.toString()));
});

async function iniciar() {
	init(appsettings.sqlPool);

	const server = app.listen(appsettings.port, appsettings.localIp, () => {
		console.log(`Express server listening on port: ${appsettings.localIp}:${appsettings.port}`);
	});
}

iniciar().catch(console.error);
