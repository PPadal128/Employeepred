export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <p className="footer__tag">Understand your workforce. Predict what comes next.</p>
          <nav aria-label="Footer">{[['Platform', '#platform'], ['Predict', '#predict'], ['Bulk', '#bulk'], ['History', '#history'], ['Learn', '#learn'], ['About', '#about']].map(([l, h]) => <a key={h} href={h}>{l}</a>)}</nav>
        </div>
        <div className="footer__word" aria-hidden="true">AttriSight</div>
        <p className="footer__small">© {new Date().getFullYear()} AttriSight. Predictions are statistical estimates and should support, not replace, human judgement.</p>
      </div>
    </footer>
  )
}
