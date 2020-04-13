const Yup = require("yup");

exports.validSchema = Yup.object({
  name: Yup.string()
    .max(50, "Must 50 characters or less")
    .required("You must enter Name"),
  password: Yup.string()
    .matches(/^[a-zA-Z0-9]{0,}$/, "Password have only latin letters and digits")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(40, "Must be 40 characters or less")
    .matches(/[0-9]+/, "Password must contain at least one digit")
    .matches(/[A-Z]+/, "Password must contain an one uppercase character")
    .required("You must enter password"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("You must confirm password"),
  email: Yup.string()
    .email("Invalid email address")
    .required("You must enter email"),
  website: Yup.string().url("Mustbe a valid url"),
  age: Yup.number("Must be an integer")
    .min(18, "Must be in range of 18 and 65")
    .max(65, "Must be in range of 18 and 65")
    .required("You must enter your age"),
  skills: Yup.array().of(Yup.string()),
  acceptedTerms: Yup.boolean()
    .required("Required")
    .oneOf([true], "You must accept the terms and conditions.")
});
