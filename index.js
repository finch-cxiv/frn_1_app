const fetch = require("node-fetch");
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
app.use(express.text())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(bodyParser.json());
const port_LOCAL = 3000

var server_HTTP = app.listen(port_HTTP, () => {
    console.log(`cxiv_fba HTTP listening on port ${port_HTTP}`)
})

var server_HTTPS = app.listen(port_HTTPS, () => {
    console.log(`cxiv_fba HTTPS listening on port ${port_HTTPS}`)
})

var server_LOCAL = app.listen(port_LOCAL, () => {
    console.log(`cxiv_fba LOCAL listening on port ${port_LOCAL}`)
})

var VARIABLES = {
    CLIENT_ID: "f010187a-625c-474a-b9c5-461445989809",
    CLIENT_SECRET: "finch-secret-sandbox-OSydjzrk29pgQp-pkPevkGPP8vnbtPLNLO-5EBOq",
    URL_FINCH: "https://api.tryfinch.com",
    FINCH_API_VERSION: "2020-09-17",
    PRODUCTS: "company directory individual employment payment pay_statement",
    REDIRECT_URI: "https://cxiv.io/finch_tech_assessment_user_login.html",
    AUTHORIZATION: "Bearer a27549f6-5630-45a3-b80d-697b45533a03",
    DIRECTORY: "empty",
};

var URL_REQUEST = "";
var HEADERS = { nothing: "nothing" };
var DATA_R = { nothing: "nothing" };

app.get('/', (req, res) => {
    console.log("/root request just ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send("nothing to see here - just a root")
    res.end();
})

app.get('/three_thousand', (req, res) => {
    console.log("/three_thousand ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send("you just hit an endpoint to test the 3000 port")
    res.end();
})

app.get('/eighty', (req, res) => {
    console.log("/eighty ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send("you just hit an endpoint to test the 80 port")
    res.end();
})

app.get('/four_four_three', (req, res) => {
    console.log("/four_four_three ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send("you just hit an endpoint to test the 443 port")
    res.end();
})

app.get('/hello', (req, res) => {
    console.log("/hello ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send("cxiv_fba is up and running")
    res.end();
})

app.get('/testme', (req, res) => {
    console.log("/testme ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send("we're all good - get on testing")
    res.end();
})

app.post('/begin_auth', (req, res) => {
    console.log("/begin_auth ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.json({
        redirect:
            'https://connect.tryfinch.com/authorize?&client_id=' +
            VARIABLES.CLIENT_ID +
            '&products=' + VARIABLES.PRODUCTS +
            '&redirect_uri=' +
            VARIABLES.REDIRECT_URI + '&sandbox=true'

    })
    res.end();
})

app.post('/accept_code', (req, res) => {
    console.log("accept_code_ran")
    var code = req.body
    console.log(code)

    var data = {
        client_id: VARIABLES.CLIENT_ID,
        client_secret: VARIABLES.CLIENT_SECRET,
        code: code,
        redirect_uri: VARIABLES.REDIRECT_URI
    }

    api_finch('/auth/token', 'POST', data)
        .then((response) => {
            console.log(response)
            var token = "Bearer " + response.access_token
            VARIABLES.AUTHORIZATION = token
            console.log("WITHIN THEN POST ACCEPT CODE")
            console.log(VARIABLES.AUTHORIZATION)
        })

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ this_is_just_what_was_sent: { requestBody: req.body } })
    res.end();
})

app.get('/company', (req, res) => {
    console.log("/company ran")
    api_finch('/employer/company', 'GET', 'null')
        .then((response) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(response)
            res.end();
        })

})

app.get('/directory', (req, res) => {
    console.log("/directory ran")

    api_finch('/employer/directory', 'GET', 'null')
        .then((response) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(response)
            res.end();
        })

})

app.post('/employer_individual', (req, res) => {
    console.log("/employer_individual ran")

    individual_id = req.body
    console.log(individual_id)

    var data = {
        requests: [
            { individual_id: individual_id }
        ]
    }

    api_finch('/employer/individual', 'POST', data)
        .then((response) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(response)
            res.end();
        })

})

app.post('/employer_employment', (req, res) => {
    console.log("employer_employment ran")

    individual_id = req.body
    console.log(individual_id)

    var data = {
        requests: [
            { individual_id: individual_id }
        ]
    }

    api_finch('/employer/employment', 'POST', data)
        .then((response) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(response)
            res.end();
        })

})

app.post('/payment', (req, res) => {
    console.log("payment ran")
    query = req.body
    console.log(URL_REQUEST)
    api_finch('/employer/payment?', 'GET', null, query)
    .then((response) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(response)
        res.end();
    })
})

app.post('/pay-statement', (req, res) => {
    console.log("pay-statement ran")
    pay_id = req.body
    api_finch('/employer/pay-statement', 'POST', pay_id)
    .then((response) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(response)
        res.end();
    })
})


async function api_finch(resource, method, data, params) {
    URL_REQUEST = VARIABLES.URL_FINCH + resource + new URLSearchParams(params).toString()
    console.log(URL_REQUEST)
    if (resource === '/auth/token') {
        HEADERS = {
            'Content-Type': 'application/json'
        }
    }
    else {
        HEADERS = {
            Authorization: VARIABLES.AUTHORIZATION,
            'Finch-API-Version': VARIABLES.FINCH_API_VERSION,
            'Content-Type': 'application/json'
        }
    }

    if (method === 'GET') {
        var BODY_R = null
    }
    else {
        var BODY_R = JSON.stringify(data)
    }

    var data_resolve = await fetch(URL_REQUEST, { method: method, headers: HEADERS, body: BODY_R })
        .then(data => data.json())
        .then(data => {
            DATA_R = data
            return (DATA_R)
        })
        .catch((error) => {
            console.error(error)
        })
    return data_resolve
}