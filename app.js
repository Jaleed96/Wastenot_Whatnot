const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
const exec = require('child_process').exec;
const categories = require('./categories.json');

//TODO: Now that we have a dynamic search, Use it to fetch the root-level category for decision-making

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

    //console.log(params);

    getCategory(params);
    console.log(Object.keys(categories));
    
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

// function getCategory(apiResponse) {
//     console.log(JSON.stringify(apiResponse));
//     let categoriesFound = [];

//     response = "Compost: \n";
//     for (let i = 0; i < apiResponse.length; i++)
//         for (let j = 0; j < categories.compost.length; j++)
//             if (apiResponse[i].toUpperCase() === categories.compost[j].toUpperCase())
//                 response += apiResponse[i] + "\n";

//     response += "\nRecycle: \n"
//     for (let i = 0; i < apiResponse.length; i++) 
//         for (let j = 0; j < categories.recycle.length; j++)
//             if (apiResponse[i].toUpperCase() === categories.recycle[j].toUpperCase())
//                 response += apiResponse[i] + "\n";

//     response += "\nSpecial: \n"
//     for (let i = 0; i < apiResponse.length; i++) 
//         for (let j = 0; j < categories.special.length; j++)
//             if (apiResponse[i].toUpperCase() === categories.special[j].toUpperCase())
//                 response += apiResponse[i] + "\n";
            

//     if (response != null) 
//         return response;

//     return "Couldn't find match";
// }

function getCategory(fetchedLabels) {
    let wasteCategories =[];
    fetchedLabels.forEach(label=>{
        let labelFound = matchLabels(label, categories);
        if (labelFound) wasteCategories.push(label);
    });
    console.log(wasteCategories);
}

function matchLabels(label, category) {
    if (typeof category == "object") {
        for (let cat in category) {
            //console.log(label, " ", category[cat]);
            let res = matchLabels(label, category[cat]);
            if (res) return res;
        }
        return false;
    } else if (label.toLowerCase()===category) {
        return true;
    }
}

fetchLabels('./food-images/rotten-apple.jpg');
