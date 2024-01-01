const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const adminRouter = require('./routes/admin.routes')

dotenv.config();
const app = express();
const PORT = 3000;

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("successfully connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use("/v1/api/auth", authRouter);
app.use("/v1/api/user", userRouter);
app.use("/v1/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});