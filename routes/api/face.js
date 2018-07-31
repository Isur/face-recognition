const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = require('../../config/keys').api_key;
const API_REGION = require('../../config/keys').api_region;

const link = `https://${API_REGION}.api.cognitive.microsoft.com/face/v1.0/`;
const header = { "Ocp-Apim-Subscription-Key": API_KEY }

// GET INFORMATION ABOUT FACE
router.post('/detect/', (req,res) => {
    const image = req.body.imageURL;
    const attr = "?returnFaceAttributes=age,gender,smile,facialHair,headPose,glasses,emotion,hair,makeup,accessories,blur,exposure,noise"
    const query = link + `detect` + attr;
    axios({
        method: 'post',
        url: query,
        headers: header,
        data:{
            url: image
        }
    })
    .then(response => res.json(response.data))
    .catch(err => console.log(err));
})

// IDENTIFY FACE
router.post('/identify/', (req,res) => {
    const faceIds = req.body.faceIds;
    const personGroupId = req.body.personGroupId;
    const query = link + `identify`;
    axios({
        method: 'post',
        url: query,
        headers: header,
        data:{
            personGroupId: personGroupId,
            faceIds: faceIds,
        }
    })
    .then(response => res.json(response.data))
    .catch(err => console.log(err.response.statusText));
})



module.exports = router;