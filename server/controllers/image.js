const clarifai = require('clarifai');

const app = new clarifai.App({
    apiKey: '6c94d0d1f1064bc1bf934138f0039fa5'
});

const handleImage = (req, res) => {
    const {input} = req.body;
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(400).json('unable to work with api');
    })
}

const updateRank = (req, res, db) => {
    const {id} = req.body;
    db('users')
    .where({id})
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.send(entries[0]);
    })
    .catch(err => {
        res.status(400).json('unable to get entries');
    })
}
module.exports = {
    updateRank: updateRank,
    handleImage: handleImage
}