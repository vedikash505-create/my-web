
const form = document.getElementById("resultForm");
const resultTable = document.getElementById("resultTable");

let students = [];

// Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    const roll = document.getElementById("roll").value.trim();
    const name = document.getElementById("name").value.trim();

    const maths = Number(document.getElementById("maths").value);
    const science = Number(document.getElementById("science").value);
    const english = Number(document.getElementById("english").value);

    // 1. Validate roll number: digits only
    if (!/^\d+$/.test(roll)) {
        alert("Invalid Roll Number! Please enter digits only.");
        return;
    }

    // 2. Validate student name: letters and spaces only
    if (!/^[A-Za-z ]+$/.test(name)) {
        alert("Invalid Student Name! Please enter letters only.");
        return;
    }

    // 3. Validate marks: each subject must be between 0 and 100
    const marks = [maths, science, english];

    if (
        marks.some(mark =>
            !Number.isFinite(mark) || mark < 0 || mark > 100
        ) ||
        document.getElementById("maths").value === "" ||
        document.getElementById("science").value === "" ||
        document.getElementById("english").value === ""
    ) {
        alert("Please enter valid marks between 0 and 100.");
        return;
    }

    // 4. Prevent duplicate roll numbers
    if (
        students.some(student =>
            student.roll === roll
        )
    ) {
        alert("This Roll Number already exists!");
        return;
    }

    // 5. Calculate total and percentage
    const total = maths + science + english;
    const percentage = (total / 300) * 100;

    // 6. Calculate pass or fail
    // Student must score at least 35 in every subject
    const result = marks.every(mark => mark >= 35)
        ? "Pass"
        : "Fail";

    // 7. Create student record
    const student = {
        roll,
        name,
        maths,
        science,
        english,
        total,
        percentage,
        result
    };

    // 8. Store student record
    students.push(student);

    // 9. Display records and update summary
    displayStudents();

    // 10. Clear form
    form.reset();
});


// Display student records in the table
function displayStudents() {
    resultTable.innerHTML = "";

    if (students.length === 0) {
        resultTable.innerHTML = `
            <tr>
                <td colspan="9">No student records added yet.</td>
            </tr>
        `;

        updateSummary();
        return;
    }

    students.forEach(function (student, index) {
        const row = document.createElement("tr");

        const values = [
            student.roll,
            student.name,
            student.maths,
            student.science,
            student.english,
            student.total,
            student.percentage.toFixed(2) + "%",
            student.result
        ];

        // Add student details to table
        values.forEach(function (value, columnIndex) {
            const cell = document.createElement("td");

            cell.textContent = value;

            // Apply pass/fail styling
            if (columnIndex === 7) {
                cell.className =
                    student.result === "Pass" ? "pass" : "fail";
            }

            row.appendChild(cell);
        });

        // Create delete button
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            students.splice(index, 1);
            displayStudents();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        resultTable.appendChild(row);
    });

    updateSummary();
}


// Update summary cards
function updateSummary() {
    document.getElementById("studentCount").textContent =
        students.length;

    if (students.length === 0) {
        document.getElementById("classAverage").textContent = "0%";
        document.getElementById("topper").textContent = "Not available";
        return;
    }

    // Calculate class average
    const average = students.reduce(
        (sum, student) => sum + student.percentage,
        0
    ) / students.length;

    document.getElementById("classAverage").textContent =
        average.toFixed(2) + "%";

    // Find the highest total marks
    const highestTotal = Math.max(
        ...students.map(student => student.total)
    );

    // Handle ties: show all students with the highest total
    const toppers = students.filter(
        student => student.total === highestTotal
    );

    const topperText = toppers.map(
        student =>
            `${student.name} (${student.percentage.toFixed(2)}%)`
    ).join(", ");

    document.getElementById("topper").textContent = topperText;
}
