var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	auth: {
		user: 'sales.cocobid@gmail.com',
		pass: 'emicwxbxuacczoja',
	},
	tls: {
		rejectUnauthorized: false,
	},
	secure: false,
});
async function SendMail(otp,email) {
	var mailOptions = {
		from: 'sales.cocobid@gmail.com',
		to: email,
		subject: 'Verify your email',
		text: otp,
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
			return error;
		} else {
			return 'Email sent: ' + info.response;
		}
	});
};
module.exports = { SendMail };
