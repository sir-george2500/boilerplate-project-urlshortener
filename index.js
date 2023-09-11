require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config({ path: 'sample.env' });
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const urlparser = require('url');
const app = express();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');








// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.DB_URI);
const db = client.db("url-shortener");
const urls = db.collection("urls");



app.use('/public', express.static(`${process.cwd()}/public`));



app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  // Check if the url is a valid US url 
  const url = req.body.url; // Extract the URL string from req.body
  const dnslookup = dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
    if (!address) {
      res.json({ error: "Invalid url" });
    } else {
      const urlsCount = await urls.countDocuments({});
      const urlDoc = {
        url,
        shorturl: urlsCount
      }

      const result = await urls.insertOne(urlDoc);
      console.log(result);

      res.json({ original_url: url, short_url: urlsCount });
    }
  })
});

app.get('/api/shorturl/:shorturl', async (req, res) => {
  const shorturl = req.params.shorturl;
  const urlDoc = await urls.findOne({shorturl:+shorturl})
  // res.json({ message: "sucess",
  //           urls:urlDoc  
  //          });
  res.redirect(urlDoc.url);
  
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

