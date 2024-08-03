"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  getUserByEmail,
  register,
  updateUser,
  getUserById,
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
      delete payload?._id;
      delete payload?.password;
      const { email } = payload;
      const foundUser = await getUserById({
        _id: convertToObjectIdMongoDB(_id),
      });

      if (!foundUser) {
        throw new BadRequestError("User not found");
      }

      if (email && foundUser.email != email) {
        if (!isValidEmail(email)) {
          throw new BadRequestError("Invalid email");
        }
        const isRegisterEmail = await getUserByEmail({ email });
        if (isRegisterEmail) {
          throw new BadRequestError("Email is already registered.");
        }
      }

      return await updateUser({
        _id: foundUser._id,
        payload,
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async changePassword({ payload, _id }) {
    try {
      delete payload?._id;
      const { password } = payload;
      if (!password) {
        throw new BadRequestError("All field required");
      }
      const foundUser = await getUserById({
        _id: convertToObjectIdMongoDB(_id),
      });

      if (!foundUser) {
        throw new BadRequestError("User not found");
      }

      const salt = await bcrypt.genSalt(10);
      const hasPassword = await bcrypt.hash(password, salt);

      return await updateUser({
        _id: foundUser._id,
        payload: { password: hasPassword },
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = UserService;
