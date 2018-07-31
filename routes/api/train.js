const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = require('../../config/keys').api_key;
const API_REGION = require('../../config/keys').api_region;

const link = `https://${API_REGION}.api.cognitive.microsoft.com/face/v1.0/`;
const header = { "Ocp-Apim-Subscription-Key": API_KEY }

// TRAIN PERSON GROUP
router.post('/traingroup/', (req,res) => {
    const personGroupId = req.body.personGroupId;
    const query = link + `persongroups/${personGroupId}/train`;
    axios({
        method: 'post',
        url: query,
        headers: header,
    })
    .then(response => res.json(response.data))
    .catch(err => console.log(err.response.statusText));
})

// TRAIN STATUS
router.post('/trainstatus/', (req,res) => {
    const personGroupId = req.body.personGroupId;
    const query = link + `persongroups/${personGroupId}/training`;
    axios({
        method: 'get',
        url: query,
        headers: header,
    })
    .then(response => res.json(response.data))
    .catch(err => console.log(err.response.statusText));
})




module.exports = router;