// controllers/BasicController.js
module.exports = {
	home: (req, res) => {
		res.send("This is the home page");
	},
	about: (req, res) => {
		res.send("This is the about page");
	},
    submit: (req, res) => {
		const userData = req.body;
		res.send(`Data received: ${JSON.stringify(userData)}`);
	},
};
