import { useEffect, useState } from "react"

const TodoAddCard = () => {
    
    // get today's date and make the the default value for the dueDate state.

    // i think i can useRef here to optimize this but i still fully dont understand its use.
    const [myTodoTask, setMyTodoTask] = useState(()=>{
        const saved = localStorage.getItem('myTodoTask');
        const initialValue = JSON.parse(saved);
        return initialValue || [];
    });
    
    const [revealTask, setRevealTask] = useState(()=>{
        const saved = localStorage.getItem('revealTask');
        const initialValue = JSON.parse(saved);
        return initialValue || false
    });

    const [dueDate, setDueDate] = useState(handleDate);

    const [taskName, setTaskName] = useState('');
    const [togglePriorityColor, setTogglePriorityColor] = useState('green');
    const [priority, setPriority] = useState('Low');

    // saving and retriving everything to and from the localStorage...
    
    useEffect(()=>{
        localStorage.setItem('myTodoTask', JSON.stringify(myTodoTask));
        localStorage.setItem('revealTask', JSON.stringify(revealTask));
    },[myTodoTask])

    // Takein the Task Name.
    function handleTaskName (event) {
        setTaskName(event.target.value)
    }
    
    // Takin the Due Date.
    function handleDueDate (event) {
        setDueDate(event.target.value)
    }
    
    // Setting the Priority
    function handlePriority (event) {
        setTogglePriorityColor(togglePriorityColor === 'green'? 'red': 'green');
        event.target.style.color = togglePriorityColor;
        setPriority(togglePriorityColor === 'green'? 'Low' : 'High')
    }

    // Combining all the above into an obj
    function handleTodoTask () {
        if(taskName.trim()!== ''){
            const newTaskObj = {
                TaskName : taskName,
                DueDate : dueDate,
                Priority: priority,
            }
            setMyTodoTask(prevMyTodoTask => [...prevMyTodoTask, newTaskObj]);
            // may be make the animation stop if there are elements within the list ??
            setTaskName('')
            setDueDate(handleDate)
            setRevealTask(true)
        } else {
            alert('Task Name cannot be Empty!')
        }

    }    

    // movin the task up
    function moveTaskUp (index) {
        if(index > 0){
            const updateTask = [...myTodoTask]
            const tempTask = updateTask[index - 1];
            updateTask[index - 1] = updateTask[index]
            updateTask[index] = tempTask;
            setMyTodoTask(updateTask)
        }
    }
    
    // movin the task down
    function moveTaskDown (index) {
        if(index < myTodoTask.length - 1){
            const updateTask = [...myTodoTask]
            const tempTask = updateTask[index + 1];
            updateTask[index + 1] = updateTask[index]
            updateTask[index] = tempTask;
            setMyTodoTask(updateTask)
        }
    }
    
    // removin the task
    function deleteTask (index) {
        const updatedTodoList = myTodoTask.filter((_, i)=> i !== index);
        setMyTodoTask(updatedTodoList)
    }

    // clearing localstorage
    function clearLocalStorage () {
        myTodoTask.length === 0 ? alert("No Tasks Found 😕") : (confirm("You are now going to clear the local Storage and all your Tasks.\nDo you like to proceed??") && (localStorage.clear(), window.location.reload()));
    }

    function sortTodoItems (event) {
    const selectMenu = event.target;
     event.target.addEventListener('change', function(){
        // which items is being selected.
            const selectedValue = selectMenu.value;
            switch(selectedValue) {
                case 'name':
                    sortByName();
                    break;
                case 'priority':
                    sortByPriority();
                    break;
                case 'task-created':
                    sortByTaskCreated();
                    break;
                default :
                    break;
            }
        });
    };

    // may be implement something like reverse order arrage if already in ascending order?
    function sortByName () {
        const tempTodoArray = [...myTodoTask];
        tempTodoArray.sort((a, b) => a.TaskName.localeCompare(b.TaskName));
        setMyTodoTask(tempTodoArray);
    }

    function sortByPriority () {
        const tempTodoArray = [...myTodoTask];
        tempTodoArray.sort((a, b)=> a.Priority.localeCompare(b.Priority));
        setMyTodoTask(tempTodoArray);
    }

    function handleDate(){
        const currDate = new Date()
        const year = currDate.getFullYear();
        const month = currDate.getMonth() + 1;
        const day = currDate.getDate();
        return `${year}-${month}-${day}`
    }

    return (
        <div className="todo-container">
            
            {/* Upper part with card to add task */}
            <div className="todo-add-card">
                <h1 className="title">Just<span className="todo-title">Todo</span>It</h1>
                <div className="todo-add-card-inner">
                    <div className="inner-top">
                        <div className="inner-top-field">
                            <input type="text" name="" id="input-field" placeholder="Enter Task Here..." onChange={handleTaskName} value={taskName} autoComplete="off"/>
                        </div>
                        <div className="inner-top-btns">
                            <input type="date" className="due-date" onChange={handleDueDate} value={dueDate}/>
                            <button className="flag-btn" onClick={handlePriority}>Priority <i className="fa-solid fa-flag" ></i></button>
                        </div>
                    </div>
                    <div className="inner-bottom">
                        <button className="add-btn" onClick={handleTodoTask}>Add</button>
                    </div>
                </div>
            </div>
    
            {/* Bottom part that actually displays the task */}
            <div className="todo-disp-card">
                <div className="todo-disp-container">
                   <div className="todo-disp-container-top">
                        <span className="my-task">My Task/s: </span>
                        <div className="extra">
                                <select name="sorting-option" id="sorting-option" onClick={sortTodoItems}>
                                    <option value="sort-by" className="exclude">Sort By: </option>
                                    <option value="name">Name </option>
                                    <option value="priority">Priority </option>
                                </select>
                            <button className="clear-local-storage" onClick={clearLocalStorage}>x</button>
                        </div>
                   </div>
                    <ul>
                        {revealTask && myTodoTask.map((task, index)=>{
                                return(<li key={index}>
                                    <div className="task-details">
                                        <h3 style={{fontSize: '1.5em'}}>{task.TaskName}</h3> 
                                        <p style={{fontSize: '1rem'}}>Priority: {task.Priority} </p>
                                        <p style={{fontSize: '1rem'}}>Due Date: {task.DueDate} </p>
                                    </div>
                                    <div className="buttons-in-task">
                                        <button className="task-btn move-task-up-btn" onClick={()=>moveTaskUp(index)}><i className="fa-solid fa-arrow-up"></i></button>
                                        <button className="task-btn move-task-down-btn" onClick={()=>moveTaskDown(index)}><i className="fa-solid fa-arrow-down"></i></button>
                                        <button className="task-btn delete-btn" onClick={()=>deleteTask(index)}> <i className="fa-solid fa-trash"></i>  </button>
                                    </div>
                                </li>)
                            })
                        } 
                    </ul>
                </div>
            </div>
    
        </div>
    );
    
}

export default TodoAddCard