const handleRegister = (req, res, db, bcrypt) => {
	const {email, name, password } = req.body;
	if(!email || !name || !password)
	{
		return res.status(400).json("Incorrect form submission");
	}
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
		return trx('users')
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json('Unable to register.'));
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
}

module.exports = {
	handleRegister: handleRegister
};