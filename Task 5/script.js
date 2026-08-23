/* =========================================
   ATTENDIFY
   Attendance Management Dashboard
========================================= */


const STORAGE_STUDENTS = "attendify_students";
const STORAGE_ATTENDANCE = "attendify_attendance";
const STORAGE_THEME = "attendify_theme";


/* =========================================
   DEFAULT STUDENTS
========================================= */

const defaultStudents = [

    {
        id: "STU001",
        name: "Aarav Sharma",
        course: "B.Tech CSE",
        semester: "2nd Semester",
        email: "aarav@example.com"
    },

    {
        id: "STU002",
        name: "Ananya Singh",
        course: "B.Tech CSE",
        semester: "2nd Semester",
        email: "ananya@example.com"
    },

    {
        id: "STU003",
        name: "Riya Verma",
        course: "BCA",
        semester: "4th Semester",
        email: "riya@example.com"
    },

    {
        id: "STU004",
        name: "Aditya Raj",
        course: "B.Tech CSE",
        semester: "2nd Semester",
        email: "aditya@example.com"
    },

    {
        id: "STU005",
        name: "Mehak Gupta",
        course: "MCA",
        semester: "3rd Semester",
        email: "mehak@example.com"
    },

    {
        id: "STU006",
        name: "Karan Patel",
        course: "BCA",
        semester: "4th Semester",
        email: "karan@example.com"
    }

];


let students =
    JSON.parse(localStorage.getItem(STORAGE_STUDENTS))
    || defaultStudents;


let attendance =
    JSON.parse(localStorage.getItem(STORAGE_ATTENDANCE))
    || {};


let currentAttendance = {};


let lineChart;
let doughnutChart;


/* =========================================
   DOM
========================================= */

const $ = id => document.getElementById(id);


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeDate();

    initializeNavigation();

    initializeAttendance();

    initializeStudents();

    initializeModal();

    initializeTheme();

    updateDashboard();

    renderStudents();

    renderAttendance();

    renderReports();

});


/* =========================================
   DATE
========================================= */

function initializeDate() {

    const today = new Date();

    $("currentDate").textContent =
        today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });


    $("attendanceDate").value =
        getToday();

}


function getToday() {

    const date = new Date();

    return date.toISOString().split("T")[0];

}


/* =========================================
   NAVIGATION
========================================= */

function initializeNavigation() {

    document.querySelectorAll(".nav-item[data-section]")
        .forEach(button => {

            button.addEventListener("click", () => {

                showSection(button.dataset.section);

            });

        });


    $("menuBtn").addEventListener("click", () => {

        $("sidebar").classList.toggle("open");

    });

}


function showSection(sectionName) {

    document.querySelectorAll(".section")
        .forEach(section => {

            section.classList.remove("active");

        });


    const target = $(sectionName);

    if (target) {
        target.classList.add("active");
    }


    document.querySelectorAll(".nav-item[data-section]")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === sectionName
            );

        });


    const titles = {

        dashboard: [
            "Dashboard",
            "Overview of student attendance"
        ],

        attendance: [
            "Attendance",
            "Mark and manage daily attendance"
        ],

        students: [
            "Students",
            "Manage student records"
        ],

        reports: [
            "Reports",
            "Attendance analytics and insights"
        ]

    };


    $("pageTitle").textContent = titles[sectionName][0];

    $("pageSubtitle").textContent = titles[sectionName][1];


    $("sidebar").classList.remove("open");


    if (sectionName === "reports") {

        renderReports();

    }

}


/* =========================================
   ATTENDANCE
========================================= */

function initializeAttendance() {

    $("attendanceDate")
        .addEventListener("change", loadAttendanceForDate);


    $("subjectSelect")
        .addEventListener("change", loadAttendanceForDate);


    $("attendanceSearch")
        .addEventListener("input", renderAttendance);


    $("markAllPresent")
        .addEventListener("click", () => {

            students.forEach(student => {

                currentAttendance[student.id] = "present";

            });

            renderAttendance();

        });


    $("markAllAbsent")
        .addEventListener("click", () => {

            students.forEach(student => {

                currentAttendance[student.id] = "absent";

            });

            renderAttendance();

        });


    $("saveAttendance")
        .addEventListener("click", saveAttendance);

}


/* =========================================
   LOAD ATTENDANCE
========================================= */

function loadAttendanceForDate() {

    const date = $("attendanceDate").value;

    const subject = $("subjectSelect").value;

    const key = `${date}_${subject}`;


    currentAttendance =
        attendance[key]
        ? { ...attendance[key] }
        : {};


    renderAttendance();

}


/* =========================================
   RENDER ATTENDANCE TABLE
========================================= */

function renderAttendance() {

    const search =
        $("attendanceSearch").value.toLowerCase();


    const filteredStudents =
        students.filter(student =>

            student.name.toLowerCase().includes(search)
            ||
            student.id.toLowerCase().includes(search)

        );


    $("attendanceTable").innerHTML = "";


    filteredStudents.forEach(student => {

        const status =
            currentAttendance[student.id];


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="student-cell">

                    <div class="student-avatar">

                        ${getInitials(student.name)}

                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>

                        <small>
                            ${escapeHTML(student.email)}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHTML(student.id)}
            </td>


            <td>
                ${escapeHTML(student.course)}
            </td>


            <td>

                <div class="attendance-buttons">

                    <button
                        class="attendance-btn present
                        ${status === "present" ? "active" : ""}"
                        onclick="setAttendance('${student.id}','present')"
                    >

                        <i class="fa-solid fa-check"></i>
                        Present

                    </button>


                    <button
                        class="attendance-btn absent
                        ${status === "absent" ? "active" : ""}"
                        onclick="setAttendance('${student.id}','absent')"
                    >

                        <i class="fa-solid fa-xmark"></i>
                        Absent

                    </button>

                </div>

            </td>


            <td>

                ${
                    status === "present"

                    ? `<span class="badge badge-success">
                        Present
                       </span>`

                    :

                    status === "absent"

                    ? `<span class="badge badge-danger">
                        Absent
                       </span>`

                    :

                    `<span class="badge badge-warning">
                        Not Marked
                       </span>`
                }

            </td>

        `;


        $("attendanceTable").appendChild(row);

    });


    $("attendanceCount").textContent =
        `${students.length} Students`;


    const marked =
        Object.keys(currentAttendance).length;


    $("attendanceStatus").textContent =
        `${marked}/${students.length} attendance marked`;

}


/* =========================================
   SET ATTENDANCE
========================================= */

function setAttendance(studentId, status) {

    currentAttendance[studentId] = status;

    renderAttendance();

}


/* =========================================
   SAVE ATTENDANCE
========================================= */

function saveAttendance() {

    if (Object.keys(currentAttendance).length === 0) {

        showToast("Please mark attendance first.");

        return;

    }


    const date =
        $("attendanceDate").value;


    const subject =
        $("subjectSelect").value;


    const key =
        `${date}_${subject}`;


    attendance[key] =
        { ...currentAttendance };


    localStorage.setItem(
        STORAGE_ATTENDANCE,
        JSON.stringify(attendance)
    );


    updateDashboard();

    renderStudents();

    renderReports();


    showToast(
        "Attendance saved successfully!"
    );

}


/* =========================================
   STUDENTS
========================================= */

function initializeStudents() {

    $("studentSearch")
        .addEventListener("input", renderStudents);


    $("courseFilter")
        .addEventListener("change", renderStudents);


    $("addStudentBtn")
        .addEventListener("click", () => {

            openStudentModal();

        });

}


/* =========================================
   RENDER STUDENTS
========================================= */

function renderStudents() {

    const search =
        $("studentSearch").value.toLowerCase();


    const course =
        $("courseFilter").value;


    const filtered =
        students.filter(student => {

            const matchesSearch =
                student.name.toLowerCase().includes(search)
                ||
                student.id.toLowerCase().includes(search);


            const matchesCourse =
                course === "all"
                ||
                student.course === course;


            return matchesSearch && matchesCourse;

        });


    $("studentsTable").innerHTML = "";


    filtered.forEach(student => {

        const percentage =
            getStudentAttendance(student.id);


        const status =
            getAttendanceStatus(percentage);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="student-cell">

                    <div class="student-avatar">
                        ${getInitials(student.name)}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>

                        <small>
                            ${escapeHTML(student.email)}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHTML(student.id)}
            </td>


            <td>
                ${escapeHTML(student.course)}
            </td>


            <td>
                ${escapeHTML(student.semester)}
            </td>


            <td>
                <strong>
                    ${percentage}%
                </strong>
            </td>


            <td>

                <span class="badge ${status.class}">
                    ${status.text}
                </span>

            </td>


            <td>

                <button
                    class="icon-btn"
                    onclick="editStudent('${student.id}')"
                    title="Edit"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="icon-btn delete"
                    onclick="deleteStudent('${student.id}')"
                    title="Delete"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        $("studentsTable").appendChild(row);

    });


    $("totalStudents").textContent =
        students.length;

}


/* =========================================
   ADD / EDIT STUDENT
========================================= */

function initializeModal() {

    $("closeModal")
        .addEventListener("click", closeStudentModal);


    $("cancelModal")
        .addEventListener("click", closeStudentModal);


    $("studentForm")
        .addEventListener("submit", saveStudent);


    $("studentModal")
        .addEventListener("click", event => {

            if (event.target === $("studentModal")) {

                closeStudentModal();

            }

        });

}


function openStudentModal(student = null) {

    $("studentModal").classList.add("active");


    if (student) {

        $("modalTitle").textContent =
            "Edit Student";


        $("editStudentId").value =
            student.id;


        $("studentName").value =
            student.name;


        $("studentId").value =
            student.id;


        $("studentCourse").value =
            student.course;


        $("studentSemester").value =
            student.semester;


        $("studentEmail").value =
            student.email;

    }

    else {

        $("modalTitle").textContent =
            "Add Student";


        $("studentForm").reset();

        $("editStudentId").value = "";

    }

}


function closeStudentModal() {

    $("studentModal")
        .classList.remove("active");

}


function saveStudent(event) {

    event.preventDefault();


    const oldId =
        $("editStudentId").value;


    const student = {

        id: $("studentId").value.trim(),

        name: $("studentName").value.trim(),

        course: $("studentCourse").value,

        semester: $("studentSemester").value,

        email: $("studentEmail").value.trim()

    };


    if (!student.id || !student.name) {

        showToast("Please fill all required fields.");

        return;

    }


    if (oldId) {

        const index =
            students.findIndex(
                s => s.id === oldId
            );


        if (index !== -1) {

            students[index] = student;

        }

    }

    else {

        if (
            students.some(
                s => s.id === student.id
            )
        ) {

            showToast("Student ID already exists.");

            return;

        }


        students.push(student);

    }


    localStorage.setItem(
        STORAGE_STUDENTS,
        JSON.stringify(students)
    );


    renderStudents();

    renderAttendance();

    updateDashboard();

    closeStudentModal();


    showToast(
        oldId
        ? "Student updated successfully!"
        : "Student added successfully!"
    );

}


/* =========================================
   EDIT STUDENT
========================================= */

function editStudent(id) {

    const student =
        students.find(
            student => student.id === id
        );


    if (student) {

        openStudentModal(student);

    }

}


/* =========================================
   DELETE STUDENT
========================================= */

function deleteStudent(id) {

    const student =
        students.find(
            student => student.id === id
        );


    if (!student) return;


    const confirmDelete =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmDelete) return;


    students =
        students.filter(
            student => student.id !== id
        );


    localStorage.setItem(
        STORAGE_STUDENTS,
        JSON.stringify(students)
    );


    renderStudents();

    renderAttendance();

    updateDashboard();

    renderReports();


    showToast(
        "Student deleted successfully."
    );

}


/* =========================================
   ATTENDANCE CALCULATION
========================================= */

function getStudentAttendance(studentId) {

    let present = 0;

    let total = 0;


    Object.values(attendance)
        .forEach(record => {

            if (
                record
                &&
                Object.prototype.hasOwnProperty
                    .call(record, studentId)
            ) {

                total++;

                if (
                    record[studentId] === "present"
                ) {

                    present++;

                }

            }

        });


    if (total === 0) {

        return 0;

    }


    return Math.round(
        (present / total) * 100
    );

}


/* =========================================
   STATUS
========================================= */

function getAttendanceStatus(percentage) {

    if (percentage >= 85) {

        return {
            text: "Excellent",
            class: "badge-success"
        };

    }


    if (percentage >= 75) {

        return {
            text: "Good",
            class: "badge-warning"
        };

    }


    return {
        text: "Low",
        class: "badge-danger"
    };

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const today =
        getToday();


    const todayRecords =
        Object.entries(attendance)
            .filter(([key]) =>
                key.startsWith(today + "_")
            );


    let present = 0;

    let absent = 0;


    todayRecords.forEach(([key, record]) => {

        Object.values(record)
            .forEach(status => {

                if (status === "present") {

                    present++;

                }

                else if (status === "absent") {

                    absent++;

                }

            });

    });


    /*
       If multiple subjects exist,
       average the counts rather than
       counting students multiple times.
    */

    const subjectsToday =
        todayRecords.length;


    if (subjectsToday > 1) {

        present =
            Math.round(
                present / subjectsToday
            );

        absent =
            Math.round(
                absent / subjectsToday
            );

    }


    $("presentToday").textContent =
        present;


    $("absentToday").textContent =
        absent;


    $("legendPresent").textContent =
        present;


    $("legendAbsent").textContent =
        absent;


    const total =
        students.length;


    const rate =
        total
        ? Math.round((present / total) * 100)
        : 0;


    $("presentRate").textContent =
        `${rate}% attendance`;


    const low =
        students.filter(
            student =>
                getStudentAttendance(student.id) < 75
                &&
                getStudentAttendance(student.id) > 0
        );


    $("lowAttendance").textContent =
        low.length;


    $("notificationCount").textContent =
        low.length;


    renderAlerts(low);

    renderCharts(present, absent);

}


/* =========================================
   ALERTS
========================================= */

function renderAlerts(lowStudents) {

    const container =
        $("alertList");


    container.innerHTML = "";


    if (lowStudents.length === 0) {

        container.innerHTML = `

            <div class="alert">

                <div class="alert-student">

                    <div class="alert-avatar">
                        <i class="fa-solid fa-check"></i>
                    </div>

                    <div>

                        <strong>
                            No attendance alerts
                        </strong>

                        <small>
                            All students are maintaining attendance.
                        </small>

                    </div>

                </div>

            </div>

        `;

        return;

    }


    lowStudents
        .slice(0, 5)
        .forEach(student => {

            const percentage =
                getStudentAttendance(student.id);


            container.innerHTML += `

                <div class="alert">

                    <div class="alert-student">

                        <div class="alert-avatar">
                            ${getInitials(student.name)}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(student.name)}
                            </strong>

                            <small>
                                ${escapeHTML(student.id)}
                            </small>

                        </div>

                    </div>

                    <div class="alert-percentage">

                        ${percentage}%

                    </div>

                </div>

            `;

        });

}


/* =========================================
   CHARTS
========================================= */

function renderCharts(present, absent) {

    const lineCanvas =
        $("attendanceLineChart");


    const doughnutCanvas =
        $("attendanceDoughnut");


    if (lineChart) {

        lineChart.destroy();

    }


    if (doughnutChart) {

        doughnutChart.destroy();

    }


    const labels = [];

    const values = [];


    for (let i = 6; i >= 0; i--) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const dateString =
            date.toISOString().split("T")[0];


        labels.push(
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            )
        );


        let dayPresent = 0;

        let dayTotal = 0;


        Object.entries(attendance)
            .forEach(([key, record]) => {

                if (
                    key.startsWith(
                        dateString + "_"
                    )
                ) {

                    Object.values(record)
                        .forEach(status => {

                            dayTotal++;

                            if (
                                status === "present"
                            ) {

                                dayPresent++;

                            }

                        });

                }

            });


        values.push(
            dayTotal
            ? Math.round(
                (dayPresent / dayTotal) * 100
            )
            : 0
        );

    }


    lineChart =
        new Chart(lineCanvas, {

            type: "line",

            data: {

                labels,

                datasets: [{

                    label: "Attendance %",

                    data: values,

                    borderWidth: 3,

                    tension: .4,

                    fill: true

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        ticks: {
                            callback: value =>
                                value + "%"
                        }

                    }

                }

            }

        });


    doughnutChart =
        new Chart(doughnutCanvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Present",
                    "Absent"
                ],

                datasets: [{

                    data: [
                        present,
                        absent
                    ],

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "72%",

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        });

}


/* =========================================
   REPORTS
========================================= */

function renderReports() {

    if (students.length === 0) {

        return;

    }


    const percentages =
        students.map(
            student =>
                getStudentAttendance(student.id)
        );


    const activePercentages =
        percentages.filter(
            value => value > 0
        );


    const average =
        activePercentages.length
        ? Math.round(
            activePercentages.reduce(
                (a, b) => a + b,
                0
            )
            /
            activePercentages.length
        )
        : 0;


    const highest =
        activePercentages.length
        ? Math.max(...activePercentages)
        : 0;


    const lowest =
        activePercentages.length
        ? Math.min(...activePercentages)
        : 0;


    $("averageAttendance").textContent =
        `${average}%`;


    $("highestAttendance").textContent =
        `${highest}%`;


    $("lowestAttendance").textContent =
        `${lowest}%`;


    $("reportList").innerHTML = "";


    students.forEach(student => {

        const percentage =
            getStudentAttendance(student.id);


        $("reportList").innerHTML += `

            <div class="report-item">

                <div class="report-top">

                    <strong>
                        ${escapeHTML(student.name)}
                    </strong>

                    <span>
                        ${percentage}%
                    </span>

                </div>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${percentage}%"
                    ></div>

                </div>

            </div>

        `;

    });

}


/* =========================================
   EXPORT CSV
========================================= */

$("exportAttendance")
    .addEventListener("click", exportAttendanceCSV);


$("exportReport")
    .addEventListener("click", exportReportCSV);


function exportAttendanceCSV() {

    const date =
        $("attendanceDate").value;


    const subject =
        $("subjectSelect").value;


    const rows = [

        [
            "Student Name",
            "Student ID",
            "Course",
            "Date",
            "Subject",
            "Status"
        ]

    ];


    students.forEach(student => {

        rows.push([

            student.name,

            student.id,

            student.course,

            date,

            subject,

            currentAttendance[student.id]
                || "Not Marked"

        ]);

    });


    downloadCSV(
        rows,
        `attendance-${date}.csv`
    );


    showToast(
        "Attendance CSV exported."
    );

}


function exportReportCSV() {

    const rows = [

        [
            "Student Name",
            "Student ID",
            "Course",
            "Attendance Percentage"
        ]

    ];


    students.forEach(student => {

        rows.push([

            student.name,

            student.id,

            student.course,

            getStudentAttendance(student.id)
            + "%"

        ]);

    });


    downloadCSV(
        rows,
        "attendance-report.csv"
    );


    showToast(
        "Report exported successfully."
    );

}


function downloadCSV(rows, filename) {

    const csv =
        rows.map(row =>
            row.map(value =>
                `"${String(value)
                    .replace(/"/g, '""')}"`
            ).join(",")
        ).join("\n");


    const blob =
        new Blob(
            [csv],
            { type: "text/csv" }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = filename;

    link.click();


    URL.revokeObjectURL(url);

}


/* =========================================
   DARK MODE
========================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(STORAGE_THEME);


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    $("themeToggle")
        .addEventListener("click", () => {

            document.body.classList.toggle("dark");


            const theme =
                document.body.classList.contains("dark")
                ? "dark"
                : "light";


            localStorage.setItem(
                STORAGE_THEME,
                theme
            );

        });

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    $("toastMessage").textContent =
        message;


    $("toast").classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            $("toast").classList.remove("show");

        }, 2500);

}


/* =========================================
   UTILITIES
========================================= */

function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}