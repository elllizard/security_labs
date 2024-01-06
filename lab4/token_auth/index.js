const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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

app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', login);
        params.append('password', password);
        params.append('audience', 'https://dev-r6kpri5jfce2stax.us.auth0.com/api/v2/');
        params.append('client_id', 'jpibhf7HRq89okbIQwZ8Vt3DoSgvppHa');
        params.append('client_secret', 'Z5a4Bs3KnKnKdNQWDc1fTitPv8A-_edPl4gIxTnwBrmdHR9RZnq8DcGzn1P8oIlW');

        const response = await fetch('https://dev-r6kpri5jfce2stax.us.auth0.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!response.ok) {
            var errorResponse = await response.json();
            throw new Error(`HTTP error ${response.status}! ${errorResponse.error_description}`);
        }

        const data = await response.json();
        const token = data['access_token'];
        return res.json({ token });
    } catch (error) {
        console.error('Error:', error);
        res.status(401).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


