// import bcrypt from "bcryptjs";
import User from "../models/User";
// import { userList } from "./userList";

const createAdmin = async () => {
  // const name = "Admin";
  // const salt = await bcrypt.genSalt(10);
  // const password = await bcrypt.hash("123456", salt);
  // const email = "admin@admin.com";
  // const admin = await User.findOne({ email });
  // if (!admin) {
  //   const newUser = new User({
  //     name: name,
  //     email: email,
  //     password: password,
  //     isAdmin: admin,
  //   });

  //   await newUser.save();
  //   console.log("Admin user added successfully.");
  // } else {
  //   console.log("Admin user already exists.");
  // }
  // userList.forEach(async (user) => {
  //   const userExists = await User.findOne({ email: user.email });
  //   if (!userExists) {
  //     const newUser = new User(user);
  //     const salt = await bcrypt.genSalt(10);
  //     newUser.password = await bcrypt.hash(user.password, salt);
  //     await newUser.save();
  //   }
  // });

  // Check if admin user exists, if not, create one
};

module.exports = createAdmin;
