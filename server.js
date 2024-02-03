const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5001;
const userRoutes = require('./api/UserRoutes');
const customerRoutes = require('./api/customer/customerRoutes');
const path = require('path');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50MB' }));
app.use('/api', userRoutes);
app.use('/api', customerRoutes);
app.use('/uploads', express.static('./uploads'));
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("We are live and connected");
	console.log(socket.id);
});

httpServer.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
