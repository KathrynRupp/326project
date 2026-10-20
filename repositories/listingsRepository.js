import mongoose from "mongoose";

//specify schema and model for DB
const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, trim: true },
    listerName: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);
const Listing = mongoose.model("Listing", listingSchema);

//validate ids
export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

//get all listings from DB
export const getAll = async () => Listing.find().lean();

//create a listing in DB
export const create = async (data) => (await Listing.create(data)).toObject();

//update a listing in DB by id
export const updateById = async (id, data) =>
  Listing.findByIdAndUpdate(id, data, { new: true }).lean();

//find a listing in DB by id
export const findById = async (id) => Listing.findById(id).lean();

//delete a listing in DB by id
export const removeById = async (id) => {
  await Listing.findByIdAndDelete(id);
};
