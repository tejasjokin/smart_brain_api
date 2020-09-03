const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'a8f4d09f5a0144f5916be877868f9492'
});

const handleApiCall = (req, res) => {
	app.models.predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('Couldn\'t fetch Face API'));
}

const handleImage = (req, res, db) => {
	const {id} = req.body;
	db('users')
	.where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('Unable to get entries.'));
}

module.exports = {
	handleImage,
	handleApiCall
}