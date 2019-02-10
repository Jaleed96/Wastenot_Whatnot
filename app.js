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

function getCategory(apiResponse) {
    console.log(apiResponse[0]);
    console.log(categories.compost[0]);



    if (apiResponse[0].toUpperCase() === categories.compost[0].toUpperCase()) {
        return "Compost: " + apiResponse[0];
    }

    return "Couldn't find match";
}

fetchLabels('./food-images/rotten-apple.jpg');
