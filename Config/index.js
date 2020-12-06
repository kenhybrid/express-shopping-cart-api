require("dotenv").config();

module.exports = {
  //APP CONFIG
  TITLE: "Shop",
  ENV: process.env.NODE_ENV || "development",
  DB: process.env.DB_CONNECTION || "mongodb://127.0.0.1:27017/shop",
  PORT: process.env.PORT || 9000,
  SECRET: process.env.SECRET || "secret12",
  URL: process.env.BASE_URL || "http://localhost:9000/",

  //MAILING CONFIG
  EMAIL: process.env.EMAIL || "**********@gmail.com",
  PASSWORD: process.env.PASSWORD || "**********",
  PHONE: process.env.PHONE || "***********",
};
