"use strict";
require('dotenv').config();

const fs = require('fs');
const https = require('https');
const util = require('util');

function splitByWords (text) {
    let wordsArray = text.split(/\s+/);
    return wordsArray;
}

function createWordMap (wordsArray) {
    let wordsMap = {};
    wordsArray.forEach(function (key) {
      key = key.toLowerCase()
      if (wordsMap.hasOwnProperty(key)) {
        wordsMap[key]++;
      } else {
        wordsMap[key] = 1;
      }
    });
  
    return wordsMap;
}

function sortByCount (wordsMap) {
    var finalWordsArray = [];
    finalWordsArray = Object.keys(wordsMap).map(function (key) {
        return {
        word: key,
        occurence: wordsMap[key]
        };
    });

    finalWordsArray.sort(function (a, b) {
        return b.occurence - a.occurence;
    });

    return finalWordsArray;
}

function getSynonyms(object, pos){
    let synonyms = []
    if(pos.includes('/')){
        pos = pos.split('/')
    }
    else{
        pos = [].concat(pos)
    }
    
    pos.forEach(p=>{
        if(object.pos && object.pos.includes(p.trim()) && object.text){ //synonymn must be of same parts of speech as of the origin word
            synonyms.push(object.text);
        }
    })
   
    return synonyms
}


function processFile(fileName){
    return new Promise(function (resolve, reject){
        if(fileName){
            const readFile = util.promisify(fs.readFile);

            readFile(fileName, 'utf8')
            .then(data=>{
                var wordsArray = splitByWords(data);
                var wordsMap = createWordMap(wordsArray);
                var finalWordsArray = sortByCount(wordsMap).slice(0,10);

                resolve(finalWordsArray)
            });
        }
        else{
            reject('fileName is missing');
        }
    });
}

function getWordDetails(lookUpEndpoint, word){
    let endpoint = lookUpEndpoint+word.word
    return new Promise((resolve, reject)=>{
        try{
            https.get(endpoint, (res) => {
                let data = '';
        
                res.on('data', (chunk) => {
                    data += chunk;
                    data = JSON.parse(data)
                    data = (data.def && data.def[0])?data.def[0]:{};
    
                    let synonyms = [];
    
                    if(data && data.tr && Array.isArray(data.tr)){
                        data.tr.forEach(trObj=>{
                            synonyms = synonyms.concat(getSynonyms(trObj, data.pos));
    
                            if(trObj.syn && Array.isArray(trObj.syn)){
                                trObj.syn.forEach(syn=>{
                                    synonyms = synonyms.concat(getSynonyms(syn, data.pos));
                                })
                            }
                        })
                    }
                    
                    resolve({
                        word: word.word,
                        occurence: word.occurence,
                        partOfSpeech: data.pos,
                        synonyms: synonyms
                    })
    
                }).on('error', (err)=> {
                    reject(err)
                })
            })
        }catch(err){
            console.log(err)
            reject(err)
        }
    });
}

function processData(finalWordsArray, lang){
    let promises = []
    
    if(!process.env.APIkey){
        promises.push(new Promise((resolve, reject)=>reject('API KEY is not present in env file')));
        return promises
    }

    let lookUpEndpoint = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${process.env.APIkey}&lang=en-${lang}&text=`

    for(let i=0; i<finalWordsArray.length; i++){

        let word = finalWordsArray[i]

        if(!word || (word.constructor!=({}).constructor || !word.word || !word.occurence)){
            promises.push(new Promise((resolve, reject)=>reject(`${i}th word in the dictionary is not in object Format: ${word}`)));
            return promises
        }

        promises.push(getWordDetails(lookUpEndpoint, word));
        
    }

    return promises
};

module.exports={
    processFile,
    processData
}
