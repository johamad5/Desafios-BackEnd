const saveUserSession = (req, res) => {
	const username = req.body.username;
	req.session.username = username;
	return res.redirect(`/`);
};

const showMainPage = (req, res) => {
	const username = req.session?.username;
	res.render('pages/main.ejs', { title: 'Listado', username });
};

const showLogin = (req, res) => {
	res.redirect(`/`);
};

const logoutUser = (req, res) => {
	const username = req.session.username;

	req.session.destroy((err) => {
		if (err) {
			return res.send({ status: 'Logout ERROR', body: err });
		} else {
			res.render('pages/logout.ejs', { username });
		}
	});
};

export { saveUserSession, showMainPage, showLogin, logoutUser };
