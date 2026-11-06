import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import PredictionForm from './components/PredictionForm.jsx'
import BulkPrediction from './components/BulkPrediction.jsx'
import PredictionHistory from './components/PredictionHistory.jsx'
import Flashcards from './components/Flashcards.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'

const KEY = 'attrisight.history'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }

export default function App() {
  const [history, setHistory] = useState(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(history)) } catch { /* storage unavailable */ } }, [history])
  const add = (rows) => setHistory((h) => [...rows.map((r) => ({ ...r, id: crypto.randomUUID(), at: Date.now() })).reverse(), ...h].slice(0, 10))
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PredictionForm onResult={(r) => add([r])} />
        <BulkPrediction onResults={add} />
        <PredictionHistory history={history} onClear={() => setHistory([])} />
        <Flashcards />
        <About />
      </main>
      <Footer />
    </>
  )
}
