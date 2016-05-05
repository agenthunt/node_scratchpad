//https://www.twilio.com/blog/2015/10/asyncawait-the-hero-javascript-deserved.html

var request = require('request');

function getQuote() {
  var quote;

  return new Promise(function(resolve, reject) {
    request('http://ron-swanson-quotes.herokuapp.com/v2/quotes', function(error, response, body) {
      quote = body;

      resolve(quote);
    });
  });
}

async function main() {
  var quote = await getQuote();
  console.log(quote);
}

main();
console.log('Ron once said,');
