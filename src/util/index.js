const { Types } = require("mongoose");

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const getSkip = ({ limit, page }) => {
  const limitValue = +limit;
  const pageValue = +page;

  if (Number.isNaN(limitValue) || Number.isNaN(pageValue)) {
    // Handle the case where the values are not valid numbers
    // For example, throw an error or set default values
    throw new Error("Invalid page or limit value");
    // OR
    // return a default skip value
    // return 0;
  }
  return (pageValue - 1) * limitValue;
};
const convertToObjectIdMongoDB = (id) => new Types.ObjectId(id);

module.exports = {
  getSelectData,
  getUnSelectData,
  getSkip,
  convertToObjectIdMongoDB,
};
