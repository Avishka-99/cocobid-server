const path = require('path');
const express = require('express');
const router = express.Router();
const app = express();
const { INSERT, UPDATE, SELECT, DELETE, QUERY, SELECT_WHERE } = require('../models/db');
const { SendMail } = require('../include/NodemailerConfig');
const { generateOtp } = require('../include/OtpGen');
const e = require('express');
const bcrypt = require('bcrypt');
const { error } = require('console');
router.post('/signinuser', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	(async () => {
		try {
			await SELECT_WHERE('user', 'email', email).then((response) => {
				if (response.length > 0) {
					bcrypt.compare(password, response[0].password, async (err, result_2) => {
						if (result_2) {
							if (response[0].status != 'verified') {
								const otp = generateOtp(6);
								QUERY("UPDATE user SET status='" + otp + "' WHERE email='" + email + "'").then((result_3) => {
									SendMail(otp, email).then((response) => {
										res.send({ type: 'warning', message: 'Need to verify email first' });
									});
								});
							} else {
								res.send({ type: 'success', user: response[0].userRole, id: response[0].Id });
							}
						} else {
							res.send({ type: 'error', message: 'Incorrect password' });
						}
					});
				} else {
					res.send({ type: 'error', message: 'Incorrect email address' });
				}
			});
		} catch (error) {
			res.send('success');
		}
	})();
});
router.post('/registeruser', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const nic = req.body.nic;
	const firtsName = req.body.firstName;
	const lastName = req.body.lastName;
	const contactNo = req.body.contactNo;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = mm + '/' + dd + '/' + yyyy;
	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			res.send({ type: 'error', message: 'An error occured. Try again later' });
		} else {
			QUERY("SELECT * FROM user WHERE email='" + email + "'").then((result) => {
				if (result.length == 0) {
					const otp = generateOtp(6);
					QUERY("INSERT INTO user(nic,firstName,lastName,contactNo,userRole,regDate,email,password,status) VALUES('" + nic + "','" + firtsName + "','" + lastName + "','" + contactNo + "','" + 'customer' + "','" + today + "','" + email + "','" + hash + "','" + otp + "')").then((result_1) => {
						SendMail(otp, email).then((response) => {
							console.log(response);
							res.send({ type: 'success', message: 'Account created successfully' });
						});
					});
				} else {
					res.send({ type: 'error', message: 'Account already exists!' });
				}
			});
		}
	});
});
router.post('/verifyuser', (req, res) => {
	const email = req.body.email;
	const otp = req.body.otp;
	SELECT_WHERE('user', 'email', email).then((response) => {
		if (response[0].status != 'verified' && response[0].status != 'notverified') {
			if (response[0].status == otp) {
				QUERY("UPDATE user SET status='verified' WHERE email='" + email + "'").then((response) => {
					res.send({ type: 'success', message: 'OTP matched' });
				});
			} else {
				res.send({ type: 'error', message: 'Invalid OTP' });
			}
		} else {
			res.send({ type: 'error', message: 'An error occured' });
		}
	});
});




module.exports = router;