const path = require('path');
const express = require('express');
const router = express.Router();
const app = express();
router.use(express.json());
const jwt = require('jsonwebtoken');
const { INSERT, UPDATE, SELECT, DELETE, QUERY, SELECT_WHERE } = require('../models/db');
router.get('/getrecentauctions', async (req, res) => {
	QUERY("SELECT DISTINCT auction.Id,auction.basePrice,(SELECT COUNT(bids.bid) FROM bids WHERE bids.auction_Id = auction.Id)AS hits, (SELECT MAX(bids.bid) FROM bids WHERE bids.auction_Id=auction.Id) AS max_bid,user.firstName,user.lastName FROM auction INNER JOIN bids ON auction.Id = bids.auction_Id INNER JOIN user ON auction.userId = user.Id").then((response) => {
		res.send(response)
	})

})
router.get('/getauctionsummary', async (req, res) => {
	QUERY("SELECT DISTINCT (SELECT COUNT(status) FROM auction WHERE status =0) AS ongoing,(SELECT COUNT(status) FROM auction WHERE status =1) AS closed,(SELECT COUNT(status) FROM auction WHERE status =2) AS cancelled  FROM auction").then((response) => {
		res.send(response)
	})
})
router.get('/gettodaysummary', async (req, res) => {
	QUERY("SELECT COUNT(ID) as auctions FROM auction WHERE DATE(createdDate) = CURDATE()").then((response) => {
		QUERY("SELECT MAX(bid) as max FROM bids WHERE auction_Id IN (SELECT auction_Id FROM auction WHERE DATE(closingDate)=CURDATE()) GROUP BY auction_Id").then((response_2) => {
			var sum = 0;
			response_2.forEach(element => {
				sum += element.max
			});
			var responseArr = [{ name: "Auctions", value: response[0].auctions }, { name: "Revenue", value: sum.toFixed(2) }]
			res.send(responseArr)
		})

	})
})




module.exports = router;
