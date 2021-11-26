const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.crabdatabase.info/en/photo-gallery/sea-life?ajax=1&page=';

module.exports = async function (Crabs) {
    let crabs = []
    
    for(var i = 1; i <= 20; i++) {
        await rp(url + i)
            .then((html) => {
                const $ = cheerio.load(html + 1);
                const divs = $('div > div > a')
                    .map((i, div) => {
                        return {
                            crab: $(div).attr('title'),
                            image: 'https://www.crabdatabase.info' + $(div).attr('href')
                        }
                    }).toArray();
    
                crabs = crabs.concat(divs);
            });
    }
    Crabs.create(crabs);
}

