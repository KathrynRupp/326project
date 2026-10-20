import * as listingsService from "../services/listingsService.js";
import { isValidId } from "../repositories/listingsRepository.js";

//index function
export const index = async (req, res) => {
  const listings = await listingsService.getAllListings();
  res.set("X-Total-Count", listings.length);
  res.status(200).render("listings", { listings });
};

//create function
export const create = async (req, res) => {
  const listing = await listingsService.createListing(req.body);
  if (!listing.ok) {
    res.status(listing.error.status).json({ error: listing.error.message });
    return;
  }
  res.status(201).json(listing.value);
};

//update function
export const update = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a valid id" });
    return;
  }
  const listing = await listingsService.updateListing(id, req.body);
  if (!listing.ok) {
    res.status(listing.error.status).json({ error: listing.error.message });
    return;
  }
  res.status(200).json(listing.value);
};

//destroy function
export const destroy = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a valid id" });
    return;
  }
  const listing = await listingsService.deleteListing(id);
  if (!listing.ok) {
    res.status(listing.error.status).json({ error: listing.error.message });
    return;
  }
  res.status(204).send();
};
