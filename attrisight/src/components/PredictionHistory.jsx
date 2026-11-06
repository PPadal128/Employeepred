import { Trash2 } from 'lucide-react'
import { willLeave } from '../services/api.js'
import Reveal from './Reveal.jsx'

export default function PredictionHistory({ history, onClear }) {
  return (
    <section id="history" className="section section--green">
      <div className="wrap">
        <div className="history__head">
          <Reveal><h2 className="h2">Recent predictions.</h2><p className="lead lead--dark">The last ten results from this browser. Nothing here is sent anywhere else.</p></Reveal>
          {history.length > 0 && <button className="btn btn--ghost" onClick={onClear}><Trash2 size={16} /> Clear history</button>}
        </div>
        {history.length === 0 ? <p className="empty">No predictions yet. Run one above and it will be listed here.</p> : (
          <ul className="history">
            {history.map((h) => (
              <li key={h.id}>
                <div><strong>{h.Education}, {h.City}</strong><span>Age {h.Age} · Tier {h.PaymentTier} · Joined {h.JoiningYear}</span></div>
                <div className="history__r">
                  <span className={willLeave(h) ? 'pill pill--leave' : 'pill pill--stay'}>{h.Predicted_Status}</span>
                  <em>{h.Churn_Probability === null ? 'No probability' : `${Math.round((h.Churn_Probability > 1 ? h.Churn_Probability : h.Churn_Probability * 100) * 10) / 10}%`}</em>
                </div>
                <time>{new Date(h.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time>
              </li>))}
          </ul>
        )}
      </div>
    </section>
  )
}
