const base =
  "border-2 border-primary items-center justify-center rounded-full transition-all hover:scale-[1.1] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  filled:
    "bg-primary text-white hover:bg-inherit hover:text-primary active:scale-95 shadow-md hover:shadow-lg",
  outline:
    "border-2 border-primary text-primary bg-transparent  active:scale-95",
};
const sizes = {
  medium: "px-4 md:px-10 py-2.5 text-sm",
  big: "px-6 md:px-12 py-3.5",
};
const Button = ({
  variant = "filled",
  size = "medium",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
