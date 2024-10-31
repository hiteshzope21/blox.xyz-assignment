const Decimal = require('decimal.js');

function parseJson(jsonString) {
    return JSON.parse(jsonString, (key, value) => {
        if (typeof value === 'string') {
            if (/^-?\d+$/.test(value)) {
                return BigInt(value); 
            }
            if (/^-?\d+\.\d+$/.test(value)) {
                return new Decimal(value); 
            }
        }
        return value;
    });
}

const jsonString = `{
    "int_val": "123456789012345678901234567890",
    "float_val": "1.123456789012345678901234567890",
    "nested": {
        "int_val": "987654321098765432109876543210",
        "float_val": "3.141592653589793238462643383279"
    },
    "list": [
        "10000000000000000000",
        "200.5555555555555555555555",
        {
            "sub_object": "300"
        }
    ],
    "name": "hitesh zope"
}`;

const parsedData = parseJson(jsonString);
console.log(parsedData)
