export default function Icon({ name, size = 20, className = '' }) {
  return <span aria-hidden="true" className={`icon ${className}`} style={{ fontSize: size }}>{name}</span>;
}
