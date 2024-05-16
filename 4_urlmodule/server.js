const url = require('url');

let result = url.parse("https://google.com/about.html?username=abc");
console.log(result.query.split("=")[1]);