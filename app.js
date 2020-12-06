const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT, DB } = require("./Config");

//initializing app
const app = express();

//midllewares
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

//routes
app.use("/products", require("./Routes/products"));
app.use("/uis", require("./Routes/uis"));
app.use("/brands", require("./Routes/brands"));
app.use("/users", require("./Routes/users"));
app.use("/categories", require("./Routes/categories"));
app.use("/orders", require("./Routes/orders"));
app.use("/paypal", require("./Routes/paypal"));

// const data = require("./database.json");

// const pdf = require("./Middlewares/test");

// const name = "hello" + new Date().toISOString();

// pdf(data, name);

//app listening
app.listen(PORT, () => {
  //connection to db and serving
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Connected to db & Serving on port ${PORT} `);
    })
    .catch((err) => {
      console.log("Could not connect to db" + err);
      process.exit();
    });
});
