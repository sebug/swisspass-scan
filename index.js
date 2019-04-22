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
    resultP.innerHTML = code;
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

const updateNumber = () => {
    const curFiles = barcodeScan.files;

    if (curFiles.length > 0) {
	readFile(curFiles[0], (urlResult) => {
	    const img = new Image();
	    img.addEventListener('load', () => {
		javascriptBarcodeReader(img, {
		    barcode: 'code-128'
		}).then(reportCode, reportError);
	    });
	    img.src = urlResult;
	});
    }

    console.log(curFiles);
};

barcodeScan.addEventListener('change', updateNumber);


console.log(barcodeScan);




