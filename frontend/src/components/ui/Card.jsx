function Card({ children, className = "" }) {
  return (
    <div
      className={`glass-card rounded-3xl p-6 shadow-soft transition duration-300 hover:border-indigo-400/30 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;