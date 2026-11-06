import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
const features = ['Education', 'Joining year', 'City', 'Payment tier', 'Gender', 'Age', 'Ever benched', 'Experience in domain']
const marquee = 'Eight workforce signals · One trained SVM pipeline · A probability for every employee · '
export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -40])
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
  const item = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }
  return (
    <section id="top" className="hero">
      <motion.div className="wrap hero__grid" variants={container} initial="hidden" animate="show">
        <div>
          <motion.h1 variants={item}>Understand your workforce. Predict what comes next.</motion.h1>
          <motion.p variants={item} className="lead">AttriSight reads an employee record and estimates the chance they will leave, using a Support Vector Machine trained on workforce data.</motion.p>
          <motion.div variants={item} className="row">
            <a href="#predict" className="btn btn--lime">Predict an employee</a>
            <a href="#bulk" className="btn btn--ghost">Upload a batch</a>
          </motion.div>
          <motion.p variants={item} className="note">Predictions are estimates, not guarantees.</motion.p>
        </div>
        <motion.aside variants={item} style={{ y }} className="hero__panel" aria-label="Model inputs">
          <h2>What the model reads</h2>
          <p>Every prediction starts from these eight fields, nothing else.</p>
          <ul>{features.map((f) => <li key={f}>{f}</li>)}</ul>
          <a href="#predict" className="panel__link">Try it now <ArrowDown size={16} /></a>
        </motion.aside>
      </motion.div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">{Array.from({ length: 6 }).map((_, i) => <span key={i}>{marquee}</span>)}</div>
      </div>
    </section>
  )
}
