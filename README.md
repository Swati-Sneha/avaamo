# Avaamo
To find the top ten words from atext and use https://dictionary.yandex.net/api/v1/dicservice.json/lookup to get the word details

## avaamo.js
### processFile
```sh
input parameter: path of file
```
 - Reads the file asynchronously
 - Counts each word's (ignoring case) occurence
 - Maps the word and their occurence in JSON format
 - Returns promise of top 10 maps
 
### processData
```sh
input parameter: word dictionary with their occurence (received from processFile), language code (language of synonymns)
```
 - Takes each word and looks it up in https://dictionary.yandex.net/api/v1/dicservice.json/lookup asynchronously
 - Processes the API result to get word's synonymns in an array and it's part of Speech
 - Synonymns are captured only if it's part of speech matches with the original word
 - All the results for 10 words, including the word, it's occurence,it's part of speech and it's captured synonymns are returned as array of promises

 
## app.js
 - Calls processFile function and send its result to processData
 - The result from process data is resolved using Promise.all and an array of the word data from processData is printed
 
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
