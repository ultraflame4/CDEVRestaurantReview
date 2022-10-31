import {useEffect, useState} from 'react'
import reactLogo from '@/assets/react.svg'
import './App.css'
import {fetchApi} from "@/api";

function App() {
    const [count, setCount] = useState(0)
    const [testDate, setTestDate] = useState("")

    useEffect(()=>{
        (async () => {
            let data = await fetchApi("test")
            let json = await data.json()
            setTestDate(json.date)
        })();
    },[0])// prevent updates whenever the app refreshes

    return (
        <div className="App">
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="vite.svg" className="logo" alt="Vite logo"/>
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React + Express</h1>
            <h1>{testDate}</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    )
}

export default App
