const puppeteer = require('puppeteer')

//Use the fs (file system) package to write what we scrape to files.
const fs = require('fs')

//All puppeteer operations are asynchronous, so wrap them in an async function:
const scrape = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://books.toscrape.com/')


  ////Take a screenshot:
  // await page.screenshot({path:'bookSandbox.png', fullPage:true})

  ////Create a pdf:
  // await page.pdf({path:'bookSandbox.pdf', format:'A4'})

  ////Get the title of the page:
  // const html = await page.content()
  // const title = await page.evaluate(() => document.title)
  // console.log(title)

  ////Get all the text:
  // const html = await page.content()
  // const text = await page.evaluate(() => document.body.innerText)
  // console.log(text)

  // //Get all the links:
  // const links = await page.evaluate(() => {
  //   return Array.from(document.querySelectorAll('a'), (element) => element.href )
  // })
  // console.log(links)

  //   //Get all the book titles.
  //   //Array.from() creates a new shallow-copied array from an array-like object. The callback specifies what information to include in the new array.
  // const titles = await page.evaluate(() => {
  //   return Array.from(document.querySelectorAll('.product_pod h3 a'), (element) => element.title)
  // })
  // console.log(titles)


  // //Get all the book data:
  // const books = await page.evaluate(() => {
  //   return Array.from(document.querySelectorAll('.product_pod'), (element) => ({
  //     title: element.querySelector('h3 a').title,
  //     link: element.querySelector('h3 a').href,
  //     price: element.querySelector('.product_price .price_color').innerText,
  //     starRating: element.querySelector('.star-rating').classList['1']
  //   }))
  // })
  // console.log(books)

  //Different way to accomplish the same thing. We can use $$eval and .map instead of Array.from()
  const books = await page.$$eval('.product_pod', (elements) => elements.map(element => ({
    title: element.querySelector('h3 a').title,
    link: element.querySelector('h3 a').href,
    price: element.querySelector('.product_price .price_color').innerText,
    starRating: element.querySelector('.star-rating').classList['1']
  })))

  //Save data to a .JSON file:
  fs.writeFile('books.json', JSON.stringify(books), (err)=> {
    if(err) throw err
    console.log('file saved')
  })


  //always close the browser when you're done.
  await browser.close()
}

scrape()
