const { body, param } = require('express-validator');

exports.validateDeleteUrl = async function(req, _, next) {
  let validation = 
    param('urlId')
      .exists({ checkFalsy: true })
      .withMessage('یک پارامتر اجباری است urlId');

  await validation.run(req);
  next();
}

exports.validateNewUrl = async function(req, _, next) {
  let validations = [
    body('url')
      .exists({ checkFalsy: true })
      .withMessage('آدرس لینک اجباری است')
      .custom(value => !value.startsWith('http://') && !value.startsWith('https://'))
      .withMessage('آدرس لینک را بدون پروتکل (http یا https) وارد نمایید')
      .isURL()
      .withMessage('آدرس لینک معتبر نمی باشد'),
    body('protocol')
      .exists({ checkFalsy: true })
      .withMessage('پروتکل')
      .custom(value => value === 'http' || value === 'https')
      .withMessage('پروتکل انتخابی مجاز نمی باشد')
  ];

  await Promise.all(validations.map(validation => validation.run(req)));
  next();
}

exports.validateNewUser = async function(req, _, next) {
  let validations = [
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('آدرس ایمیل یک فیلد اجباری است')
      .isEmail()
      .withMessage('آدرس ایمیل نامعتبر است'),
    body('fullName')
      .exists({ checkFalsy: true })
      .withMessage('نام و نام خانوادگی یک فیلد اجباری است'),
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
    body('email')
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