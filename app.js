const express = require('express');
const app = express();

const postBank = require("./postBank");

const morgan = require("morgan");
const {find} = require('./postBank');

app.use(morgan('dev'));



app.use(express.static('public'));

app.get("/", (req, res) => {
  const posts = postBank.list();
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizarding News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizarding News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
           <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`



res.send(html);
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = postBank.find(id)

  if (!post.id) {
		throw new Error('This was not found. It may not Exist')
	} else {
		const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/index.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
        <p>${post.title} <small>(by ${post.name})</small></p>
        <p>${post.content}</p>
        </div></div>
        `; 
  
        res.send(html);
  }
});

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(404).send(`
		This Wizard has no news for you! You shall not pass!
    <div style="width:100%;height:0;padding-bottom:57%;position:relative;"><iframe src="https://giphy.com/embed/OdyGA2spBFRCg" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/hoppip-art-film-OdyGA2spBFRCg"></a></p>
	`)
  })

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});


