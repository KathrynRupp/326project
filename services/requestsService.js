import * as repo from "../repositories/requestsRepository.js";
import * as userRepository from "../repositories/usersRepository.js";

const CATEGORIES = ["calculators", "textbooks", "clothing", "kitchen", "other"];

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

const isOwnerOrAdmin = async (entry, actorId) => {
  if (entry.ownerId?.toString() === actorId) return true;
  const account = await userRepository.findById(actorId);
  return account?.role === "admin";
};

// validation
export async function createRequest(input = {}, actor) {
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
    ownerId: actor.id,
  });
}

export const updateRequest = async (id, data, actor) => {
  const existing = await repo.findById(id);
  if (!existing) throw httpError(404, "Request not found");

  if (!(await isOwnerOrAdmin(existing, actor.id))) {
    throw httpError(403, "You do not have permission to modify this request");
  }

  const title = (data.title || "").trim();
  const category = (data.category || "").trim();
  const requesterName = (data.requesterName || "").trim();

  if (!title) throw httpError(400, "Title is required.");
  if (!requesterName) throw httpError(400, "Your name is required.");
  if (!CATEGORIES.includes(category)) {
    throw httpError(400, "Please choose a valid category.");
  }

  let neededBy;
  if (data.neededBy) {
    neededBy = new Date(data.neededBy);
    if (isNaN(neededBy)) throw httpError(400, "Needed-by date is not valid.");
  }

  return repo.updateById(id, {
    title,
    category,
    requesterName,
    description: (data.description || "").trim(),
    neededBy,
  });
};

// get all the requests
export async function getAllRequests() {
  return repo.findAll();
}
// get a certain request
export async function getRequestById(id) {
  const request = await repo.findById(id);
  if (!request) throw httpError(404, "Request not found.");
  return request;
}
// delete
export const deleteRequest = async (id, actor) => {
  const existing = await repo.findById(id);
  if (!existing) {
    throw httpError(404, "Request not found");
  }

  if (!(await isOwnerOrAdmin(existing, actor.id))) {
    throw httpError(403, "You do not have permission to delete this request.");
  }
  await repo.removeById(id);
};
