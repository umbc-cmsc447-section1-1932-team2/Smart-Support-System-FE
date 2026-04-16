const Input = ({ label, className = "", ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold">{label}</label>
    <input
      className={`bg-offwhite border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors ${className}`}
      {...props}
    />
  </div>
);

export default Input;
