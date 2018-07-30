const express = require('express');
const router = express.Router();
const axios = require('axios');


const API_KEY = require('../../config/keys').api_key;
const API_REGION = require('../../config/keys').api_region;

const link = `https://${API_REGION}.api.cognitive.microsoft.com/face/v1.0/`;

// GET ALL FROM LIST: list
router.get('/all/:list', (req,res) => {
    const list = req.params.list
    const query = link + `facelists/${list}`;
    axios({
        method: 'get',
        url: query,
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY
        },
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})

// GET ALL LISTS
router.get('/lists', (req,res) => {
    const query = link + `facelists`;
    axios({
        method: 'get',
        url: query,
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY
        },
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})
module.exports = router;