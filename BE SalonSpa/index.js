const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const path = require('path');
var morgan = require('morgan');

const connectDB = require('./configs/database');
const router = require('./routers');

const loginMiddleware = require('./middlewares/login.middleware');

const socket = require('./services/socket.service');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // For legacy browser support
  methods: 'GET, POST, PUT, PATCH, DELETE',
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.render('login.ejs');
});

app.get('/login', loginMiddleware, (req, res) => {
  res.render('index.ejs', { user: req.query });
});

socket(server);

connectDB();
router(app);

server.listen(3000, () => {
  console.log('Running port in 3000');
});
