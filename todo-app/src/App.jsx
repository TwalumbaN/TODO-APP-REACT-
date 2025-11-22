import { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css';
import { EditForm } from './components/Edit-form';


function App() {
  const [todos, setTodos] = useState([]);
  
  const [editingTodo, setEditingTodo] = useState(null);
  const [updateTodos, setUpdateTodo] = useState({
    id: '',
    title: '',
    dueDate: '',
    description: ''
  })
  const [title, setTodoTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); 
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

   //Fetching todo items from the json server
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/todos");
                setTodos(response.data);
            } catch (error) {
                window.alert("Error fetching todos: ", error);
            }
        };

        fetchTodos();
    }, []);

    //Creating todo item and saving it to the json server
    const addTodo = async () => {
        try {
            if(!title.length || !description.length || !dueDate.length) {
                return window.alert('Please Fill in all fields before proceeding!')
              }
              setError('')
              const response = await axios.post("http://localhost:5000/todos", {
                title,
                dueDate,
                description,
                completed: false
              });
             
            setTodos([...todos, response.data]);
            setTodoTitle('');
            setDueDate('');
            setDescription('');

        } catch (error) {
            window.alert(`An error occured: ${JSON.stringify(error)}`)
            setError(`An error occured: ${JSON.stringify(error)}`)
            
        }
    };

    
    //Deleting todo item from the json server
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/todos/${id}`);
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            setError("Error deleting the todo", error);
        }
    };

    
    //Editing the todo
     const editTodo = (updatedTodo) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
        // hide form after editing
        setEditingTodo(null);
        setUpdateTodo({
          id: '',
          title: '',
          dueDate: '',
          description: ''
        })
  };

  //Toggles between complete and pending
    const toggleComplete = async (id, currentStatus) => {
        try {
            // Update the completion status on the json server
            await axios.patch(`http://localhost:5000/todos/${id}`, {
            completed: !currentStatus,
        });

        //Update the local state
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !currentStatus } : todo
        )
        );
    } catch (error) {
        setError("Error updating todo status:", error);
    }
    };

    //Stops the editing process
    const cancelEdit = () => {
      setEditingTodo(null);
    };    

  return (
    <> 
    <div className='todo-list-grid'>
      <h3>Todo App</h3>
      <form className="todo-input-form" onSubmit={addTodo}>
        <input type="text" 
          placeholder="Enter todo name"
          value={title}
          onChange={(e) => setTodoTitle(e.target.value)}
        />

        <input type="date" 
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <input type="text" 
          placeholder='Enter description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type='submit' className="add-todo-button">Add</button>

      </form>
      
      <br />
      
      
      <div className="list-display-grid">
        {updateTodos.title.length !== 0 && <EditForm todo={updateTodos} editTodo={editTodo} cancelEdit={cancelEdit}/>}
        {todos.map((todo) => 
          <div key={todo.id} className='list-display'>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id, todo.completed)}/>

            <p className={todo.completed ? "completed" : ""}>{todo.title}</p>
            <p className={todo.completed ? "completed" : ""}>{todo.dueDate}</p>
            <p className={todo.completed ? "completed" : ""}>{todo.description}</p>

            <button className='Edit-todo' onClick={() => setUpdateTodo(todo)}>Edit</button>

           
            <p>{todo.completed ? "Completed" : "Pending"}</p>


            <button className='delete-todo-btn' onClick={() => deleteTodo(todo.id)}>Delete</button>

          </div>
        )}
        
        
      </div>
    </div>  
    </>



)
  
}

export default App
