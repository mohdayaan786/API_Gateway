const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { rateLimit } = require('express-rate-limit');
const axios = require('axios');

const app = express();
const port = 3004;

app.use(morgan('combined'));

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 5,
});

const apiProxy = createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
});
app.use(limiter);

app.use('/bookingservice', async (req, res, next) => {
    console.log(req.headers['x-access-token']);
    try {
        const response = await axios.get('http://localhost:3001/api/v1/isAuthenticated', {
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

app.get('/home', (req, res) => {
    res.send('Welcome to the API Gateway!');
});

app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});