import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, trim: true },
    neededBy: { type: Date },
    requesterName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const RequestPost = mongoose.model("RequestPost", requestSchema);

export async function create(data) {
  return RequestPost.create(data);
}

export async function findAll() {
  return RequestPost.find().sort({ createdAt: -1 }).lean();
}
// find a request
export async function findById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return RequestPost.findById(id).lean();
}
// delete a request
export async function removeById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return RequestPost.findByIdAndDelete(id).lean();
}
