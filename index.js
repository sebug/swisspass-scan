/*
Copyright 2019 Sebastian Gfeller

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
import javascriptBarcodeReader from 'javascript-barcode-reader';

const body = document.querySelector('body');

body.innerHTML = '<h1>Swisspass Scan</h1>' +
    '<form>' +
    '<fieldset>' +
    '<legend>Enter Swisspass ID</legend>' +
    '<label>Scan Swisspass' +
    '<input type="file" capture="camera" accept="image/*" id="barcodescan">' +
    '</label>' +
    '</fieldset>' +
    '</form>' +
    '<p id="result"></p>';

const barcodeScan = body.querySelector('#barcodescan');

const reportCode = (code) => {
    const resultP = document.querySelector('#result');
    resultP.innerHTML = 'Read code: ' + code;
};

const reportError = (err) => {
    const resultP = document.querySelector('#result');
    resultP.innerHTML = 'Code not found';
};

const readFile = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
	callback(reader.result);
    }, false);
    reader.readAsDataURL(file);
};

const urlAsImage = (urlResult, loadCallback) => {
    const img = new Image();
    img.addEventListener('load', () => {
	loadCallback(img);
    });
    img.src = urlResult;
};

const isRed = (r, g, b, a) => {
    const allTogether = r + g + b;
    const average = allTogether / 3;

    return r - average > 100;
};

const lastRedPixelHeight = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    const imageData = canvas.getContext('2d').getImageData(0, 0, img.width, img.height);
    const pix = imageData.data;
    let logCount = 0;
    let lastRedPixelPosition = 0;
    let currentLineRedCount = 0;
    let redCounts = [];
    for (let i = 0; i < pix.length; i += 4) {
	if ((i / 4) % img.width === 0) {
	    redCounts.push(currentLineRedCount);
	    currentLineRedCount = 0;
	}
	if (isRed(pix[i], pix[i + 1], pix[i + 2], pix[i + 3])) {
	    currentLineRedCount += 1;
	}
    }
    const redCountsAveraged = [];
    const linesToAverage = 8;
    for (let y = 0; y < redCounts.length - linesToAverage; y += 1) {
	let sum = 0;
	for (let i = 0; i < linesToAverage; i += 1) {
	    sum += redCounts[y + i];
	}
	redCountsAveraged.push(sum / linesToAverage);
    }
    const kindaRedLines = [];
    for (let y = 0; y < redCountsAveraged.length; y += 1) {
	if (redCountsAveraged[y] > img.width / 4) {
	    kindaRedLines.push(y);
	}
    }
    if (kindaRedLines.length > 0) {
	return kindaRedLines[kindaRedLines.length - 1];
    }
    return 0;
};

const updateNumber = () => {
    const curFiles = barcodeScan.files;

    if (curFiles.length > 0) {
	readFile(curFiles[0], (urlResult) => {
	    urlAsImage(urlResult, img => {
		javascriptBarcodeReader(img, {
		    barcode: 'code-128'
		}).then(reportCode, reportError);
		lastRedPixelHeight(img);
	    });
	});
    }
};

barcodeScan.addEventListener('change', updateNumber);





