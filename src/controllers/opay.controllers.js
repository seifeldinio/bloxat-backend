const { OPAY_CONFIG } = require("../opay.config/opay.config");
const oPayServices = require("../services/opay.services");

//SEND REQUEST FROM KAIZEN SERVER TO OPAY SERVER TO GET THE INVOICE URL
exports.OPayPaymentFunction = (req, res, next) => {
  var body = {
    country: "EG",
    reference: Date.now().toString(),
    amount: {
      total: req.body.total,
      currency: "EGP",
    },
    returnUrl: req.body.returnUrl,
    callbackUrl: req.body.callbackUrl,
    cancelUrl: req.body.cancelUrl,

    expireAt: 30,
    userInfo: {
      userEmail: req.body.userEmail,
      userId: req.body.userId,
      userName: req.body.userName,
    },
    productList: req.body.productList,
    payMethod: req.body.payMethod,
  };

  oPayServices.OPayPayment(body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send(results);
  });
};
