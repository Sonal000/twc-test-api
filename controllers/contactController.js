const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Contact = require("../models/contactModel");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createContact = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "fullname",
    "email",
    "phone",
    "gender"
  );
  filteredBody.user = req.user;
  const newContact = await Contact.create(filteredBody);
  res.status(201).json({
    status: "success",
    data: {
      newContact,
    },
  });
});

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({ user: req.user.id });
  res.status(200).json({
    status: "success",
    data: {
      contacts,
    },
  });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.contactID);
  if (!contact || contact.user != req.user.id) {
    return next(new AppError("No contact found with that ID", 404));
  }
  const filteredBody = filterObj(
    req.body,
    "fullname",
    "email",
    "phone",
    "gender"
  );
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.contactID,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      contact: updatedContact,
    },
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.contactID);
  if (!contact || contact.user != req.user.id) {
    return next(new AppError("No contact found with that ID", 404));
  }
  await contact.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
