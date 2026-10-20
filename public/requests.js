const form=document.querySelector("#request-form");
const list=document.querySelector("#requests");

const timedFetch = (url, options = {}) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(5000) });
const fetchJSON=async (url,options)=>{
  let response;
  try{
    response=await timedFetch(url,options);
  }
  catch(error){
    throw new Error(
      error.name==="TimeoutError"
      ? "The server did not answer within five seconds."
      : "Could not reach the server.",
    );
  }
  let body = {};
  try {
    body = await response.json();
  }
  catch {}
  if (!response.ok) {
    throw new Error(body.error || `The server answered ${response.status}.`);
  }
  return body;
};
const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
const fillDisplay = (display, request) => {
  const title = document.createElement("strong");
  title.textContent = `${request.title}:`;

  let text = ` (${request.category})`;
  if (request.description) text += ` ${request.description}`;
  text += ` requested by ${request.requesterName}`;
  if (request.neededBy) text += `, needed by ${formatDate(request.neededBy)}`;

  display.replaceChildren(title, text);
};

const buildItem = (request) => {
  const item = document.createElement("li");
  item.dataset.id = request._id;

  const display = document.createElement("span");
  display.className = "request-display";
  fillDisplay(display, request);

  item.append(display);
  return item;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const request = Object.fromEntries(new FormData(form));
  const button = form.querySelector("button");

  button.disabled = true;

  try {
    const saved = await fetchJSON(`/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    // The server lists newest first, so new requests go on top.
    list.prepend(buildItem(saved));
    form.reset();
  } catch (error) {
    alert(`Your request was not saved. ${error.message}`);
  } finally {
    button.disabled = false;
  }
});
