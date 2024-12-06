import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// TaskForm Component
const TaskForm = ({ onAddTask, title, setTitle, body, setBody }) => {
  return (
    <div className="form-style">
      <h3>Add Task</h3>
      <form onSubmit={onAddTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={body}
          required
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
};

// TaskItem Component
const TaskItem = ({ task, onDeleteTask, onUpdateStatus }) => {
  return (
    <div className="task-item">
      <div>
        <strong>Title:</strong> {task.title}
      </div>
      <div>
        <strong>Description:</strong> {task.body}
      </div>
      <div className="task-actions">
        <button
          className="btn btn-primary"
          onClick={() => onUpdateStatus(task.id)}
        >
          {task.status}
        </button>
        <button className="btn btn-primary" onClick={() => onDeleteTask(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

// TaskList Component
const TaskList = ({ tasks, onDeleteTask, onUpdateStatus }) => {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDeleteTask={onDeleteTask}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

// Main App Component
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const fetchedTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(fetchedTasks);
  };

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "tasks"), { title, body, status: "pending" });
    setTitle("");
    setBody("");
    fetchTasks(); // Refresh the task list
  };

  // Delete a task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Update task status
  const updateStatus = async (id) => {
    const docRef = doc(db, "tasks", id);
    const currentStatus = (await getDoc(docRef)).data().status;
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    await updateDoc(docRef, { status: newStatus });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <TaskForm
        onAddTask={addTask}
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
      />
      <TaskList tasks={tasks} onDeleteTask={deleteTask} onUpdateStatus={updateStatus} />
    </div>
  );
}

export default App;
