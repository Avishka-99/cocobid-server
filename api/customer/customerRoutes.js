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
router.post('/getauction', async (req, res) => {
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
router.post('/auction', upload.array('file', 5), async (req, res) => {
	try {
		const files = req.files;
		const userId = req.body.userId;
		const price = req.body.basePrice;
		const description = req.body.auctionDescription;
		const closedate = new Date(req.body.closingdate);
		const formattedDate = closedate.toISOString().slice(0, 19).replace('T', ' ')
		const city = req.body.city;
		console.log(formattedDate)
		QUERY("INSERT INTO auction(userId,basePrice,description,city,closingDate) VALUES('" + userId + "','" + price + "','" + description + "','" + city + "','" + formattedDate + "')").then((response) => {
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
router.get('/getauctionimages/:id', async (req, res) => {
	QUERY(`SELECT * FROM images WHERE auction_Id=${req.params.id}`).then((response) => {
		res.send({ type: 'success', data: response })
	})
})
router.get('/getauction/:id', async (req, res) => {
	QUERY(`SELECT * FROM auction WHERE Id=${req.params.id}`).then((response) => {
		res.send({ type: 'success', data: response })
	})
})
router.get('/getbidinfo/:id', async (req, res) => {
	QUERY(`SELECT MAX(bid) as max_bid, COUNT(*) AS total_bids FROM bids WHERE auction_Id=${req.params.id}`).then((response) => {
		res.send({ type: 'success', data: response })
	})
})
router.get('/getalluserbids/:id', async (req, res) => {
	QUERY(`SELECT auction.Id,auction.basePrice,auction.city,auction.description,auction.createdDate,auction.closingDate,bids.userId,bids.bid FROM auction INNER JOIN bids ON auction.Id = bids.auction_Id AND bids.userId=${req.params.id}`).then((response) => {
		res.send({ type: 'success', data: response })
	})
})
router.post('/getuserbidforauction', async (req, res) => {
	const userId = req.body.userid
	const aucId = req.body.auctionId
	QUERY(`SELECT bid FROM bids WHERE userId=${userId} AND auction_Id=${aucId}`).then((response) => {
		console.log(response)
		res.send({ type: 'success', data: response })
	})
})
router.post('/rebid', async (req, res) => {
	const userId = req.body.userid
	const aucId = req.body.auctionId
	const bid = req.body.bid

	QUERY(`UPDATE bids SET bid=${bid} WHERE userId=${userId} AND auction_Id=${aucId}`).then((response) => {
		console.log(response)
		res.send({ type: 'success', data: response })
	})
})
router.get('/getallauctions/:id', async (req, res) => {
	QUERY(`SELECT * FROM auction WHERE userId!=${req.params.id}`).then((response) => {
		res.send({ type: 'success', data: response })
	})
})
module.exports = router;
