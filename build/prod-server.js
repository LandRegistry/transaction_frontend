var path = require('path')
var express = require('express')

const app           = express(),  
      DIST_DIR      = path.join(__dirname, "../dist"),
      HTML_FILE     = path.join(DIST_DIR, "index.html"),
      DEFAULT_PORT  = 3000;

app.set("port", process.env.PORT || DEFAULT_PORT);

app.use(express.static(DIST_DIR));

app.get("*", (req, res) => res.sendFile(HTML_FILE));

console.log('> Starting prod server on port ' + app.get('port'))

app.listen(app.get("port"));