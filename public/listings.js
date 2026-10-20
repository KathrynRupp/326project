const form = document.querySelector("#listing-form");
const list = document.querySelector("#listings");

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

const buildItem = (listing) => {
  const item = document.createElement("li");
  item.dataset.id = listing.id;
  item.dataset.title = listing.title;
  item.dataset.category = listing.category;
  item.dataset.description = listing.description;
  item.dataset.listerName = listing.listerName;

  const display = document.createElement("span");
  display.className = "listing-display";
  fillDisplay(display, listing);

  item.append(
    display,
    makeButton("edit-btn", "Edit"),
    makeButton("delete-btn", "Delete"),
  );
  return item;
};

const makeInput = (name, value) => {
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = value;
  return input;
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
    list.append(buildItem(saved));
    form.reset();
  } catch (error) {
    alert(`Your listing was not saved. ${error.message}`);
  } finally {
    button.disabled = false;
  }
});

const startEdit = (item) => {
  const display = item.querySelector(".listing-display");
  const buttons = item.querySelectorAll(".edit-btn, .delete-btn");

  const editForm = document.createElement("form");
  editForm.className = "edit-form";
  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save";
  editForm.append(
    makeInput("title", item.dataset.title),
    makeInput("category", item.dataset.category),
    makeInput("description", item.dataset.description),
    makeInput("listerName", item.dataset.listerName),
    save,
    makeButton("cancel-btn", "Cancel"),
  );

  display.replaceWith(editForm);
  buttons.forEach((button) => {
    button.hidden = true;
  });

  editForm.querySelector(".cancel-btn").addEventListener("click", () => {
    editForm.replaceWith(display);
    buttons.forEach((button) => {
      button.hidden = false;
    });
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
      editForm.replaceWith(display);
      buttons.forEach((button) => {
        button.hidden = false;
      });
    } catch (error) {
      alert(`Your changes were not saved. ${error.message}`);
    } finally {
      save.disabled = false;
    }
  });
};

list.addEventListener("click", async (event) => {
  if (event.target.matches(".edit-btn")) {
    startEdit(event.target.closest("li"));
    return;
  }

  if (!event.target.matches(".delete-btn")) return;

  const button = event.target;
  const item = button.closest("li");
  const id = item.dataset.id;

  button.disabled = true;

  try {
    await fetchJSON(`/listings/${id}`, { method: "DELETE" });
    item.remove();
  } catch (error) {
    alert(`That entry was not deleted. ${error.message}`);
    button.disabled = false;
  }
});
