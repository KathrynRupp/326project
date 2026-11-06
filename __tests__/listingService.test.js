import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/listingsRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake_id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

const { createListing, deleteListing, updateListing } =
  await import("../services/listingsService.js");

test("createListing rejects a missing title", async () => {
  const result = await createListing({
    title: "",
    listerName: "John Doe",
    description: "some description",
    category: "other",
  });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test("createListing rejects a whitespace-only title", async () => {
  const result = await createListing({
    title: " ",
    listerName: "John Doe",
    description: "some description",
    category: "other",
  });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test("createListing rejects a missing lister name", async () => {
  const result = await createListing({
    title: "some title",
    listerName: "",
    description: "some description",
    category: "other",
  });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test("createListing rejects a whitespace-only lister name", async () => {
  const result = await createListing({
    title: "some title",
    listerName: " ",
    description: "some description",
    category: "other",
  });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test("createListing rejects an empty category (dropdown box wasn't used)", async () => {
  const result = await createListing({
    title: "some title",
    listerName: "John Doe",
    description: "some description",
    category: "",
  });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test("createListing saves a valid listing and returns its DTO", async () => {
  const result = await createListing({
    title: "some title",
    listerName: "John Doe",
    description: "some description",
    category: "other",
  });
  expect(result.ok).toBe(true);
  expect(result.value).toEqual({
    title: "some title",
    listerName: "John Doe",
    description: "some description",
    id: "fake_id",
    category: "other",
  });
});

test("deleteListing fails when given a nonexistent listing ", async () => {
  const tmp = await createListing({
    title: "some title",
    listerName: "John Doe",
    description: "some description",
    category: "",
  });

  const res = await deleteListing(727);
  expect(res.ok).toBe(false);
  expect(res.error.status).toBe(404);
});

test("updateListing fails given a nonexistent listing ", async () => {
  const tmp = await createListing({
    title: "some title",
    listerName: "John Doe",
    description: "some description",
    category: "",
  });

  const res = await updateListing(727, {
    title: "another title",
    listerName: "Jane Doe",
    description: "another description",
    category: "",
  });
  expect(res.ok).toBe(false);
  expect(res.error.status).toBe(404);
});
