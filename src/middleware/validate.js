const { body } = require('express-validator');

exports.validateNewUser = async function(req, _, next) {
  let validations = [
    body('username')
      .exists({ checkFalsy: true })
      .withMessage('آدرس ایمیل یک فیلد اجباری است')
      .isEmail()
      .withMessage('آدرس ایمیل نامعتبر است'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('رمز عبور یک فیلد اجباری است')
      .isLength({min: 8})
      .withMessage('رمز عبور حداقل باید ۸ کاراکتر باشد'),
    body('repeatPassword')
      .exists({ checkFalsy: true })
      .withMessage('تکرار رمز عبور یک فیلد اجباری است')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('تکرار رمز عبور با مقدار اصلی آن مطابقت ندارد')
  ];
  await Promise.all(validations.map(validation => validation.run(req)));
  next();
}

exports.validateLogin = async function(req, _, next) {
  let validations = [
    body('username')
      .exists({ checkFalsy: true })
      .withMessage('آدرس ایمیل یک فیلد اجباری است')
      .isEmail()
      .withMessage('آدرس ایمیل نامعتبر است'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('رمز عبور یک فیلد اجباری است')
      .isLength({min: 8})
      .withMessage('رمز عبور حداقل باید ۸ کاراکتر باشد')
  ];
  await Promise.all(validations.map(validation => validation.run(req)));
  next();
}