import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'
import { OPTIONS, validateRecord, predictEmployees } from '../services/api.js'
import PredictionResult from './PredictionResult.jsx'
import Reveal from './Reveal.jsx'

const EMPTY = { Education: '', JoiningYear: '', City: '', PaymentTier: '', Gender: '', Age: '', EverBenched: '', ExperienceInCurrentDomain: '' }
const LABELS = { Education: 'Education', JoiningYear: 'Joining year', City: 'City', PaymentTier: 'Payment tier', Gender: 'Gender', Age: 'Age', EverBenched: 'Ever benched', ExperienceInCurrentDomain: 'Years of experience in current domain' }
const NUMERIC = { JoiningYear: [1990, 2100], Age: [18, 70], ExperienceInCurrentDomain: [0, 50] }

export default function PredictionForm({ onResult }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [result, setResult] = useState(null)
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }) }

  async function submit(e) {
    e.preventDefault()
    const v = validateRecord(form)
    setErrors(v); setApiError('')
    if (Object.keys(v).length) return
    setLoading(true)
    try {
      const [row] = await predictEmployees([form])
      setResult(row); onResult(row)
    } catch (err) { setResult(null); setApiError(err.message) }
    finally { setLoading(false) }
  }
  const reset = () => { setForm(EMPTY); setErrors({}); setApiError(''); setResult(null) }

  const field = (k) => (
    <div className={`field ${errors[k] ? 'field--bad' : ''}`} key={k}>
      <label htmlFor={k}>{LABELS[k]}</label>
      {OPTIONS[k] ? (
        <select id={k} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]}>
          <option value="">Select</option>{OPTIONS[k].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input id={k} type="number" inputMode="numeric" min={NUMERIC[k][0]} max={NUMERIC[k][1]} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} />
      )}
      {errors[k] && <small role="alert">{errors[k]}</small>}
    </div>
  )

  return (
    <section id="predict" className="section section--navy">
      <div className="wrap">
        <Reveal><h2 className="h2">Predict for one employee.</h2><p className="lead">Enter the record below. Results come from your running model.</p></Reveal>
        <div className="workspace">
          <form onSubmit={submit} noValidate className="form" aria-busy={loading}>
            <div className="form__grid">{Object.keys(EMPTY).map(field)}</div>
            {apiError && <div className="alert" role="alert"><AlertCircle size={18} />{apiError}</div>}
            <div className="row">
              <button className="btn btn--lime" disabled={loading}>{loading ? <><Loader2 className="spin" size={18} /> Predicting</> : 'Predict Employee Churn'}</button>
              <button type="button" className="btn btn--ghost-light" onClick={reset} disabled={loading}>Reset form</button>
            </div>
          </form>
          <div className="result-wrap">
            {loading ? (
              <div className="result result--loading" role="status" aria-live="polite">
                <div className="bars">{[0, 1, 2, 3, 4].map((i) => <motion.span key={i} animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }} />)}</div>
                <p>Running the SVM pipeline</p>
              </div>
            ) : <PredictionResult result={result} />}
          </div>
        </div>
      </div>
    </section>
  )
}
