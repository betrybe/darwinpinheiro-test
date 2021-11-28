var results;

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
var req = new XMLHttpRequest()
req.open('GET', url, false);
req.onload = () =>{
  results = JSON.parse(req.responseText).results;
  console.log(results)

};
req.send();

export {results}
