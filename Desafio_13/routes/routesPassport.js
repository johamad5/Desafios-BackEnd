// index
export const getRoot = (req, res) => {
	res.send('Bienvenidos/as');
};

// login
export const getLogin = (req, res) => {
	if (req.isAuthenticated()) {
		let user = req.user;
		consoel.log('Usuario logueado');
		res.render('profileUser', { user });
	} else {
		console.log('User NO logueado');
		res.render('../views/pages/login.ejs');
	}
};

// signup
export const getSignup = (req, res) => {
	res.render('signup');
};

// process login
export const postLogin = (req, res) => {
	var user = req.user;
	res.render('profileUser');
};

// process signup
export const postSignup = (req, res) => {
	var user = req.user;
	res.render('profileUser');
};

export const getFaillogin = (req, res) => {
	console.log('error en login');
	res.render('login-error', {});
};

export const getFailsignup = (req, res) => {
	console.log('error en login');
	res.render('signup-error', {});
};

// logout
export const getLogout = (req, res) => {
	req.logout();
	res.render('index');
};

export const failRoute = (req, res) => {
	res.status(404).render('routing-error', {});
};
