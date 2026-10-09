import Constellation from './Constellation.jsx';

/**
 * Shareable personality card. Receives ONLY buildShareCardData() output, so it
 * cannot show rounds, stakes, payouts, results, account or location data.
 */
export default function ShareCard({ data }) {
  return (
    <div className="share-card" aria-label="Share card mockup">
      <div className="share-card__top">
        <span className="share-card__brand">
          {data.product} <span>{data.year}</span>
        </span>
        <span className="demo-pill demo-pill--sm">Demo</span>
      </div>
      <Constellation total={data.lineupNames.length} highlighted={data.newGameNames.length} />
      <p className="share-card__kicker">My player personality</p>
      <p className="share-card__title">{data.personality.title}</p>
      <p className="share-card__blurb">{data.personality.blurb}</p>
      <ul className="share-card__chips" role="list">
        {data.lineupNames.map((n) => (
          <li key={n} className={data.newGameNames.includes(n) ? 'is-new' : ''}>
            {n}
            {data.newGameNames.includes(n) && <span className="sr-only"> (new this year)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
