const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
const exec = require('child_process').exec;
const categories = require('./categories.json');

async function fetchLabels(imageUri) {
  
    // Performs label detection on the image file
    const [result] = await client.labelDetection(imageUri);

    fs.writeFile('test.json', JSON.stringify(result), 'utf8', (err) => {
        if (err) {
            console.error(err, err.stack);
            return;
        }
    });

    const labels = result.labelAnnotations;
    let params = [];
    console.log('Labels:');
    labels.forEach(label => params.push(label.description));

    console.log(getCategory(params));
    
}
// ================== Experimental Functions =====================
async function webDetect(imageUri) {
    const [result] = await client.webDetection(imageUri);

    fs.writeFile('test.json', JSON.stringify(result), 'utf8', (err) => {
        if(err) {
            console.error(err, err.stack);
            return;
        }
    });

    const imageTitle = result.webDetection.bestGuessLabels[0].label;
    console.log(imageTitle);

}

async function getImageProperties(imageUri) {
    const [result] = await client.imageProperties(imageUri);

    fs.writeFile('test.json', JSON.stringify(result), 'utf8', (err) => {
        if(err) {
            console.error(err, err.stack);
            return;
        }
    });
}

// ==================================================================

function determineAction(itemCategories) {

}

function getCategory(apiResponse) {
    console.log(JSON.stringify(apiResponse));
    let categoriesFound = [];

    // for (let category in categories) {
    //     if(typeof(categories[category])!='object') {
    //         for (let i = 0; i<categories[category].length; i++) {
    //             if () {
                    
    //             }
    //         }
    //     }
    // }

    response = "Compost: \n";
    for (let i = 0; i < apiResponse.length; i++)
        for (let j = 0; j < categories.compost.length; j++)
            if (apiResponse[i].toUpperCase() === categories.compost[j].toUpperCase())
                response += apiResponse[i] + "\n";

    response += "\nRecycle: \n"
    for (let i = 0; i < apiResponse.length; i++) 
        for (let j = 0; j < categories.recycle.length; j++)
            if (apiResponse[i].toUpperCase() === categories.recycle[j].toUpperCase())
                response += apiResponse[i] + "\n";

    response += "\nSpecial: \n"
    for (let i = 0; i < apiResponse.length; i++) 
        for (let j = 0; j < categories.special.length; j++)
            if (apiResponse[i].toUpperCase() === categories.special[j].toUpperCase())
                response += apiResponse[i] + "\n";
            

    if (response != null) 
        return response;

    return "Couldn't find match";
}

fetchLabels('./food-images/rotten-apple.jpg');
