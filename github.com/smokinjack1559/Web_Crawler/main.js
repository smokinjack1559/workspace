const { printReport } = require('./report.js')
const { crawlPage } = require('./crawl.js')

async function main(){
    const { argv, exit } = require('node:process');

    // print process.argv
    argv.forEach((val, index) => {
      console.log(`${index}: ${val}`);
    });
    
    const argvlen = process.argv.length

    if (argvlen < 3){
        console.log(`No url provided`)
        return
    }

    if (argvlen > 3){
        console.log(`More than one url provided`)
        return
    }

    const baseURL = process.argv[2]
 
    console.log(`Starting crawl of: ${baseURL}`)

    const pages = await crawlPage(baseURL, baseURL, {})

    printReport(pages)
}    
    
main()        
