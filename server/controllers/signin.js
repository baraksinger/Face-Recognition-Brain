const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if( !email, !password) {
        return res.status(400).json('incorrect form submission')
    }
    db('login').where({email})
        .then((login) => {
            if (bcrypt.compareSync(password, login[0].hash)) {
                db('users').where({email})
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('error fetching user'))
            } else {
                res.status(400).json('wrong creddentials');
            }
        })
        .catch(err => {
            res.status(400).json('error logging in - wrong creddentials')
        })
}
module.exports = {
    handleSignin: handleSignin
}