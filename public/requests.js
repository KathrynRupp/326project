const form = document.querySelector("#request-form");
const list = document.querySelector("#requests");
const status = document.querySelector("#status");

const announce = (message) => {
  status.textContent = "";
  setTimeout(() => {
    status.textContent = message;
  }, 50);
};

const timedFetch = (url, options = {}) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(5000) });
const fetchJSON = async (url, options) => {
  let response;
  try {
    response = await timedFetch(url, options);
  } catch (error) {
    throw new Error(
      error.name === "TimeoutError"
        ? "The server did not answer within five seconds."
        : "Could not reach the server.",
    );
  }
  let body = {};
  try {
    body = await response.json();
  } catch {}
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

const makeButton = (className, label) => {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.textContent = label;
  return button;
};
const labelItemButtons = (item, title) => {
  item.querySelector(".edit-btn").setAttribute("aria-label", `Edit ${title}`);
  item
    .querySelector(".delete-btn")
    .setAttribute("aria-label", `Delete ${title}`);
};

const makeField = (name, value, labelText, type = "text") => {
  const label = document.createElement("label");
  label.className = "min-w-0 sm:flex-1";
  const text = document.createElement("span");
  text.className = "sr-only";
  text.textContent = labelText;
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.value = value;
  input.className = "form-input";
  label.append(text, input);
  return label;
};

const buildItem = (request) => {
  const item = document.createElement("li");
  item.className = "card flex flex-wrap items-center gap-2";
  item.dataset.id = request._id;
  item.dataset.title = request.title;
  item.dataset.category = request.category;
  item.dataset.description = request.description;
  item.dataset.requesterName = request.requesterName;

  const display = document.createElement("span");
  display.className =
    "request-display basis-full min-w-0 break-words text-sm sm:flex-1 sm:basis-0";
  fillDisplay(display, request);

  const deleteBtn = makeButton("delete-btn btn-delete", "Delete");
  deleteBtn.setAttribute("hx-delete", `/requests/${request._id}`);
  deleteBtn.setAttribute("hx-target", "closest li");
  deleteBtn.setAttribute("hx-swap", "outerHTML");
  deleteBtn.setAttribute("hx-confirm", "Delete this request?");

  item.append(display, makeButton("edit-btn btn-edit", "Edit"), deleteBtn);
  labelItemButtons(item, request.title);
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
    // our serrver lists newest first, so new requests go on top
    const item = buildItem(saved);
    list.prepend(item);
    htmx.process(item);
    form.reset();
    announce(`Request added: ${saved.title}.`);
    button.disabled = false;
    form.querySelector("[name=title]").focus();
  } catch (error) {
    button.disabled = false;
    button.focus();
    alert(`Your request was not saved. ${error.message}`);
  }
});

const startEdit = (item) => {
  const display = item.querySelector(".request-display");
  const buttons = item.querySelectorAll(".edit-btn, .delete-btn");

  const editForm = document.createElement("form");
  editForm.className = "edit-form";
  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save";
  save.className = "btn-primary";

  editForm.append(
    makeField("title", item.dataset.title, "Title"),
    makeField("category", item.dataset.category, "Category"),
    makeField("description", item.dataset.description, "Description"),
    makeField("requesterName", item.dataset.requesterName, "Your name"),
    makeField("neededBy", item.dataset.neededBy, "Needed by", "date"),
    save,
    makeButton("cancel-btn btn-edit", "Cancel"),
  );

  display.replaceWith(editForm);
  buttons.forEach((button) => {
    button.hidden = true;
  });
  editForm.querySelector("input").focus();

  const closeEdit = () => {
    editForm.replaceWith(display);
    buttons.forEach((button) => {
      button.hidden = false;
    });
    item.querySelector(".edit-btn").focus();
  };
  editForm.querySelector(".cancel-btn").addEventListener("click", closeEdit);
  editForm.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeEdit();
  });

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(editForm);
    const request = Object.fromEntries(data);

    save.disabled = true;
    try {
      const saved = await fetchJSON(`/requests/${item.dataset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      item.dataset.title = saved.title;
      item.dataset.category = saved.category;
      item.dataset.description = saved.description || "";
      item.dataset.requesterName = saved.requesterName;
      item.dataset.neededBy = saved.neededBy ? saved.neededBy.slice(0, 10) : "";
      fillDisplay(display, saved);
      labelItemButtons(item, saved.title);
      closeEdit();
      announce(`Request updated: ${saved.title}.`);
    } catch (error) {
      save.disabled = false;
      save.focus();
      alert(`Your changes were not saved. ${error.message}`);
    } finally {
      save.disabled = false;
    }
  });
};

list.addEventListener("click", async (event) => {
  if (event.target.matches(".edit-btn")) {
    startEdit(event.target.closest("li"));
  }
});

document.body.addEventListener("htmx:responseError", (event) => {
  const { status: code, responseText } = event.detail.xhr;
  let message = `The server answered ${code}.`;
  try {
    message = JSON.parse(responseText).error || message;
  } catch {}
  alert(`That entry was not deleted. ${message}`);
});
document.body.addEventListener("htmx:sendError", () => {
  alert("That entry was not deleted. Could not reach the server.");
});
