import { useState } from "react";
import axios from "axios";
import './Edit-form.css';



export const EditForm = (({editTodo, todo, cancelEdit}) => {
    const [editName, setEditName] = useState(todo.title || "");
    const [editDate, setEditDate] = useState(todo.dueDate || "");
    const [editDescription, setEditDescription] = useState(todo.description || "");
    
    
    const handleForm = e => {
        e.preventDefault();

      const updatedTodo = {
        ...todo,
        title: editName,
        dueDate: editDate,
        description: editDescription,
        completed: false
      }

      editTodo(updatedTodo);


      setEditName("");
      setEditDate("");
      setEditDescription("");
    }
    
    //Updates the server after editing
    const updateServer = async () => {
        try {
            if(editName === todo.title && editDate === todo.dueDate && editDescription === todo.description) {
                return window.alert("Nothing has changed, Please edit before clicking update")
            }
                              
            const response = await axios.put(`http://localhost:5000/todos/${todo.id}`, 
                {
                    title: editName,
                    dueDate: editDate,
                    description: editDescription,
                    completed: false
                }
    
            )            

            editTodo(response.data)
            
            window.alert("Updated successfully")
             

        } catch (error) {
            window.alert("Error updating todo: ", error)
        }
    } 




    

    return (     
        <form key={todo.id} className="todo-input-grid" onSubmit={handleForm}>

                {/*Here, onChange and e.target.value gets the value you insert in the input field*/}
                <input
                    type="text"
                    placeholder="Update name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                />

                <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                />


                <button className="update-todo-button" onClick={updateServer} >Update</button>
                <button className="cancel-todo-btn" onClick={cancelEdit}>Cancel</button>
        </form>
    )
})