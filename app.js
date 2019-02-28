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
    if (itemCategories.includes("metal")) {
        console.log("Please drop off metal waste at Vancouver Zero Waste Centre or a dedicated scrap metal bin");
    }
    if (itemCategories.includes("electronics")) {
        console.log("Please recycle your electronics at a dedicated E-waste recycling facility");
    }
    if (itemCategories.includes("recycle")) {
        console.log("Please use the yellow bin for disposal");
    }
    if (itemCategories.includes("compost")&&itemCategories.includes("mixed-container")) {
        console.log("Please use the green bin for disposal");
    } else if (itemCategories.includes("mixed-container")) {
        console.log("Please use the blue bin for disposal");
    } else if (itemCategories.includes("compost")) {
        console.log("Please use the green bin for disposal");
    }
    if (itemCategories.includes("garbage")) {
        console.log("Please use the black bin for disposal");
    }

}

function getCategory(fetchedLabels) {
    let wasteCategories =[];
    for (let i = 0; i<Object.keys(categories).length;i++) {
        fetchedLabels.forEach(label=>{
            //console.log(Object.keys(categories)[i]);
            let labelFound = matchLabels(label, categories[Object.keys(categories)[i]]);
            if (labelFound) wasteCategories.push(Object.keys(categories)[i]);
        });
    }
    console.log(wasteCategories);
    determineAction(wasteCategories);
}

function matchLabels(label, category) {
    if (typeof category == "object") {
        for (let cat in category) {
            let res = matchLabels(label, category[cat]);
            if (res) return res;
        }
        return false;
    } else if (label.toLowerCase()===category) {
        return true;
    }
}

fetchLabels('./food-images/cans.jpg');
