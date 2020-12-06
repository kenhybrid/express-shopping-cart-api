const Payments = require("../Models/Payments");
const paypal = require("paypal-rest-sdk");

//make paypal payments
paypal.configure({
  mode: "sandbox", // Sandbox or live
  client_id:
    "AfyKOutk0E9F-8L5pKRgIzR-h4W9qulKIF-SGyB8yNvEl7VjgXOJh21H1hN9YMmdGRFYp0qoKkv17OAs",
  client_secret:
    "EPKqCb0Ya8AJcu01f1afvGebJKzDS3WvG2vacofiYSpvV1pEcStC-GfUinFj-ztfzAUrxoEY3MfADTpp",
});

exports.pay = (req, res) => {
  //create payment object
  const payReq = JSON.stringify({
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:9000/paypal/success",
      cancel_url: "http://localhost:9000/paypal/cancel",
    },
    transactions: [
      {
        amount: {
          total: "2",
          currency: "USD",
        },
        description: "This is the payment transaction description.",
      },
    ],
  });

  //create payment
  paypal.payment.create(payReq, function (error, payment) {
    var links = {};

    if (error) {
      console.error(JSON.stringify(error));
    } else {
      // Capture HATEOAS links
      payment.links.forEach(function (linkObj) {
        links[linkObj.rel] = {
          href: linkObj.href,
          method: linkObj.method,
        };
      });

      // If the redirect URL is present, redirect the customer to that URL
      if (links.hasOwnProperty("approval_url")) {
        // Redirect the customer to links['approval_url'].href
        res.json(links["approval_url"].href);
      } else {
        console.error("no redirect URI present");
      }
    }
  });
};

exports.success = (req, res) => {
  //execute payment
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function (error, payment) {
    console.log(payment);
    //store it into db

    if (error) {
      console.error(JSON.stringify(error));
      res.json("error");
    } else {
      if (payment.state == "approved") {
        console.log("payment completed successfully");
        // render a template
        res.send(
          `<p>successful</p><br><a href="http://localhost:8080">home</a>`
        );
      } else {
        console.log("payment not successful");
      }
    }
  });
};

exports.cancel = (req, res) => {
  res.send("canceled");
};
