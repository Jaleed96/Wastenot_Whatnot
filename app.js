const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
const exec = require('child_process').exec;

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
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
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

webDetect('./food-images/rotten-apple.jpg');