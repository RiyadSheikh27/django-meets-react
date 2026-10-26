import { useState } from 'react'
import heroImg from './assets/hero.png'
import viteLogo from './assets/vite.svg'

function App() {

  return (
    <div>
      <h1>To-Do App</h1>
      <p>API: {import.meta.env.VITE_API_BASE_URL}</p>
    </div>
  )
}
export default App
