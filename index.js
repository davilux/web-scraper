const puppeteer = require('puppeteer')

//Use the fs (file system) package to write what we scrape to files.
const fs = require('fs')

//All puppeteer operations are asynchronous, so wrap them in an async function:
const scrape = async () => {

  //Accept url as an argument:
  let url = process.argv[2]
  if(!url) url = 'http://books.toscrape.com/'

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(url)


  // Take a screenshot:
  const takeScreenshot = async () => {
    await page.screenshot({path:'bookSandbox.png', fullPage:true})
  }

  // Make a pdf:
  const makePdf = async () => {
    await page.pdf({path:'bookSandbox.pdf', format:'A4'})
  }

  // Log the title of the page:
  const logPageTitle = async () => {
    const html = await page.content()
    const title = await page.evaluate(() => document.title)
    console.log(title)
  }

  // Log all page text:
  const logAllPageText = async () => {
    const html = await page.content()
    const text = await page.evaluate(() => document.body.innerText)
    console.log(text)
  }

  // Log all the links:
  const logAllLinks = async () => {
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'), (element) => element.href )
    })
    console.log(links)
  }

  // Log all book titles:
  // Array.from() creates a new shallow-copied array from an array-like object. The callback specifies what information to include in the new array.

  const logAllTitles = async () => {
    const titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.product_pod h3 a'), (element) => element.title)
    })
    console.log(titles)
  }

  // Log all book data:
  const logBookData = async () => {
  const books = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product_pod'), (element) => ({
      title: element.querySelector('h3 a').title,
      link: element.querySelector('h3 a').href,
      price: element.querySelector('.product_price .price_color').innerText,
      starRating: element.querySelector('.star-rating').classList['1']
    }))
  })
  console.log(books)
  }
  // Save book data to a file:
  const saveBookDataToFile = async (filename) => {

    //We can use $$eval and .map instead of Array.from()
    const books = await page.$$eval('.product_pod', (elements) => elements.map(element => ({
      title: element.querySelector('h3 a').title,
      link: element.querySelector('h3 a').href,
      price: element.querySelector('.product_price .price_color').innerText,
      starRating: element.querySelector('.star-rating').classList['1']
    })))


      //Save data to a .JSON file:
      fs.writeFile(filename, JSON.stringify(books), (err)=> {
        if(err) throw err
        console.log('file saved')
      })
  }

  await saveBookDataToFile('books.json')

  //always close the browser when you're done.
  await browser.close()
}

scrape()
