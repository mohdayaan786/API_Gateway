const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { rateLimit } = require('express-rate-limit');
const axios = require('axios');
const { PORT, PORT1, PORT2, PORT3 } = require('./config/server_config');

const app = express();

app.use(morgan('combined'));

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 5,
});

const apiProxy = createProxyMiddleware({
    target: `http://localhost:${PORT3}`,
    changeOrigin: true,
});

const apiProxy2 = createProxyMiddleware({
    target: `http://localhost:${PORT1}`,
    changeOrigin: true,
});

const apiProxy3 = createProxyMiddleware({
    target: `http://localhost:${PORT2}`,
    changeOrigin: true,
});

app.use(limiter);

app.use('/bookingservice', async (req, res, next) => {
    console.log(req.headers['x-access-token']);
    try {
        const response = await axios.get(`http://localhost:${PORT2}/api/v1/isAuthenticated`, {
            headers: {
                'x-access-token': req.headers['x-access-token']
            }
        });
        console.log(response.data);
        if (response.data.success) {
            next();
        }
        else {
            res.status(401).send('Unauthorized');
        }
    } catch(err) {
        res.status(401).send('Unauthorized');
    }
});

app.use('/bookingservice', apiProxy);
app.use('/flightandsearchservice', apiProxy2);
app.use('/authservice', apiProxy3);

app.get('/home', (req, res) => {
    res.send('Welcome to the API Gateway!');
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});