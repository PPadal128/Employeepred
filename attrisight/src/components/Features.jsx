import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Gauge, Table2, History, BookOpen } from 'lucide-react'
import Reveal from './Reveal.jsx'

const caps = [
  { icon: Gauge, t: 'Single prediction', d: 'Fill in one employee and get a leave or stay call with its probability.' },
  { icon: Table2, t: 'Bulk prediction', d: 'Paste a JSON array, review every row in a table and export it as CSV.' },
  { icon: History, t: 'Recent history', d: 'Your latest predictions are kept in this browser so you can compare them.' },
  { icon: BookOpen, t: 'Flashcards', d: 'Short cards on churn, SVMs and retention to explain results to your team.' },
]
const steps = [
  ['Describe the employee', 'Enter the eight fields the model was trained on. Every field is checked before it is sent.'],
  ['The pipeline scores it', 'Your records go to the FastAPI service, which runs the saved SVM pipeline. Nothing is simulated in the browser.'],
  ['Read the estimate', 'You see Will Leave or Will Stay and, when the model returns one, the churn probability.'],
]
const faq = [
  ['What does churn probability mean?', 'It is the model’s estimated likelihood that an employee leaves. It helps rank relative risk and is not a promise about any one person.'],
  ['Why might the probability be missing?', 'Some SVM setups only output a class. When the service returns no probability, AttriSight shows the decision alone instead of inventing a number.'],
  ['Where is my data stored?', 'Records go to your own backend. History is saved only in this browser’s local storage and can be cleared at any time.'],
]

export default function Features() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <section id="platform" className="section">
        <div className="wrap">
          <Reveal><h2 className="h2">An intelligence layer for people decisions.</h2>
            <p className="lead lead--dark">AttriSight turns a trained machine learning model into a working tool for HR teams, with the reasoning kept visible.</p></Reveal>
          <div className="caps">
            {caps.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.06} className="cap"><Icon size={22} strokeWidth={1.6} /><h3>{t}</h3><p>{d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--green">
        <div className="wrap split">
          <Reveal><h2 className="h2">From one record to a clear answer.</h2></Reveal>
          <ol className="steps">
            {steps.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.08}><span className="step__n">{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <Reveal><h2 className="h2">Questions people ask.</h2></Reveal>
          <div className="faq">
            {faq.map(([q, a], i) => (
              <div key={q} className="faq__item">
                <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}{open === i ? <Minus size={18} /> : <Plus size={18} />}</button>
                <AnimatePresence initial={false}>
                  {open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>{a}</motion.p>}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
