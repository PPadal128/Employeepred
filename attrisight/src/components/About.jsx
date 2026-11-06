import Reveal from './Reveal.jsx'
const stack = [
  ['Model', 'Support Vector Machine in a scikit-learn pipeline, tuned with cross-validated search and saved with Joblib.'],
  ['Backend', 'FastAPI service exposing POST /predict, which accepts a JSON array and returns one prediction per record.'],
  ['Frontend', 'React and Vite, with Framer Motion for movement and Recharts for batch summaries.'],
  ['Interface', 'Lucide icons, hand-written CSS and no UI kit, so the layout stays light.'],
]
export default function About() {
  return (
    <section id="about" className="section section--navy">
      <div className="wrap split">
        <Reveal>
          <h2 className="h2">About the machine learning project.</h2>
          <p className="lead">The model learns from past employee records which combinations of background, pay tier and experience tend to precede a departure. AttriSight puts that model in front of the people who need it, without changing how it was trained.</p>
        </Reveal>
        <div className="stack">
          {stack.map(([t, d], i) => <Reveal key={t} delay={i * 0.06} className="stack__row"><h3>{t}</h3><p>{d}</p></Reveal>)}
        </div>
      </div>
    </section>
  )
}
