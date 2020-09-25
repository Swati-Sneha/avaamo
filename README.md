# Avaamo
To find the top ten words from atext and use https://dictionary.yandex.net/api/v1/dicservice.json/lookup to get the word details

## avaamo.js
### processFile
```sh
input parameter: path of file

returns: Promise of an array of Top 10 occuring words along with their occurence count
```
 - Reads the file asynchronously
 - Counts each word's occurence (ignoring case)
 - Maps the word and their occurence to JSON object
 - Returns promise of top 10 maps (in decreasing order of occurence)
 
### processData
```sh
input parameter: word dictionary with their occurence (received from processFile), language code (language of synonymns)

returns: promise array of word data processed from Yandex API
```
> For more details on **lang** parameter, refer [Yandex Doc](https://yandex.com/dev/dictionary/doc/dg/reference/getLangs-docpage/)

 - Takes each word and looks it up in https://dictionary.yandex.net/api/v1/dicservice.json/lookup asynchronously
 - Processes the API result to get word's synonymns (in an array) and it's Part of Speech
 - Synonymns are captured only if it's part of speech matches with the original word
 - The data for 10 words, including the word, it's occurence,it's part of speech and it's captured synonymns are returned as array of promises

 
## app.js
 - Calls processFile function and send its result to processData, along with the second parameter of language (This language defines the language in which we expext synonymns of the word). Set as 'en' by default.
 - The result from process data is resolved using Promise.all and an array wordData recieved from processData, is printed
 
### Run the script

```sh
$ npm install
$ npm start
```

## SAMPLE OUTPUT:

Lang in processData passed as 'en' (english):


![lang='en'](https://github.com/Swati-Sneha/avaamo/blob/main/screenshots/en.png)

Lang in processData passed as 'it' (italian):


![lang='it'](https://github.com/Swati-Sneha/avaamo/blob/main/screenshots/it.png)
