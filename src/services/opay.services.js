const { OPAY_CONFIG } = require("../opay.config/opay.config");

//CREDIT CARD PAYMET
async function OPayPayment(data, callback) {
  //   let fetch = require("node-fetch");

  //   fetch(
  //     "https://sandboxapi.opaycheckout.com/api/v1/international/cashier/create",
  //     {
  //       method: "POST",
  //       headers: (headers = {
  //         Authorization: "Bearer " + OPAY_CONFIG.PUBLIC_KEY,
  //         "Content-Type": "application/json",
  //         MerchantID: OPAY_CONFIG.MERCHANT_ID,
  //       }),
  //       body: data,
  //     }
  //   )
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  var headers = {
    Authorization: "Bearer " + OPAY_CONFIG.PUBLIC_KEY,
    "Content-Type": "application/json",
    MerchantID: OPAY_CONFIG.MERCHANT_ID,
  };

  var options = {
    host: "sandboxapi.opaycheckout.com",
    // port: 443,
    path: "/api/v1/international/cashier/create",
    method: "POST",
    headers: headers,
  };

  var https = require("https");
  var req = https.request(options, function (res) {
    res.on("data", function (data) {
      return callback(null, JSON.parse(data));
    });
  });
  req.on("error", function (e) {
    return callback({
      message: e,
    });
  });
  req.write(JSON.stringify(data));
  req.end();
}

module.exports = {
  OPayPayment,
};
