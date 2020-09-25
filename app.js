"use strict";
const avaamoServices = require('./avaamo');

(async function main(){

    avaamoServices.processFile('./big.txt')
    .then(data=>{
        let res =  avaamoServices.processData(data, 'it');
   
        Promise.all(res)
        .then(wordData=> console.log(wordData))
        .catch(err => console.error(err))
    })
    .catch(err =>{
        console.error(err)
    })
    
})();