
const puppeteer = require('puppeteer');
const fs = require('fs');

//clear write-to file
fs.truncateSync("./product2.txt", 0, function(){console.log('done clearning file')});

//start scrape


    let scrape = async () => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        const urls = 
        ['https://tjmaxx.tjx.com/store/jump/product/513-Chocolate-Truffle-Jeans/1000432544?colorId=NS1003426&pos=1:1&Ntt=513%20Chocolate%20Truffle%20Jeans',
        'https://tjmaxx.tjx.com/store/jump/product/511-Slim-Fit-Comeback-Kid-Jeans/1000369016?colorId=NS1003468&pos=1:2&Ntt=511%20Slim%20Fit%20Comeback%20Kid%20Jeans',
        'https://tjmaxx.tjx.com/store/jump/product/511-Slim-Fit-Dinosaur-Stretch-Adapt-Jeans/1000388036?colorId=NS1003473&pos=1:1&Ntt=511%20Slim%20Fit%20Dinosaur%20Stretch%20Adapt%20Jeans',
        'https://tjmaxx.tjx.com/store/jump/product/510-Skinny-Fit--Stretch-Night-Shift-Jeans/1000369295?colorId=NS1003468&pos=1:1&Ntt=510%20Skinny%20Fit%20Stretch%20Night%20Shift',
        'https://tjmaxx.tjx.com/store/jump/product/502--Stretch-Twill-Chinos/1000369335?colorId=NS1003583&pos=1:3&Ntt=502%20Stretch%20Twill%20Chinos',
        'https://tjmaxx.tjx.com/store/jump/product/502-Regular-Tapered-Nightwatch-Jeans/1000432545?colorId=NS1282492&pos=1:1&Ntt=502%20Regular%20Tapered%20Nightwatch%20Jeans',
        'https://tjmaxx.tjx.com/store/jump/product/502-Stretch-Twill-Chinos/1000369351?colorId=NS1003432&pos=1:1&Ntt=502%20Stretch%20Twill%20Chinos',
        'https://tjmaxx.tjx.com/store/jump/product/502-Stretch-Twill-Chinos/1000369351?colorId=NS1003432&pos=1:1&Ntt=502%20Stretch%20Twill%20Chinos',
        'https://tjmaxx.tjx.com/store/jump/product/502-Regular-Taper--Ruby-City-Jeans/1000432459?colorId=NS4310488&pos=1:1&Ntt=502%20Regular%20Taper%20Ruby%20City%20Jeans',
        'https://tjmaxx.tjx.com/store/jump/product/501-Original-Fit-Jeans/1000360444?colorId=NS1003462&pos=1:1&Ntt=501%20Original%20Fit%20Jeans',
        'https://tjmaxx.tjx.com/store/jump/product/502-Regular-Tapered-Jeans/1000319344?colorId=NS1003432&pos=1:1&Ntt=502%20Regular%20Tapered%20Jeans',
        'https://tjmaxx.tjx.com/store/jump/product/502-Regular-Taper-West-Witch-Jeans/1000432532?colorId=NS4310488&pos=1:3&Ntt=502',
        'https://tjmaxx.tjx.com/store/jump/product/511-Slim-Fit-Supernova-Pants/1000432677?colorId=NS1171985&pos=1:6&Ntt=511'
        
    ]
        ;

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            await page.goto(`${url}`);
            await page.waitFor(1000);
        
            const result = await page.evaluate(() => {
                let title = document.querySelector('.product-brand').innerText;
                let price = document.querySelector('.product-price').innerText;
                let description = document.querySelector('.product-title').innerText;
                let sizes = document.querySelector('form.product-form.addToCartForm').innerText;
                
                return {
                    title,
                    price,
                    description,
                    sizes
                }

            });

            var myJSON = JSON.stringify(result);
            console.log(myJSON);

// end scrape then start saving content to .txt file
            
            fs.appendFileSync("./product2.txt", myJSON, (err) => {
                if (err) {
                    console.error(err);
                    return;
                };

            });
        
        }

        browser.close();
        console.log("New product file has been created");
    
    };


// start checking old and new .txt file for differences then highlite in console - added text in console is green, missing text is red, same text is white
// problem : I want this to be a call back that is executed last -- fix coming, I hope






scrape().then((value) => {

    require('colors');
    var jsdiff = require('diff');
     
    var one = fs.readFileSync('product.txt', 'utf8');
    var other = fs.readFileSync('product2.txt', 'utf8');
     
    var diff = jsdiff.diffChars(one, other);
     
    diff.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
      process.stderr.write(part.value[color]);
    });
     
    fs.truncateSync("./product.txt", 0, function(){console.log('done clearning file')});

    fs.copyFileSync("./product2.txt", "product.txt", (err) => {
        if (err) throw err;
        console.log('product2.txt was copied to product.txt');
      });




});
