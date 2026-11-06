const BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001').replace(/\/$/, '')

export const OPTIONS = {
  Education: ['Bachelors', 'Masters', 'PHD'],
  City: ['Bangalore', 'Pune', 'New Delhi'],
  PaymentTier: [1, 2, 3],
  Gender: ['Male', 'Female'],
  EverBenched: ['No', 'Yes'],
}
export const FIELDS = ['Education', 'JoiningYear', 'City', 'PaymentTier', 'Gender', 'Age', 'EverBenched', 'ExperienceInCurrentDomain']
export const SAMPLE = {
  Education: 'Bachelors', JoiningYear: 2018, City: 'Bangalore', PaymentTier: 3,
  Gender: 'Male', Age: 26, EverBenched: 'No', ExperienceInCurrentDomain: 4,
}

const intIn = (v, min, max) => v !== '' && v !== null && v !== undefined && Number.isInteger(Number(v)) && Number(v) >= min && Number(v) <= max

/** Returns { field: message }. An empty object means the record is valid. */
export function validateRecord(r) {
  const e = {}
  const year = new Date().getFullYear()
  for (const k of ['Education', 'City', 'Gender', 'EverBenched'])
    if (!OPTIONS[k].includes(r[k])) e[k] = 'Choose one of the listed options.'
  if (!intIn(r.PaymentTier, 1, 3)) e.PaymentTier = 'Payment tier must be 1, 2 or 3.'
  if (!intIn(r.Age, 18, 70)) e.Age = 'Enter an age between 18 and 70.'
  if (!intIn(r.JoiningYear, 1990, year)) e.JoiningYear = `Enter a year between 1990 and ${year}.`
  if (!intIn(r.ExperienceInCurrentDomain, 0, 50)) e.ExperienceInCurrentDomain = 'Enter experience between 0 and 50 years.'
  else if (!e.Age && Number(r.ExperienceInCurrentDomain) > Number(r.Age) - 16) e.ExperienceInCurrentDomain = 'Experience is too high for this age.'
  return e
}

export const toPayload = (r) => ({
  Education: r.Education, JoiningYear: Number(r.JoiningYear), City: r.City, PaymentTier: Number(r.PaymentTier),
  Gender: r.Gender, Age: Number(r.Age), EverBenched: r.EverBenched, ExperienceInCurrentDomain: Number(r.ExperienceInCurrentDomain),
})

export class ApiError extends Error {
  constructor(message, kind) { super(message); this.kind = kind }
}

/** Sends an array of employee records to the FastAPI /predict endpoint. */
export async function predictEmployees(records) {
  let res
  try {
    res = await fetch(`${BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(records.map(toPayload)),
    })
  } catch {
    throw new ApiError(`Could not reach the prediction service at ${BASE}. Check that the FastAPI server is running and that CORS allows this origin.`, 'network')
  }
  const text = await res.text()
  if (!res.ok) {
    let detail = ''
    try { const j = JSON.parse(text); detail = typeof j.detail === 'string' ? j.detail : JSON.stringify(j.detail ?? j) } catch { detail = text.slice(0, 200) }
    throw new ApiError(`The service returned HTTP ${res.status}${detail ? `: ${detail}` : '.'}`, 'http')
  }
  let data
  try { data = JSON.parse(text) } catch { throw new ApiError('The service returned a response that is not valid JSON.', 'json') }
  if (!Array.isArray(data)) throw new ApiError('The service returned an unexpected shape. Expected an array of predictions.', 'shape')
  if (data.length === 0) throw new ApiError('The service returned no predictions.', 'empty')
  return data.map(normalize)
}

function normalize(row) {
  const leave = row.Predicted_Leave
  const status = row.Predicted_Status ?? (leave === 1 || leave === true ? 'Will Leave' : leave === 0 || leave === false ? 'Will Stay' : null)
  const p = row.Churn_Probability
  return { ...row, Predicted_Status: status, Churn_Probability: typeof p === 'number' && Number.isFinite(p) ? p : null }
}

export const willLeave = (r) => r.Predicted_Leave === 1 || r.Predicted_Leave === true || /leave/i.test(r.Predicted_Status || '')
