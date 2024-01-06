const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const CLIENT_ID = 'jpibhf7HRq89okbIQwZ8Vt3DoSgvppHa';
const REDIRECT_URI = 'http://localhost:3000';

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const token = req.get('Authorization');
    
    if (token != undefined) {
        req.user = { token };
    }

    next();
});

app.get('/', (req, res) => {
    if (req.user && req.user.sub) {
        return res.json({
            username: req.user.sub,
            logout: 'http://localhost:3000/logout'
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/logout', (req, res) => {
    res.json();
});

app.get('/login', (req, res) => {
    const authUrl = `https://dev-r6kpri5jfce2stax.us.auth0.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&response_mode=query`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(401).send('Authorization code is missing.');
    }

    try {
        const tokenResponse = await fetch('https://dev-r6kpri5jfce2stax.us.auth0.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: 'Z5a4Bs3KnKnKdNQWDc1fTitPv8A-_edPl4gIxTnwBrmdHR9RZnq8DcGzn1P8oIlW',
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok) {
            throw new Error(tokenData.error || 'Failed to exchange code for tokens');
        }

        return res.send('Login Successful'); 
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

