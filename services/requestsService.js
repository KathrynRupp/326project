import * as repo from "../repositories/requestsRepository.js";

const CATEGORIES = ["calculators", "textbooks", "clothing", "kitchen", "other"];

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function createRequest(input = {}) {
  const title = (input.title || "").trim();
  const category = (input.category || "").trim();
  const requesterName = (input.requesterName || "").trim();

  if (!title) throw httpError(400, "Title is required.");
  if (!requesterName) throw httpError(400, "Your name is required.");
  if (!CATEGORIES.includes(category)) {
    throw httpError(400, "Please choose a valid category.");
  }

  let neededBy;
  if (input.neededBy) {
    neededBy = new Date(input.neededBy);
    if (isNaN(neededBy)) throw httpError(400, "Needed-by date is not valid.");
  }

  return repo.create({
    title,
    category,
    requesterName,
    description: (input.description || "").trim(),
    neededBy,
  });
}

export async function getAllRequests() {
  return repo.findAll();
}

export async function getRequestById(id) {
  const request = await repo.findById(id);
  if (!request) throw httpError(404, "Request not found.");
  return request;
}
