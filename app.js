let express = require('express');

let app = express();

app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/vendor`));

app.listen(process.env.PORT || 3000);
