const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());

// Student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: Number, required: true },
  department: { type: String, required: true },
  marks: { type: Number, required: true }
});

const Student = mongoose.model("Student", studentSchema);

// Home page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Records API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f1f5f9;
          margin: 0;
          padding: 40px;
          color: #1e293b;
        }
        .container {
          max-width: 750px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 15px #0001;
        }
        h1 { color: #2563eb; }
        li { margin: 14px 0; }
        code {
          background: #e2e8f0;
          padding: 5px;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Student Records API</h1>
        <p>Welcome! Your Student Records API is running.</p>
        <h2>Available API Endpoints</h2>
        <ul>
          <li><code>GET /students</code> — View all students</li>
          <li><code>GET /students/:id</code> — View one student</li>
          <li><code>POST /students</code> — Add a student</li>
          <li><code>PUT /students/:id</code> — Update a student</li>
          <li><code>DELETE /students/:id</code> — Delete a student</li>
        </ul>
        <p>Use Postman to test the student CRUD operations.</p>
      </div>
    </body>
    </html>
  `);
});

// Add student
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
app.get("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
app.put("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/studentDB");
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();

