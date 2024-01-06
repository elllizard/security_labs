

var request = require('request');

function getTokens() {
    var options = {
        method: 'POST',
        url: 'https://dev-r6kpri5jfce2stax.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            realm: 'Username-Password-Authentication',
            grant_type: 'password',
            username: 'lizadiomkina@gmail.com',
            password: 'Password123',
            audience: 'https://dev-r6kpri5jfce2stax.us.auth0.com/api/v2/', 
            client_id: 'jpibhf7HRq89okbIQwZ8Vt3DoSgvppHa', 
            client_secret: 'Z5a4Bs3KnKnKdNQWDc1fTitPv8A-_edPl4gIxTnwBrmdHR9RZnq8DcGzn1P8oIlW',
            scope: 'offline_access'
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            console.error('Error:', error);
            return;
        }

        var tokens = JSON.parse(body);
        console.log('\n Access Token: \n', tokens.access_token + '\n');
        console.log('Refresh Token: \n', tokens.refresh_token + '\n');

        // Оновлення Access Token
        if (tokens.refresh_token) {
            refreshToken(tokens.refresh_token);
        }
    });
}

function refreshToken(refreshToken) {
    var options = {
        method: 'POST',
        url: 'https://dev-r6kpri5jfce2stax.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            grant_type: 'refresh_token',
            client_id: 'jpibhf7HRq89okbIQwZ8Vt3DoSgvppHa', 
            client_secret: 'Z5a4Bs3KnKnKdNQWDc1fTitPv8A-_edPl4gIxTnwBrmdHR9RZnq8DcGzn1P8oIlW',
            refresh_token: refreshToken
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            console.error('Error:', error);
            return;
        }

        var newTokens = JSON.parse(body);
        console.log('New Access Token: \n', newTokens.access_token + '\n');
    });
}

getTokens();
