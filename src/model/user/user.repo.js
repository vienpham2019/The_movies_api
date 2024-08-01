"use strict";

const { getSelectData } = require("../../util");
const userModel = require("./user.model");
// Get
const getUserByEmail = async ({ email, select = [] }) => {
  return await userModel
    .findOne({ email })
    .select(getSelectData(select))
    .lean()
    .exec();
};

const getUserById = async ({ _id, select = [] }) => {
  return await userModel
    .findById(_id)
    .select(getSelectData(select))
    .lean()
    .exec();
};
// Create
const register = async ({ payload }) => {
  return await userModel.create(payload);
};

// Update
const updateUser = async ({ payload, _id, select }) => {
  return await userModel
    .updateOne({ _id }, payload)
    .select(getSelectData(select))
    .lean()
    .exec();
};

module.exports = {
  getUserByEmail,
  register,
  getUserById,
  updateUser,
};
