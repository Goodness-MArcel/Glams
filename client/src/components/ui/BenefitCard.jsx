export default function BenefitCard({ icon, title, text }) {
  return (
    <div className="benefit-card-classic text-center p-4 p-md-5">
      <div className="icon-wrapper mb-4">
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="benefit-title">{title}</h5>
      <p className="benefit-text">{text}</p>
      <div className="ornament mt-3"></div>
    </div>
  );
}