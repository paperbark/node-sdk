# PaperBark
This repository contains the open source code for the PaperBark NodeJS Development Kit.
For more information on how to use PaperBark or the PaperBark API please look at our [Documentation](https://github.com/paperbark/documentation/blob/master/readme.md) repository.

## Installation
This SDK is available via NPM, install it with the following command
```sh
npm install paperbark
```

## Usage
```js
const paperbark = require('paperbark')('your_token'); // Replace with your own API token

// Create a new pdf
let pdf = paperbark.pdf();
// Add HTML
pdf.html('<strong>PaperBark NodeJS SDK</strong>');

// Save to a file
pdf.save('output.pdf');
```

## License
Please see the [license file](https://github.com/paperbark/node-sdk/blob/master/LICENSE.md) for more information.