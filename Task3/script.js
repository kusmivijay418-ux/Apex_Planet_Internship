// ==========================================
// SKILL FORGE
// TASK 3 - APPLICATION TRACKER
// ==========================================


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const modalOverlay = document.getElementById("modalOverlay");

const openFormBtn = document.getElementById("openFormBtn");
const heroAddBtn = document.getElementById("heroAddBtn");

const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const applicationForm =
    document.getElementById("applicationForm");

const applicationTable =
    document.getElementById("applicationTable");

const emptyTable =
    document.getElementById("emptyTable");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");


// Form fields

const editId =
    document.getElementById("editId");

const company =
    document.getElementById("company");

const position =
    document.getElementById("position");

const appliedDate =
    document.getElementById("appliedDate");

const status =
    document.getElementById("status");

const interviewDate =
    document.getElementById("interviewDate");

const result =
    document.getElementById("result");

const modalTitle =
    document.getElementById("modalTitle");


// ==========================================
// STATISTICS ELEMENTS
// ==========================================

const totalApplications =
    document.getElementById("totalApplications");

const shortlistedApplications =
    document.getElementById("shortlistedApplications");

const interviewApplications =
    document.getElementById("interviewApplications");

const selectedApplications =
    document.getElementById("selectedApplications");

const heroTotal =
    document.getElementById("heroTotal");

const heroInterview =
    document.getElementById("heroInterview");

const heroSelected =
    document.getElementById("heroSelected");


// ==========================================
// APPLICATION DATA
// ==========================================

let applications =
    JSON.parse(localStorage.getItem("skillForgeApplications")) || [];


// ==========================================
// OPEN MODAL
// ==========================================

function openModal() {

    modalOverlay.classList.add("active");

    company.focus();

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeApplicationModal() {

    modalOverlay.classList.remove("active");

    applicationForm.reset();

    editId.value = "";

    modalTitle.textContent = "Add Application";

}


// ==========================================
// BUTTON EVENTS
// ==========================================

openFormBtn.addEventListener(
    "click",
    openModal
);

heroAddBtn.addEventListener(
    "click",
    openModal
);

closeModal.addEventListener(
    "click",
    closeApplicationModal
);

cancelBtn.addEventListener(
    "click",
    closeApplicationModal
);


// Close when clicking outside modal

modalOverlay.addEventListener(
    "click",
    function(event) {

        if (event.target === modalOverlay) {

            closeApplicationModal();

        }

    }
);


// ==========================================
// SAVE APPLICATION
// ==========================================

applicationForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const application = {

            id:
                editId.value ||
                Date.now().toString(),

            company:
                company.value.trim(),

            position:
                position.value.trim(),

            appliedDate:
                appliedDate.value,

            status:
                status.value,

            interviewDate:
                interviewDate.value,

            result:
                result.value

        };


        // Validation

        if (
            application.company === "" ||
            application.position === "" ||
            application.appliedDate === ""
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;

        }


        // Editing existing application

        if (editId.value !== "") {

            applications =
                applications.map(function(item) {

                    if (
                        item.id === editId.value
                    ) {

                        return application;

                    }

                    return item;

                });

        }

        // Adding new application

        else {

            applications.push(application);

        }


        saveApplications();

        renderApplications();

        updateStatistics();

        closeApplicationModal();

    }
);


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveApplications() {

    localStorage.setItem(
        "skillForgeApplications",
        JSON.stringify(applications)
    );

}


// ==========================================
// RENDER APPLICATIONS
// ==========================================

function renderApplications() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;


    const filteredApplications =
        applications.filter(function(item) {

            const matchesSearch =
                item.company
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                item.position
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesStatus =
                selectedStatus === "All" ||
                item.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    applicationTable.innerHTML = "";


    // Empty state

    if (
        filteredApplications.length === 0
    ) {

        emptyTable.style.display = "block";

    }

    else {

        emptyTable.style.display = "none";

    }


    // Create rows

    filteredApplications.forEach(
        function(item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <div class="company-name">
                        ${escapeHTML(item.company)}
                    </div>
                </td>

                <td>
                    <div class="position-name">
                        ${escapeHTML(item.position)}
                    </div>
                </td>

                <td>
                    ${formatDate(item.appliedDate)}
                </td>

                <td>
                    <span class="status ${getStatusClass(item.status)}">
                        ${item.status}
                    </span>
                </td>

                <td>
                    ${
                        item.interviewDate
                            ? formatDate(item.interviewDate)
                            : "—"
                    }
                </td>

                <td>
                    ${item.result || "Pending"}
                </td>

                <td>

                    <div class="actions">

                        <button
                            class="action-btn edit-btn"
                            onclick="editApplication('${item.id}')"
                            title="Edit"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteApplication('${item.id}')"
                            title="Delete"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            `;


            applicationTable.appendChild(row);

        }
    );

}


// ==========================================
// EDIT APPLICATION
// ==========================================

function editApplication(id) {

    const item =
        applications.find(
            function(application) {

                return application.id === id;

            }
        );


    if (!item) {
        return;
    }


    editId.value =
        item.id;

    company.value =
        item.company;

    position.value =
        item.position;

    appliedDate.value =
        item.appliedDate;

    status.value =
        item.status;

    interviewDate.value =
        item.interviewDate;

    result.value =
        item.result;


    modalTitle.textContent =
        "Edit Application";


    openModal();

}


// ==========================================
// DELETE APPLICATION
// ==========================================

function deleteApplication(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmed) {
        return;
    }


    applications =
        applications.filter(
            function(item) {

                return item.id !== id;

            }
        );


    saveApplications();

    renderApplications();

    updateStatistics();

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        applications.length;


    const shortlisted =
        applications.filter(
            function(item) {

                return item.status === "Shortlisted";

            }
        ).length;


    const interviews =
        applications.filter(
            function(item) {

                return item.status === "Interview";

            }
        ).length;


    const selected =
        applications.filter(
            function(item) {

                return item.status === "Selected";

            }
        ).length;


    // Dashboard

    totalApplications.textContent =
        total;

    shortlistedApplications.textContent =
        shortlisted;

    interviewApplications.textContent =
        interviews;

    selectedApplications.textContent =
        selected;


    // Hero

    heroTotal.textContent =
        total;

    heroInterview.textContent =
        interviews;

    heroSelected.textContent =
        selected;

}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(statusValue) {

    switch (statusValue) {

        case "Applied":
            return "status-applied";

        case "Shortlisted":
            return "status-shortlisted";

        case "Interview":
            return "status-interview";

        case "Selected":
            return "status-selected";

        case "Rejected":
            return "status-rejected";

        default:
            return "status-applied";

    }

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    renderApplications
);


// ==========================================
// STATUS FILTER
// ==========================================

statusFilter.addEventListener(
    "change",
    renderApplications
);


// ==========================================
// INITIAL LOAD
// ==========================================

renderApplications();

updateStatistics();