const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const fs = require("fs");
const path = require("path");
const Orders = require("../Models/Orders");

const pdf = async function createpdf(data, invoicename, orderid) {
  try {
    //update database of the invoice path
    const pdfpath = await path.join(`./uploads/invoices/${invoicename}.pdf`);
    //update db with invoice path
    const update = {
      o_invoice: pdfpath,
    };
    Orders.updateOne({ _id: orderid }, update)
      .then((doc) => {
        console.log("invoice path updated");
      })
      .catch((error) => {
        console.log("invoice path not updated");
      });

    const templatehtml = await fs.readFileSync(
      path.join(process.cwd(), "./uploads/templates/receipt.hbs"),
      "utf8"
    );
    const template = await hbs.compile(templatehtml);
    const html = template(data);

    const options = {
      // width: "1230px",
      headerTemplate: "<p>welcome</p>",
      footerTemplate: "<p>hello @ baraka</p>",
      path: pdfpath,
      displayHeaderFooter: true,
      margin: {
        // top:"20",bottom:"20",left:"20",right:"20"
      },
      format: "A4",
      printBackground: true,
    };

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();
    await page.emulateMediaFeatures("screen");
    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
      waitUntil: "networkidle0",
    });
    await page.pdf(options);
    await browser.close();
    // console.log(pdfpath);
  } catch (error) {
    console.log("failed in pdf creation");
  }
};

module.exports = pdf;
