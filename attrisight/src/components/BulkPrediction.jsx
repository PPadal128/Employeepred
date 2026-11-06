import { useState, useMemo } from 'react'
import { Download, Loader2, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { SAMPLE, FIELDS, validateRecord, predictEmployees, willLeave } from '../services/api.js'
import Reveal from './Reveal.jsx'

const pctOf = (p) => (p === null ? '' : `${Math.round((p > 1 ? p : p * 100) * 10) / 10}%`)
const csvCell = (v) => { const s = v === null || v === undefined ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }

export default function BulkPrediction({ onResults }) {
  const [text, setText] = useState('')
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function run() {
    setError(''); setRows([])
    let data
    try { data = JSON.parse(text) } catch { return setError('That is not valid JSON. Check brackets, commas and quotes.') }
    if (!Array.isArray(data) || data.length === 0) return setError('Provide a JSON array with at least one employee object.')
    if (data.length > 500) return setError('Send at most 500 records at a time.')
    for (let i = 0; i < data.length; i++) {
      const bad = data[i] && typeof data[i] === 'object' ? validateRecord(data[i]) : { record: 'Not an object.' }
      const k = Object.keys(bad)[0]
      if (k) return setError(`Record ${i + 1}: ${bad[k]}${k !== 'record' ? ` (${k})` : ''}`)
    }
    setLoading(true)
    try { const out = await predictEmployees(data); setRows(out); onResults(out) }
    catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  function exportCsv() {
    const cols = [...FIELDS, 'Predicted_Leave', 'Predicted_Status', 'Churn_Probability']
    const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'attrisight-predictions.csv' })
    a.click(); URL.revokeObjectURL(a.href)
  }
  const chart = useMemo(() => { const l = rows.filter(willLeave).length; return [{ name: 'Will Leave', n: l }, { name: 'Will Stay', n: rows.length - l }] }, [rows])

  return (
    <section id="bulk" className="section">
      <div className="wrap">
        <Reveal><h2 className="h2">Predict for a whole team.</h2><p className="lead lead--dark">Paste a JSON array of employee records. Each object needs the same eight fields as the form.</p></Reveal>
        <div className="bulk">
          <div>
            <label htmlFor="bulk-json" className="sr">Employee records as JSON</label>
            <textarea id="bulk-json" value={text} onChange={(e) => setText(e.target.value)} spellCheck="false" placeholder='[ { "Education": "Bachelors", ... } ]' />
            <div className="row">
              <button className="btn btn--navy" onClick={run} disabled={loading}>{loading ? <><Loader2 className="spin" size={18} /> Predicting</> : 'Predict all'}</button>
              <button className="btn btn--ghost" onClick={() => setText(JSON.stringify([SAMPLE], null, 2))}>Insert format example</button>
            </div>
            {error && <div className="alert alert--light" role="alert"><AlertCircle size={18} />{error}</div>}
          </div>
          {rows.length > 0 && (
            <div className="bulk__out">
              <div className="bulk__head"><h3>{rows.length} predictions</h3>
                <button className="btn btn--ghost" onClick={exportCsv}><Download size={16} /> Export CSV</button></div>
              <div className="chart" aria-label="Count of employees predicted to leave versus stay">
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={chart} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" hide allowDecimals={false} /><YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} /><Bar dataKey="n" radius={2} barSize={22}>{chart.map((c) => <Cell key={c.name} fill={c.name === 'Will Leave' ? '#0b1f33' : '#8fb339'} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="table-scroll"><table>
                <thead><tr><th>#</th><th>Education</th><th>City</th><th>Age</th><th>Tier</th><th>Status</th><th>Probability</th></tr></thead>
                <tbody>{rows.map((r, i) => (
                  <tr key={i}><td>{i + 1}</td><td>{r.Education}</td><td>{r.City}</td><td>{r.Age}</td><td>{r.PaymentTier}</td>
                    <td><span className={willLeave(r) ? 'pill pill--leave' : 'pill pill--stay'}>{r.Predicted_Status}</span></td>
                    <td>{pctOf(r.Churn_Probability) || 'Not provided'}</td></tr>))}</tbody>
              </table></div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
