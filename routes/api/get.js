const express = require('express');
const router = express.Router();
const axios = require('axios');


const API_KEY = require('../../config/keys').api_key;
const API_REGION = require('../../config/keys').api_region;

const link = `https://${API_REGION}.api.cognitive.microsoft.com/face/v1.0/`;
const header = { "Ocp-Apim-Subscription-Key": API_KEY }

// GET ALL FROM LIST: list
router.get('/all/:faceListId', (req,res) => {
    const faceListId = req.params.faceListId
    const query = link + `facelists/${faceListId}`;
    axios({
        method: 'get',
        url: query,
        headers: header,
    })
    .then(response => res.json(response.data))
    .catch(err => console.log(err));
})

// GET ALL LISTS
router.get('/lists', (req,res) => {
    const query = link + `facelists`;
    axios({
        method: 'get',
        url: query,
        headers: header,
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})


// GET ALL PERSON GROUPS
    router.get('/personGroups/', (req,res)=>{
        const query = link + 'persongroups';
        axios({
            method: 'get',
            url: query,
            headers: header
        })
        .then(response => res.json(response.data))
        .catch(err => res.json({error: err}));
    })

// GET PERSON GROUP BY ID
router.get('/personGroups/:personGroupId', (req,res)=>{
    const personGroupId = req.params.personGroupId;
    const query = link + `persongroups/${personGroupId}`;
    axios({
        method: 'get',
        url: query,
        headers: header
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})

// GET PERSONS FROM PERSON GROUP
router.get('/personlist/:personGroupId', (req,res)=>{
    const personGroupId = req.params.personGroupId;
    const query = link + `persongroups/${personGroupId}/persons`;
    axios({
        method: 'get',
        url: query,
        headers: header
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})

// GET PERSON FROM PERSON GROUP BY ID
router.get('/person/', (req,res)=>{
    const personGroupId = req.query.personGroupId;
    const personId = req.query.personId;
    const query = link + `persongroups/${personGroupId}/persons/${personId}`;
    axios({
        method: 'get',
        url: query,
        headers: header
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})
// GET PERSON FACE BY ID / BY PERSON / BY PERSON GROUP
router.get('/personface/', (req,res)=>{
    const personGroupId = req.query.personGroupId;
    const personId = req.query.personId;
    const face_id = req.query.face_id;
    const query = link + `persongroups/${personGroupId}/persons/${personId}/persistedFaces/${face_id}`;
    axios({
        method: 'get',
        url: query,
        headers: header
    })
    .then(response => res.json(response.data))
    .catch(err => res.json({error: err}));
})

module.exports = router;
