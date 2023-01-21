export function auth(req, res, next) {
	const username = req.session?.username;

	if (username === null || username === undefined) {
		return res.render(`pages/login.ejs`, {});
	}
	return next();
}
