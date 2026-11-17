import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import AssistantChat from "./components/AssistantChat";

const API = import.meta.env.VITE_API_URL;

function App() {

    const [todos, setTodos] = useState([]);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [editId, setEditId] = useState(null);

    const [error, setError] = useState("");

    // GET ALL TODOS
    const getTodos = async () => {
        try {
            const response = await axios.get(API);

            setTodos(response.data);

            setError("");
        } catch (err) {
            setError("Unable to fetch todos. Check backend connection.");
        }
    };

    // LOAD TODOS WHEN PAGE OPENS
    useEffect(() => {
        getTodos();
    }, []);

    // ADD OR UPDATE TODO
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!title.trim()) {
            setError("Please enter a Todo title");
            return;
        }

        try {

            if (editId) {

                await axios.put(`${API}/${editId}`, {
                    title,
                    description
                });

            } else {

                await axios.post(API, {
                    title,
                    description
                });

            }

            setTitle("");
            setDescription("");
            setEditId(null);
            setError("");

            getTodos();

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    // EDIT TODO
    const handleEdit = (todo) => {

        setTitle(todo.title);
        setDescription(todo.description);

        setEditId(todo._id);

    };

    // DELETE TODO
    const handleDelete = async (id) => {

        try {

            await axios.delete(`${API}/${id}`);

            getTodos();

        } catch (err) {
            setError("Unable to delete Todo");
        }
    };

    // DELETE ALL TODOS
const handleDeleteAll = async () => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete all todos?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        await axios.delete(`${API}/delete-all`);

        setTodos([]);

        setError("");

        alert("All todos deleted successfully!");

    } catch (err) {

        setError("Unable to delete all todos");

    }
};

    // MARK TODO AS COMPLETED
    const handleToggle = async (todo) => {

        try {

            await axios.put(`${API}/${todo._id}`, {
                completed: !todo.completed
            });

            getTodos();

        } catch (err) {
            setError("Unable to update Todo");
        }
    };

    // CANCEL EDIT
    const handleCancel = () => {

        setTitle("");
        setDescription("");
        setEditId(null);
        setError("");

    };

    return (

        <div className="container">

            <h1>My Todo Application</h1>

            <p className="subtitle">
                Manage your daily tasks
            </p>

            {error && (
                <p className="error">{error}</p>
            )}

            {/* TODO FORM */}

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Enter Todo title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                

                <textarea
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button type="submit">
                    {editId ? "Update Todo" : "Add Todo"}
                </button>

                {editId && (
                    <button
                        type="button"
                        className="cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}

            </form>


            {/* TODO LIST */}

           <div className="task-header">

    <h2>My Tasks ({todos.length})</h2>

    {todos.length > 0 && (
        <button
            className="clear-all"
            onClick={handleDeleteAll}
        >
            Clear All Todos
        </button>
    )}

</div>

            {todos.length === 0 ? (

                <p className="empty">
                    No Todos Found
                </p>

            ) : (

                todos.map((todo) => (

                    <div className="todo-card" key={todo._id}>

                        <div>

                            <h3 className={todo.completed ? "completed" : ""}>
                                {todo.title}
                            </h3>

                            <p>{todo.description}</p>

                            <span>
                                {todo.completed ? "Completed" : "Pending"}
                            </span>

                        </div>

                        <div className="actions">

                            <button
                                onClick={() => handleToggle(todo)}
                            >
                                {todo.completed ? "Undo" : "Complete"}
                            </button>

                            <button
                                className="edit"
                                onClick={() => handleEdit(todo)}
                            >
                                Edit
                            </button>

                            <button
                                className="delete"
                                onClick={() => handleDelete(todo._id)}
                            >
                                Delete
                            </button>

                        </div>

                        

                    </div>

                ))

            )}
            <AssistantChat />

        </div>

    );

}

export default App;