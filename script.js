document.addEventListener("DOMContentLoaded", () => {
    const resourceForm = document.getElementById("resourceForm");
    const searchForm = document.getElementById("searchForm");
    const resourceTableBody = document.getElementById("resourceTable").getElementsByTagName("tbody")[0];
    const searchMessage = document.getElementById("searchMessage");

    // Load existing resources from local storage
    loadResources();

    // Handle form submission
    resourceForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const resource = document.getElementById("resource").value;
        const quantity = document.getElementById("quantity").value;

        addResource(name, resource, quantity);
        resourceForm.reset();
    });

    // Handle search form submission
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = document.getElementById("searchInput").value.toLowerCase();
        searchResource(searchInput);
    });

    function addResource(name, resource, quantity) {
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        const newResource = { id: resources.length + 1, name, resource, quantity };

        resources.push(newResource);
        localStorage.setItem("resources", JSON.stringify(resources));
        loadResources();
        showConfirmation('Resource added successfully!');
    }

    function loadResources() {
        resourceTableBody.innerHTML = "";
        searchMessage.textContent = "";

        const resources = JSON.parse(localStorage.getItem("resources")) || [];

        resources.forEach(({ id, name, resource, quantity }) => {
            const row = resourceTableBody.insertRow();
            row.insertCell(0).innerText = id;
            row.insertCell(1).innerText = name;
            row.insertCell(2).innerText = resource;
            row.insertCell(3).innerText = quantity;

            // Create edit button
            const editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.onclick = () => editResource(id);
            row.insertCell(4).appendChild(editButton);

            // Create delete button
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.onclick = () => deleteResource(id);
            row.insertCell(4).appendChild(deleteButton);
        });
    }

    function searchResource(searchTerm) {
        searchMessage.textContent = "";

        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        const found = resources.find(resource => 
            resource.name.toLowerCase().includes(searchTerm) || 
            resource.resource.toLowerCase().includes(searchTerm)
        );

        if (found) {
            searchMessage.textContent = `Found: ${found.name} - ${found.resource}`;
            searchMessage.style.color = "#5cb85c"; 
        } else {
            searchMessage.textContent = "No resources found.";
        }
    }

    function editResource(id) {
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        const resourceToEdit = resources.find(resource => resource.id === id);
        
        if (resourceToEdit) {
            document.getElementById("name").value = resourceToEdit.name;
            document.getElementById("resource").value = resourceToEdit.resource;
            document.getElementById("quantity").value = resourceToEdit.quantity;

            // Remove resource from storage and update UI
            deleteResource(id);
        }
    }

    function deleteResource(id) {
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        const updatedResources = resources.filter(resource => resource.id !== id);

        localStorage.setItem("resources", JSON.stringify(updatedResources));
        loadResources();
        showConfirmation('Resource deleted successfully!');
    }

    function showConfirmation(message) {
        const confirmationMessage = document.createElement('div');
        confirmationMessage.textContent = message;
        confirmationMessage.className = 'confirmation-message';
        document.body.appendChild(confirmationMessage);

        setTimeout(() => {
            document.body.removeChild(confirmationMessage);
        }, 3000);
    }
});
