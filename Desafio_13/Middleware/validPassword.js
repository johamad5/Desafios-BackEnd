export function isValidPassword(user, password) {
	return bCrypt.compareSync(password, user.password);
}
