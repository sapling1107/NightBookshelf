// crawl.js
// 替夜的書屋自動抓取 BookWalker 新刊推薦書單

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const categories = [
  { name: "bl-novel", url: "https://www.bookwalker.com.tw/category/1?sort=publish_date&series_group=23" },
  { name: "bl-manga", url: "https://www.bookwalker.com.tw/category/1?sort=publish_date&series_group=24" },
  { name: "sci-fi", url: "https://www.bookwalker.com.tw/category/1?sort=publish_date&series_group=21" },
  { name: "mystery", url: "https://www.bookwalker.com.tw/category/1?sort=publish_date&series_group=28" },
  { name: "horror", url: "https://www.bookwalker.com.tw/category/1?sort=publish_date&series_group=26" },
  { name: "practical", url: "https://www.bookwalker.com.tw/category/2?sort=publish_date" }
];

async function crawlCategory(category) {
  const res = await axios.get(category.url);
  const $ = cheerio.load(res.data);
  const books = [];

  $('.bw-book-list > ul > li').each((i, el) => {
    if (i >= 30) return;
    const title = $(el).find('.bw-book-title').text().trim();
    const author = $(el).find('.bw-book-author').text().trim();
    const link = 'https://www.bookwalker.com.tw' + $(el).find('a').attr('href');
    const cover = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
    const description = $(el).find('.bw-book-desc').text().trim().slice(0, 150);
    books.push({ title, author, description, cover, link: { bookwalker: link }, category: category.name });
  });

  return books;
}

(async () => {
  let allBooks = [];
  for (const category of categories) {
    const books = await crawlCategory(category);
    allBooks = allBooks.concat(books);
  }

  // 去重（以書名為基準）
  const seen = new Set();
  const uniqueBooks = allBooks.filter(book => {
    if (seen.has(book.title)) return false;
    seen.add(book.title);
    return true;
  });

  fs.writeFileSync('recommend-books.json', JSON.stringify(uniqueBooks, null, 2), 'utf-8');
  console.log('✅ recommend-books.json 生成完成！');
})();
