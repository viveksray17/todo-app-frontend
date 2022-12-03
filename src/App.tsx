import { useEffect, useState, useRef } from "react";
const TODO_HOST = "http://localhost:5000"

async function fetchData<T>(url: string): Promise<T> {
	const res = await fetch(url);
	const data: T = await res.json();
	return data;
}

async function sendTodo(todoMessage: string, callback: () => void): Promise<void>{
	const todoBody = {name: todoMessage}
	await fetch(`${TODO_HOST}/todos`, {
		method: "POST",
		body: JSON.stringify(todoBody),
		headers: {
			"Content-type": "application/json"
		}
	})
	callback()
}

interface Todo {
	name: string;
	id: string;
}

function App() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const fetchTodos = async() => {
		const todos = await fetchData<Todo[]>("http://localhost:5000/todos")
		setTodos(todos)
	}
	const todoRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchTodos()
	}, [])

	return (
		<div>
			<input placeholder="enter todo" ref={todoRef}/>
			<button className="btn btn-primary btn-sm" onClick={() => {
				if(todoRef.current?.value){
					sendTodo(todoRef.current.value, fetchTodos)
				}else{
					alert("please enter a todo")
				}
			}}>Submit Todo</button>
			<ul>
				{todos.map(todo => <li key={todo.id}>{todo.name}</li>)}
			</ul>
		</div>
	)
}

export default App;
