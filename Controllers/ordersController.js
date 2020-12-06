const Orders = require("../Models/Orders");
const pdf = require("../Middlewares/invoice");
const { EMAIL, PASSWORD, TITLE } = require("../Config");
const path = require("path");
const { findOneAndUpdate } = require("../Models/Orders");

//create order
exports.create = (req, res) => {
  const orderno = Math.floor(100000 + Math.random() * 900000);
  const order = new Orders({
    o_no: orderno,
    o_status: req.body.o_status,
    o_products: req.body.o_products,
    o_total: req.body.o_total,
    o_paymentmethod: req.body.o_paymentmethod,
    o_customername: req.body.o_customername,
    o_customerphone: req.body.o_customerphone,
    o_customeremail: req.body.o_customeremail,
    o_invoice: req.body.o_invoice,
  });
  order
    .save()
    .then((doc) => {
      //generate invoice with the data and update the invoice field
      pdf(doc, doc.o_no, doc._id);
      // return doc;
    })
    .then(() => {
      console.log(doc);
      // send the invoice attachment
      Orders.findOne({ _id: doc._id })
        .then((result) => {
          // create a transporter
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: EMAIL,
              pass: PASSWORD,
            },
          });
          const message = {
            from: TITLE + `<${EMAIL}>`, // sender address
            to: result.o_customeremail, // list of receivers req.body.email
            subject: "ORDER PLACEMENT SUCCESSFUL", // Subject line
            // text: `${this.password}`, // plain text body
            html: `
        <br>
        <h6>Hi...</h6>
        <br>
        <p>Your order has been placed successfully and below is an attachment of your invoice</p>
        <p>Thank you for shopping with us</p>
         `, // html body
            attachments: [
              {
                filename: `${result.o_no}`,
                path: path.join(__dirname, `../${result.o_invoice}`),
                contentType: "application/pdf",
              },
            ],
          };
          // send mail with defined transport object
          transporter
            .sendMail(message)
            .then(() => {
              res.json({
                message: "Mail has been sent order has been placed successfuly",
              });
            })
            .catch((error) => {
              res.json({ error: "Mail has failed" });
            });
        })
        .catch((error) => {
          res.json({ error: "Order fetch has failed" });
        });
    })
    .catch((error) => {
      res.json({ error: "Order creation has failed" });
    });
};

//get all order
exports.all = (req, res) => {
  Orders.find({})
    .then((doc) => {
      if (doc < 1) {
        res.json({ error: "No Orders found" });
      } else {
        const count = doc.length;
        res.json({ count, doc });
      }
    })
    .catch((error) => {
      res.json({ error: "Failed to fetch orders" });
    });
};

//get one order
exports.one = (req, res) => {
  const id = req.params.orderId;
  Orders.findById({ _id: id })
    .then((doc) => {
      if (doc < 1) {
        return res.json({ error: "Order dosn`t exist" });
      }
      res.json(doc);
    })
    .catch((error) => {
      res.json({ error: "No order found" });
    });
};

//delete an order

exports.delete = (req, res) => {
  const id = req.params.orderId;
  Orders.findById({ _id: id }).then((doc) => {
    // deleting from uploads
    fs.unlink(doc.o_invoice, (err) => {
      if (err) {
        console.log(err);
      } else {
        //deleting from db
        Orders.deleteOne({ _id: id })
          .then(() => {
            res.json({ message: "Order  is deleted" });
          })
          .catch((err) => {
            res.json({ message: "Order  not deleted" });
          });
      }
    });
  });
};
