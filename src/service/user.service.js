"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  getUserByEmail,
  register,
  updateUser,
} = require("../model/user/user.repo");
const {
  isStrongPassword,
  isValidEmail,
  convertToObjectIdMongoDB,
} = require("../util");
const bcrypt = require("bcryptjs");

class UserService {
  static async login({ email, password }) {
    try {
      if (!email || !password) {
        throw new BadRequestError("All fields are required.");
      }
      const foundUser = await getUserByEmail({
        email,
        select: [
          "_id",
          "firstName",
          "lastName",
          "email",
          "password",
          "dob",
          "gender",
        ],
      });

      if (!foundUser) {
        throw new BadRequestError("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        throw new BadRequestError("Invalid email or password.");
      }
      delete foundUser.password;
      return foundUser;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  static async register(payload) {
    try {
      const { email, password } = payload;
      if (!isValidEmail(email)) {
        throw new BadRequestError("Invalid email");
      }
      if (!isStrongPassword(password)) {
        throw new BadRequestError("Password is not strong enough.");
      }
      const foundUser = await getUserByEmail({ email });
      if (foundUser) {
        throw new BadRequestError("Email is already registered.");
      }

      const salt = await bcrypt.genSalt(10);
      const hasPassword = await bcrypt.hash(password, salt);

      return await register({ payload: { ...payload, password: hasPassword } });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async updateUserInfo({ payload, _id }) {
    try {
      const { email, password } = payload;

      const foundUser = await getUserById(convertToObjectIdMongoDB(_id));
      if (foundUser) {
        throw new BadRequestError("User not found");
      }

      if (email) {
        if (!isValidEmail(email)) {
          throw new BadRequestError("Invalid email");
        }
        const isRegisterEmail = await getUserByEmail({ email });
        if (isRegisterEmail) {
          throw new BadRequestError("Email is already registered.");
        }
      }

      if (password) {
        delete payload.password;
      }

      return await updateUser({
        _id: foundUser._id,
        payload,
        select: ["_id", "firstName", "lastName", "email", "dob", "gender"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = UserService;
