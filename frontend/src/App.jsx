import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "./App.css";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./Login";

// PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
}

// STUDENT DASHBOARD
function StudentApp() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [roll, setRoll] = useState("");
  const [course, setCourse] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const API_URL = "https://student-backend-bfu1.onrender.com/api/";

  const navigate = useNavigate();

  //data fetch
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}students/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setStudents(data);
    } catch {
      toast.error("Fetch failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // add data 
  const addStudent = async () => {
    if (!name || !age || !email || !roll || !course) {
      toast.error("All fields required ❌");
      return;
    }

    try {
      const res = await fetch(`${API_URL}students/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          email,
          roll_no: roll,
          course,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw data;

      toast.success("Student Added ✅");
      resetForm();
      fetchStudents();
    } catch {
      toast.error("Add failed ❌");
    }
  };

  //data  delete
  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`${API_URL}students/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
      );

      if (!res.ok) throw new Error();
      toast.error("Deleted 🗑");
      fetchStudents();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  // data edit (fill form)
  const editStudent = (s) => {
    setEditId(s.id);
    setName(s.name);
    setAge(s.age);
    setEmail(s.email);
    setRoll(s.roll_no);
    setCourse(s.course);
  };

  // data update
  const updateStudent = async () => {
    try {
      const res = await fetch(`${API_URL}students/${editId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          email,
          roll_no: roll,
          course,
        }),
      }
      );

      const data = await res.json();
      if (!res.ok) throw data;

      toast.info("Student Updated ✏️");
      setEditId(null);
      resetForm();
      fetchStudents();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  // data reset
  const resetForm = () => {
    setName("");
    setAge("");
    setEmail("");
    setRoll("");
    setCourse("");
  };

  // data logout
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={dark ? "container dark" : "container"}>
      <h1>🎓 Student Manager</h1>

      <button onClick={logout}>Logout 🔓</button>
      <button onClick={() => setDark(!dark)}>Toggle Mode 🌙</button>

      <input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FORM */}
      <div className="form">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Roll No" value={roll} onChange={(e) => setRoll(e.target.value)} />
        <input placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />

        {editId ? (
          <button onClick={updateStudent}>Update ✏️</button>
        ) : (
          <button onClick={addStudent}>
            <FaPlus /> Add
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {/* LIST */}
      <div className="card-container">
        {filteredStudents.map((s) => (
          <motion.div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>Age: {s.age}</p>
            <p>Email: {s.email}</p>
            <p>Roll: {s.roll_no}</p>
            <p>Course: {s.course}</p>

            <button onClick={() => editStudent(s)}>✏️ Edit</button>
            <button onClick={() => deleteStudent(s.id)}>🗑 Delete</button>
          </motion.div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
}

// MAIN APP
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <StudentApp />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;