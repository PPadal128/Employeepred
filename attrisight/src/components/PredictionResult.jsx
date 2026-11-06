import { motion } from 'framer-motion'
import { LogOut, UserCheck } from 'lucide-react'
import { willLeave } from '../services/api.js'

export default function PredictionResult({ result }) {
  if (!result) return (
    <div className="result result--empty"><h3>Your result appears here</h3><p>Fill in the form and run a prediction. The answer comes straight from your FastAPI model.</p></div>
  )
  const leave = willLeave(result)
  const p = result.Churn_Probability
  const pct = p === null ? null : Math.round((p > 1 ? p : p * 100) * 10) / 10
  const Icon = leave ? LogOut : UserCheck
  return (
    <motion.div className={`result ${leave ? 'result--leave' : 'result--stay'}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
      <Icon size={26} strokeWidth={1.6} />
      <h3>{leave ? 'Will Leave' : 'Will Stay'}</h3>
      {pct === null ? <p className="muted">The model did not return a churn probability for this record.</p> : (
        <>
          <div className="meter" role="img" aria-label={`Churn probability ${pct} percent`}>
            <motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <p className="big">{pct}%<span> churn probability</span></p>
        </>
      )}
      <dl className="facts">
        {['Education', 'City', 'Age', 'JoiningYear', 'PaymentTier', 'Gender', 'EverBenched', 'ExperienceInCurrentDomain'].map((k) => result[k] !== undefined && (
          <div key={k}><dt>{k.replace(/([A-Z])/g, ' $1').trim()}</dt><dd>{String(result[k])}</dd></div>
        ))}
      </dl>
      <p className="disclaimer">This is a statistical estimate from a machine learning model, not a guarantee of what any person will do. Use it alongside human judgement.</p>
    </motion.div>
  )
}
