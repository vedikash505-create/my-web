
const form = document.getElementById("resultForm");
const resultTable = document.getElementById("resultTable");

let students = [];

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const roll = document.getElementById("roll").value.trim();
    const name = document.getElementById("name").value.trim();

    const maths = Number(document.getElementById("maths").value);
    const science = Number(document.getElementById("science").value);
    const english = Number(document.getElementById("english").value);

    // Validate marks
    const marks = [maths, science, english];

    if (!roll || !name || marks.some(
        mark => !Number.isFinite(mark) || mark < 0 || mark > 100
    )) {
        alert("Please enter valid details and marks between 0 and 100.");
        return;
    }

    // Prevent duplicate roll numbers
    if (students.some(student =>
        student.roll.toLowerCase() === roll.toLowerCase()
    )) {
        alert("This roll number already exists!");
        return;
    }

    // Calculate total and percentage
    const total = maths + science + english;
    const percentage = (total / 300) * 100;

    // Pass requires at least 35 marks in every subject
    const result = marks.every(mark => mark >= 35)
        ? "Pass"
        : "Fail";

    // Store student record
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

    students.push(student);

    displayStudents();

    form.reset();
});

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

    students.forEach(function(student, index) {
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

        values.forEach(function(value, columnIndex) {
            const cell = document.createElement("td");
            cell.textContent = value;

            if (columnIndex === 7) {
                cell.className =
                    student.result === "Pass" ? "pass" : "fail";
            }

            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            students.splice(index, 1);
            displayStudents();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        resultTable.appendChild(row);
    });

    updateSummary();
}

function updateSummary() {
    document.getElementById("studentCount").textContent =
        students.length;

    if (students.length === 0) {
        document.getElementById("classAverage").textContent = "0%";
        document.getElementById("topper").textContent = "Not available";
        return;
    }

    const average = students.reduce(
        (sum, student) => sum + student.percentage, 0
    ) / students.length;

    document.getElementById("classAverage").textContent =
        average.toFixed(2) + "%";

    // Identify topper by highest total marks
    const highestTotal = Math.max(
        ...students.map(student => student.total)
    );

    const toppers = students.filter(
        student => student.total === highestTotal
    );

    const topperText = toppers.map(
        student => `${student.name} (${student.percentage.toFixed(2)}%)`
    ).join(", ");

    document.getElementById("topper").textContent = topperText;
}