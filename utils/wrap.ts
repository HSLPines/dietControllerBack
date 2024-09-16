import express = require("express");

export = function wrap(handler: Function): any {
	// Express.js checks the handler's length to determine if it is a regular handler,
	// or an error handler. For a handler to be considered an error handler, it
	// must at most 3 parameters.
	return function(req: express.Request, res: express.Response, next: express.NextFunction) {
		try {
			const r = handler(req, res, next);
			if (r)
				Promise.resolve(r).catch(next);
		} catch (ex: any) {
			next(ex);
		}
	};
};
