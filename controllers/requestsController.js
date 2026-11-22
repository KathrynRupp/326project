import * as service from "../services/requestsService.js";
import { isValidId } from "../repositories/requestsRepository.js";

// create request
export async function create(req, res) {
  const request = await service.createRequest(req.body, req.user);
  res.status(201).json(request);
}
// get all of the requests
export async function list(req, res) {
  const requests = await service.getAllRequests();
  res.render("requests", { requests });
}
// get a certain request
export async function getOne(req, res) {
  const request = await service.getRequestById(req.params.id);
  res.json(request);
}

export const update = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a valid id" });
    return;
  }
  const request = await service.updateRequest(id, req.body, req.user);
  res.status(200).json(request);
};

// deleting a request
export async function destroy(req, res) {
  await service.deleteRequest(req.params.id, req.user);
  res.status(200).send("");
}
