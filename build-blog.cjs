const fs = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, 'articoli');
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const articles = fs.readdirSync(dir).filter(x => x.endsWith('.html') && x !== 'template.html').map(file => {
 const html = fs.readFileSync(path.join(dir,file),'utf8');
 const get = pattern => { const match = html.match(pattern); if(!match) throw new Error(`Missing article metadata in ${file}`); return decode(match[1].trim()); };
 return {title:get(/<h1[^>]*>([^<]+)<\/h1>/i),date:get(/<meta name="article-date" content="(\d{4}-\d{2}-\d{2})"/i),description:get(/<meta name="description" content="([^"]*)"/i),url:'articoli/'+file};
});
fs.writeFileSync(path.join(__dirname,'articles.js'),'window.ARTICLES = '+JSON.stringify(articles,null,2)+';\n');
