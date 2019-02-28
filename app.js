const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
const exec = require('child_process').exec;
const categories = require('./categories.json');
const test3 = require("./test3.json");

async function fetchLabels(imageUri) {
  
    // Performs label detection on the image file
    const [result] = await client.labelDetection(imageUri);

    const labels = result.labelAnnotations;
    let params = [];
    let weight = [];
    console.log('Labels:');
    labels.forEach(label => params.push(label.description));
    labels.forEach(label => weight.push(label.score));

    writeJSON(params,weight);

    console.log(getCategory(params,weight));
    
}

// ==================================================================

function writeJSON(params,weight)
{
    let o = {};
    let key = "data"; //key must exist in the json file.
    let data = [];
    o[key] = [];

    fs.readFile('test3.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            o = JSON.parse(data); //now it an object

        /*for (let i = 0; i < params.length; i++)
        {
            data = {
                description : params[i],
                weight : weight[i]
            }
            o[key].push(data);
        }*/
        o["compost"].push("testestest");

        json = JSON.stringify(o); //convert it back to json
        fs.writeFile('test3.json', JSON.stringify(o), 'utf8', (err) => {
            if (err) {
                console.error(err, err.stack);
                return;
            }
        });
    }});
}


function getCategory(apiResponse, weight) {
    console.log(JSON.stringify(apiResponse));
    console.log(JSON.stringify(weight))

    response = "Compost: \n";
    for (let i = 0; i < apiResponse.length; i++)
        for (let j = 0; j < categories.compost.length; j++)
            if (apiResponse[i].toUpperCase() === categories.compost[j].toUpperCase())
            {
                response += apiResponse[i] + "\n";
            }

    response += "Recycle: \n";
    for (let i = 0; i < apiResponse.length; i++)
        for (let j = 0; j < categories.recycle.length; j++)
            if (apiResponse[i].toUpperCase() === categories.recycle[j].toUpperCase())
            {
                response += apiResponse[i] + "\n";
            }

    if (response != null) 
        return response;
   
    return "Couldn't find match";
}

fetchLabels('./food-images/paper-plate.jpg');
