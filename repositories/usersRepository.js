import User from "../models/userModel.js";

export async function findByEmail(email) {
  return User.findOne({ email }).lean();
}

export async function create(data) {
  return (await User.create(data)).toObject();
}

export async function updateRoleByEmail(email, role) {
  return User.findOneAndUpdate(
    { email },
    { role },
    { returnDocument: "after", runValidators: true },
  ).lean();
}

export const findById = async (id) => User.findById(id).lean();
