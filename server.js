const app = require("./src/app");
require("dotenv").config();
const PORT = process.env.PORT || 3055;
app.listen(PORT, () => {
  console.log(`WSV eCommerce start with port ${PORT}`);
});
