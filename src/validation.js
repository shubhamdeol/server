// validation
const joi = require("joi");
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

// login validations
const loginValidation = (data) => {
  const schema = joi.object({
    phone: joi.string().custom((value, helpers) => {
      const number = phoneUtil.parseAndKeepRawInput(value, "IN");
      if (!phoneUtil.isValidNumber(number)) {
        return helpers.message("Phone Number is not valid");
      }
      const countryCode = number.getCountryCode();
      const nationalNumber = number.getNationalNumber();
      return `+${countryCode}${nationalNumber}`;
    }, "custom validation"),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
