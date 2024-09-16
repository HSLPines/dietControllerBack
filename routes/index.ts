import express = require("express");
import wrap = require("../utils/wrap");

const router = express.Router();

router.get("/", wrap(async (req: express.Request, res: express.Response) => {
	res.json("Oi, mundo!");
}));

export = router;
