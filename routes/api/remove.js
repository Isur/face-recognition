const express = require('express');
const router = express.Router();
const axios = require('axios');


const API_KEY = require('../../config/keys').api_key;
const API_REGION = require('../../config/keys').api_region;

const link = `https://${API_REGION}.api.cognitive.microsoft.com/face/v1.0/`;
const header = { "Ocp-Apim-Subscription-Key": API_KEY }

// DELETE PERSON 
router.get('/person', (req,res) => {
    const personGroupId = req.params.personGroupId;
    const personId = req.params.personId;
    const query = link + `persongroups/${personGroupId}/persons/${personId}`;
    axios({
        method: 'delete',
        url: query,
        headers: header,
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})

module.exports = router;