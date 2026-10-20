import { Ok, Err } from "../result.js";
import { toListingDto } from "../dtos/listingsDto.js";
import * as repo from "../repositories/listingsRepository.js";

const CATEGORIES = ["calculators", "textbooks", "clothing", "kitchen", "other"];

//validate listing
const validateListing = ({ title, listerName, description, category }) => {
  if (!title || !listerName || !CATEGORIES.includes(category)) {
    return Err({
      status: 400,
      message: "title, name of lister, and correct category are required.",
    });
  }
  return Ok({ title, listerName, description, category });
};

//get all listings
export const getAllListings = async () =>
  (await repo.getAll()).map(toListingDto);

//create a listing
export const createListing = async (data) => {
  const listing = validateListing(data);
  if (!listing.ok) return listing;
  return Ok(toListingDto(await repo.create(listing.value)));
};

//update a listing by id
export const updateListing = async (id, data) => {
  const existing = await repo.findById(id);
  if (!existing) return Err({ status: 404, message: "Entry not found" });

  const listing = validateListing(data);
  if (!listing.ok) return listing;
  return Ok(toListingDto(await repo.updateById(id, listing.value)));
};

//delete a listing by id
export const deleteListing = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) {
    return Err({ status: 404, message: "Listing not found" });
  }
  await repo.removeById(id);
  return Ok(null);
};
