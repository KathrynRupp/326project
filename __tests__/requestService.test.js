import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/requestsRepository.js", () => ({
  isValidId: jest.fn(() => true),
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake_id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));
const repo = await import("../repositories/requestsRepository.js");
const { createRequest, getAllRequests, getRequestById, deleteRequest } =
  await import("../services/requestsService.js");
const validRequest = {
  title: "Calculus",
  requesterName: "Bob",
  description: "Calculus I",
  category: "textbooks",
};
beforeEach(() => {
  jest.clearAllMocks();
});

const bob = { id: "bob", role: "member" };
const bobbette = { id: "bobbette", role: "member" };
const admin = { id: "admin", role: "admin" };

test("createRequest reject a missing title", async () => {
  await expect(
    createRequest({ ...validRequest, title: "" }, bob),
  ).rejects.toMatchObject({ status: 400, message: "Title is required." });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a strictly whitespace title", async () => {
  await expect(
    createRequest({ ...validRequest, title: " " }, bob),
  ).rejects.toMatchObject({ status: 400, message: "Title is required." });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a missing requester name", async () => {
  await expect(
    createRequest({ ...validRequest, requesterName: "" }, bob),
  ).rejects.toMatchObject({ status: 400, message: "Your name is required." });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a strictly whitespace requester name", async () => {
  await expect(
    createRequest({ ...validRequest, requesterName: " " }, bob),
  ).rejects.toMatchObject({ status: 400, message: "Your name is required." });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject an empty category", async () => {
  await expect(
    createRequest({ ...validRequest, category: "" }, bob),
  ).rejects.toMatchObject({
    status: 400,
    message: "Please choose a valid category.",
  });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a category that is not on the list", async () => {
  await expect(
    createRequest({ ...validRequest, category: "toys" }, bob),
  ).rejects.toMatchObject({
    status: 400,
    message: "Please choose a valid category.",
  });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a neededBy value that is not a date", async () => {
  await expect(
    createRequest({ ...validRequest, neededBy: "not-a-date" }, bob),
  ).rejects.toMatchObject({
    status: 400,
    message: "Needed-by date is not valid.",
  });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a call with no input at all", async () => {
  await expect(createRequest()).rejects.toMatchObject({ status: 400 });
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest saves a valid request and return it", async () => {
  const res = await createRequest(validRequest, bob);
  expect(repo.create).toHaveBeenCalledTimes(1);
  expect(res).toEqual({
    _id: "fake_id",
    title: "Calculus",
    requesterName: "Bob",
    description: "Calculus I",
    category: "textbooks",
    neededBy: undefined,
    ownerId: "bob",
  });
});
test("createRequest trims text before saving", async () => {
  await createRequest(
    {
      title: " Calculus ",
      requesterName: " Bob ",
      description: " Calculus I ",
      category: " textbooks ",
    },
    bob,
  );
  expect(repo.create).toHaveBeenCalledWith({
    title: "Calculus",
    requesterName: "Bob",
    description: "Calculus I",
    category: "textbooks",
    neededBy: undefined,
    ownerId: "bob",
  });
});
test("createRequest turns a valid neededBy string into a Date", async () => {
  await createRequest({ ...validRequest, neededBy: "2026-11-20" }, bob);
  const saved = repo.create.mock.calls[0][0];
  expect(saved.neededBy).toBeInstanceOf(Date);
  expect(saved.neededBy.toISOString()).toBe("2026-11-20T00:00:00.000Z");
});
test("getAllRequests returns the repository's list", async () => {
  const list = [{ _id: "1" }, { _id: "2" }];
  repo.findAll.mockResolvedValue(list);
  const res = await getAllRequests();
  expect(res).toEqual(list);
  expect(repo.findAll).toHaveBeenCalledTimes(1);
});
test("getRequestById returns an existing request", async () => {
  repo.findById.mockResolvedValue({ _id: "1", title: "Calculus" });
  const res = await getRequestById("1");
  expect(repo.findById).toHaveBeenCalledWith("1");
  expect(res).toEqual({ _id: "1", title: "Calculus" });
});
test("getRequestById fails given a request that doesn't exist", async () => {
  repo.findById.mockResolvedValue(null);
  await expect(getRequestById("787")).rejects.toMatchObject({
    status: 404,
    message: "Request not found.",
  });
  expect(repo.removeById).not.toHaveBeenCalled();
});
test("deleteRequest fails given a request that doesn't exist", async () => {
  repo.findById.mockResolvedValue(null);
  await expect(deleteRequest("787")).rejects.toMatchObject({
    status: 404,
    message: "Request not found",
  });
});
test("deleteRequest removes an existing request", async () => {
  repo.findById.mockResolvedValue({ _id: "1", ownerId: "bob" });
  await expect(deleteRequest("1", bob)).resolves.toBeUndefined();
  expect(repo.removeById).toHaveBeenCalledWith("1");
});
