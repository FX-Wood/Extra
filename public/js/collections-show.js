var deleteModal;

function deleteCollectionButton(e) {
  // url is defined in the rendering of page from server
  fetch(url, { method: "DELETE" })
    .then((window.location = "/collections"))
    .catch((error) => console.info(error));
  deleteModal.close();
}

document.addEventListener("DOMContentLoaded", function (e) {
  deleteModal = M.Modal.init(
    document.querySelector("#delete-collection-modal"),
  );
  document
    .getElementById("DELETE-COLLECTION")
    .addEventListener("click", deleteCollectionButton);
});

