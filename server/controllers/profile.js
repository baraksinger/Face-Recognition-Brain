const handleProfile = (req, res, db) => {
    const {id} = req.params;
    db('users').where({id})
    .then(user => {
        if (user.length) {
            return res.json(user[0]);
        }
        res.status(404).json('user not found');
    })
    .catch(err => {
        res.status(404).json('error getting user')
    })
}
module.exports = {
    handleProfile: handleProfile
}