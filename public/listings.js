const form = document.querySelector("#listing-form");
const list = document.querySelector("#listings");
const status = document.querySelector("#status");

const announce = (message) => {
  status.textContent = "";
  setTimeout(() => {
    status.textContent = message;
  }, 50);
};
const timedFetch = (url, options = {}) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(10000) });

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

const fillDisplay = (display, listing) => {
  const title = document.createElement("strong");
  title.textContent = `${listing.title}:`;
  display.replaceChildren(
    title,
    ` (${listing.category}) ${listing.description} listed by ${listing.listerName}`,
  );
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
const buildItem = (listing) => {
  const item = document.createElement("li");
  item.className = "card flex flex-wrap items-center gap-2";
  item.dataset.id = listing.id;
  item.dataset.title = listing.title;
  item.dataset.category = listing.category;
  item.dataset.description = listing.description;
  item.dataset.listerName = listing.listerName;

  const display = document.createElement("span");
  display.className =
    "listing-display basis-full min-w-0 break-words text-sm sm:flex-1 sm:basis-0";
  fillDisplay(display, listing);

  const deleteBtn = makeButton("delete-btn btn-delete", "Delete");
  deleteBtn.setAttribute("hx-delete", `/listings/${listing.id}`);
  deleteBtn.setAttribute("hx-target", "closest li");
  deleteBtn.setAttribute("hx-swap", "outerHTML");
  deleteBtn.setAttribute("hx-confirm", "Delete this listing?");

  item.append(display, makeButton("edit-btn btn-edit", "Edit"), deleteBtn);
  labelItemButtons(item, listing.title);
  return item;
};

const makeField = (name, value, labelText) => {
  const label = document.createElement("label");
  label.className = "min-w-0 sm:flex-1";
  const text = document.createElement("span");
  text.className = "sr-only";
  text.textContent = labelText;
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = value;
  input.className = "form-input";
  label.append(text, input);
  return label;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const listing = Object.fromEntries(data);
  const button = form.querySelector("button");

  button.disabled = true;

  try {
    const saved = await fetchJSON(`/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });
    const item = buildItem(saved);
    list.append(item);
    htmx.process(item);
    form.reset();
    announce(`Listing added: ${saved.title}.`);
    button.disabled = false;
    form.querySelector("[name=title]").focus();
  } catch (error) {
    button.disabled = false;
    button.focus();
    alert(`Your listing was not saved. ${error.message}`);
  }
});

const startEdit = (item) => {
  const display = item.querySelector(".listing-display");
  const buttons = item.querySelectorAll(".edit-btn, .delete-btn");

  const editForm = document.createElement("form");
  editForm.className =
    "edit-form flex basis-full flex-col gap-2 sm:flex-row sm:items-center";
  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save";
  save.className = "btn-primary";
  editForm.append(
    makeField("title", item.dataset.title, "Title"),
    makeField("category", item.dataset.category, "Category"),
    makeField("description", item.dataset.description, "Description"),
    makeField("listerName", item.dataset.listerName, "Your name"),
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
    const listing = Object.fromEntries(data);

    save.disabled = true;
    try {
      const saved = await fetchJSON(`/listings/${item.dataset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listing),
      });
      item.dataset.title = saved.title;
      item.dataset.category = saved.category;
      item.dataset.description = saved.description;
      item.dataset.listerName = saved.listerName;
      fillDisplay(display, saved);
      labelItemButtons(item, saved.title);
      closeEdit();
      announce(`Listing updated: ${saved.title}.`);
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

document.body.addEventListener("htmx:beforeSwap", (event) => {
  const row = event.detail.target;
  if (!row.matches("#listings > li") || event.detail.xhr.status !== 200) return;
  const neighbor = row.nextElementSibling || row.previousElementSibling;
  (neighbor
    ? neighbor.querySelector(".delete-btn")
    : document.querySelector("#listings-heading")
  ).focus();
  announce(`Listing deleted: ${row.dataset.title}.`);
});

document.body.addEventListener("htmx:responseError", (event) => {
  const { status: code, responseText } = event.detail.xhr;
  let message = `The server answered ${code}.`;
  try {
    message = JSON.parse(responseText).error || message;
  } catch {}
  alert(`That listing was not deleted. ${message}`);
});
document.body.addEventListener("htmx:sendError", () => {
  alert("That listing was not deleted. Could not reach the server.");
});
