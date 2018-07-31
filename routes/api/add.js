const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = require('../../config/keys').api_key;
const API_REGION = require('../../config/keys').api_region;

const link = `https://${API_REGION}.api.cognitive.microsoft.com/face/v1.0/`;
const header = { "Ocp-Apim-Subscription-Key": API_KEY }

// CREATE PERSON GROUP
    router.post('/addPersonGroup/', (req,res) => {
        const name = req.body.name;
        const userData = req.body.userData;
        const id = req.body.id;
        const query = link + `persongroups/${id}`;
        
        axios({
            method: 'put',
            url: query,
            headers: header,
            data:{
                name: name,
                userDate: userData
            }
        }).then(response =>res.json(response.data)).catch(err => res.json((err.response.data)));
    })
// CREATE PERSON
    router.post('/addPerson', (req,res) => {
        const personGroupId = req.body.personGroupId;
        const name = req.body.name;
        const userData = req.body.userData;
        const query = link + `persongroups/${personGroupId}/persons`;
        
        axios({
            method: 'post',
            url: query,
            headers: header,
            data:{
                name: name,
                userData: userData
            }
        }).then(response =>res.json(response.data)).catch(err => res.json((err.response.data)));
    })
// ADD FACE TO PERSON
router.post('/addFace', (req, res) => {
    const personId = req.body.personId;
    const personGroupId = req.body.personGroupId;
    const image = req.body.image;
    const query = link + `persongroups/${personGroupId}/persons/${personId}/persistedFaces`;

    axios({
        method: 'post',
        url: query,
        headers: header,
        data:{
            url: image
        }
    }).then(response =>res.json(response.data)).catch(err => res.json((err.response.data)));

})

module.exports = router;