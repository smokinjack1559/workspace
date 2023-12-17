
function sortPages(pages){
    const pagesArray =[]


    for (const [key, value] of Object.entries(pages)){
        pagesArray.push(value)
    }
    
    const sortedPagesArray = pagesArray.sort((a, b) => b.count - a.count)
    
    return sortedPagesArray
}

function printReport(pages){
    const sortedPagesArray = sortPages(pages)

    console.log('Report starting...')

    for (const page of sortedPagesArray){

        console.log(`Found ${page.count} internal links to ${page.url}`)
    }

}

module.exports = {
    sortPages,
    printReport
  }