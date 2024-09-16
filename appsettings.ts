import fs = require("fs");

require("dotenv").config({ encoding: "utf8" });

export = {
	localIp: process.env.app_localIp as string,
    port: parseInt(process.env.app_port as string),
	root: process.env.app_root as string,
	urlSite: process.env.app_urlSite as string,

	sqlPool: {
		connectionLimit: parseInt(process.env.app_sqlPool_connectionLimit as string),
		waitForConnections: !!parseInt(process.env.app_sqlPool_waitForConnections as string),
		charset: process.env.app_sqlPool_charset as string,
		host: process.env.app_sqlPool_host as string,
		port: parseInt(process.env.app_sqlPool_port as string),
		user: process.env.app_sqlPool_user as string,
		password: process.env.app_sqlPool_password as string,
		database: process.env.app_sqlPool_database as string
	},
};
