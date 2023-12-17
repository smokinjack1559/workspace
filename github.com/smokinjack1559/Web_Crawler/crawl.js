const { JSDOM } = require('jsdom')


function normalizeURL(url){
    const urlObj = new URL(url)

    let host = urlObj.host.toLowerCase()
    let path = urlObj.pathname.toLowerCase()

    if (path.charAt(path.length-1) == '/'){
        path = path.substring(0, path.length-1)
    }

    normURL = host + path

    return normURL
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    
    const dom = new JSDOM(htmlBody)

    

    const aElements = dom.window.document.querySelectorAll('a')

    

        for (const aElement of aElements) {
            
            let url = ''
            // Invalid path
            if(aElement.href.charAt(0) != '/'){
                continue
            }

            // Absolute
            if(aElement.href.charAt(0) != '/'){
                try {
                    url = new URL(aElement.href)
                    urls.push(url.href)
                  } catch (err){
                    console.log(`${err.message}: ${aElement.href}`)
                  }
                
            }   
        
        // Relative
            if(aElement.href.charAt(0) === '/'){
                try {
                    url = new URL(aElement.href, baseURL)
                    urls.push(url.href)
                  } catch (err){
                    console.log(`${err.message}: ${aElement.href}`)
                  }
            }

    }

    return urls
}    

async function crawlPage(baseURL, currentURL, pages){

    const baseUrlObj = new URL(baseURL)
    const currentUrlObj = new URL(currentURL)

    if(baseUrlObj.hostname != currentUrlObj.hostname){
        return pages
    }

    const normCurrentURL = normalizeURL(currentURL)

    if(pages[normCurrentURL]){

        pages[normCurrentURL].count++
        return pages
    }else{

        pages[normCurrentURL] = {url: normCurrentURL, count: 1}
    }

    try { 
        const resp = await fetch(currentURL)

        const status = resp.status
        const type = resp.headers.get('content-type')

        if (status >= 400){
            console.log('Error: ${status}')
            return pages
        }

        if (!type.includes('text/html')){
            console.log(`Error: Content type ${type}`)
            return pages
        }
      
        const txt = await resp.text()

        const urls = getURLsFromHTML(txt, baseURL)

        for (const url of urls) {
            await crawlPage(baseURL, url, pages)
        }

        return pages

    } catch (err){
        console.log(err.message)
      }   
} 
    
module.exports = {
    crawlPage,
    normalizeURL,
    getURLsFromHTML
  }

