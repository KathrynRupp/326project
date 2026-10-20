import * as service from "../services/requestsService.js";

export async function create(req, res) {
  const request = await service.createRequest(req.body);
  res.status(201).json(request);
}

export async function list(req, res) {
  const requests = await service.getAllRequests();
  res.render("requests", { requests });
}

export async function getOne(req, res) {
  const request = await service.getRequestById(req.params.id);
  res.json(request);
}
