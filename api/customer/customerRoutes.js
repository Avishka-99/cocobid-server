const path = require('path');
const express = require('express');
const router = express.Router();
const app = express();
const multer = require('multer');
router.use(express.json());
app.use(express.json());
const { INSERT, UPDATE, SELECT, DELETE, QUERY, SELECT_WHERE } = require('../../models/db');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/auction/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage: storage });
router.post('/getauction', (req, res) => {
	const userId = req.body.userId;
	SELECT_WHERE('auction', 'userId', userId).then((response) => {
		console.log(response.length);
		if (response.length > 0) {
			res.send({ type: 'success', data: response })
		} else {
			res.send({ type: 'success', data: response })
		}

	})

})
router.post('/auction', upload.array('file', 5), (req, res) => {
	try {
		const files = req.files;
		const userId = req.body.userId;
		const price = req.body.basePrice;
		const description = req.body.auctionDescription;
		const closedate = new Date(req.body.closingdate);
		const formattedDate = closedate.toISOString().slice(0, 19).replace('T', ' ')
		console.log(formattedDate)
		QUERY("INSERT INTO auction(userId,basePrice,description,closingDate) VALUES('" + userId + "','" + price + "','" + description + "','" + formattedDate + "')").then((response) => {
			const auctionId = response.insertId;
			files.forEach((file) => {
				INSERT('images', '(auction_Id,img_name)', `(${auctionId},'${file.filename}')`)
			})
			res.send({ type: 'success', message: 'Auction Created Successfully' });

		})
	} catch (err) {
		res.send(err)
	}
});
router.post('/createPost', upload.array('image', 5), async (req, res) => {
	try {
	} catch (err) {

	}
});
module.exports = router;
