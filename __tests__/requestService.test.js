import {jest} from "@jest/globals";

jest.unstable_mockModule("../repositories/requestsRepository.js",()=>({
  create:jest.fn((data)=>({_id:"fake_id",...data})),
  findAll:jest.fn(),
  findById:jest.fn(),
  removeById:jest.fn(),
}));
const repo=await import("../repositories/requestsRepository.js");
const {createRequest,getAllRequests,getRequestById,deleteRequest}=await import("../services/requestsService.js");
const validInput={
  title:"Calculus",
  requesterName:"Bob",
  description: "Calculus I",
  category:"textbooks",
};
beforeEach(()=>{
  jest.clearAllMocks();
});

test("createRequest reject a missing title", async()=>{
  await expect(
    createRequest({...validRequest,title:""}),
  ).rejects.toMatchObject({status:400,message:"Title is required."});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a strictly whitespace title", async()=>{
  await expect(
    createRequest({...validRequest,title:" "}),
  ).rejects.toMatchObject({status:400,message:"Title is required."});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a missing requester name", async()=>{
  await expect(
    createRequest({...validRequest,requesterName:""}),
  ).rejects.toMatchObject({status:400,message:"Your name is required."});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a strictly whitespace requester name", async()=>{
  await expect(
    createRequest({...validRequest,requesterName:" "}),
  ).rejects.toMatchObject({status:400,message:"Your name is required."});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject an empty category", async()=>{
  await expect(
    createRequest({...validRequest,category:""}),
  ).rejects.toMatchObject({status:400,message:"Please choose a valid category."});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a category that is not on the list", async()=>{
  await expect(
    createRequest({...validRequest,category:"toys"}),
  ).rejects.toMatchObject({status:400,message:"Please choose a valid category."});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a neededBy value that is not a date", async()=>{
  await expect(
    createRequest({...validRequest,neededBy:"not-a-date"}),
  ).rejects.toMatchObject({status:400,message:"Needed-by date is not valid."});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest reject a call with no input at all", async()=>{
  await expect(createRequest()).rejects.toMatchObject({status:400});
  expect(repo.create).not.toHaveBeenCalled();
});
test("createRequest saves a valid request and return it", async()=>{
  const res=await createRequest(validRequest);
  expect(repo.create).toHaveBeenCalledTimes(1);
  expect(res).toEqual({
    _id:"fake-id",
    title:"Calculus",
    requesterName:"Bob",
    description: "Calculus I",
    category:"textbooks",
  });
});
test("createRequest trims text before saving", async()=>{
  await createRequest({
    title:" Calculus ",
    requesterName:" Bob ",
    description: " Calculus I ",
    category:" textbooks ",
  });
  expect(repo.create).toHaveBeenCalledWith({
    title:"Calculus",
    requesterName:"Bob",
    description: "Calculus I",
    category:"textbooks",
    neededBy:undefined,
  });
});
test("createRequest turns a valid neededBy string into a Date", async()=>{
  await createRequest({...validRequest,neededBy:"2026-11-20"});
  const saved=repo.create.mock.calls[0][0];
  expect(saved.neededBy).toBeInstanceOf(Date);
  expect(saved.neededBy.toISOString()).toBe("2026-11-20T00:00:00.000Z");
});
test("getAllRequests returns the repository's list", async()=>{
  const list=[{_id:"1"},{_id:"2"}];
  repo.findAll.mockResolvedValue(list);
  const res=await getAllRequests();
  expect(res).toEqual(list);
  expect(repo.findAll).toHaveBeenCalledTimes(1);
});
test("getRequestById returns an existing request", async()=>{
  repo.findById.mockResolvedVALUE({_id:"1", title:"Calculus"});
  const res=await getRequestById("1");
  expect(repo.findById).toHaveBeenCalledWith("1");
  expect(res).toEqual({_id:"1",title:"Calculus"});
});
test("getRequestById fails given a request that doesn't exist", async()=>{
  repo.findById.mockResolvedValue(null);
  await expect(getRequestById("787")).rejects.toMatchObject({status:404,message:"Request not found."});
});
test("deleteRequest fails given a request that doesn't exist", async()=>{
  repo.removeById.mockResolvedValue(null);
  await expect(deleteRequest("787")).rejects.toMatchObject({status:404,message:"Request not found."});
});
test("deleteRequest removes an existing request", async()=>{
  repo.removeById.mockResolvedValue({_id:"1"});
  await expect(deleteRequest("1")).resolves.toBeUndefined();
  expect(repo.removeById).toHaveBeenCalledWith("1");
});
