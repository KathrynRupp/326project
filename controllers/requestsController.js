import * as service from "../services/requestsService.js";

// create request
export async function create(req, res) {
  const request = await service.createRequest(req.body);
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
// deleting a request
export async function destroy(req, res) {
  await service.deleteRequest(req.params.id);
  res.status(204).send();
}
