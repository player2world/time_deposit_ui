interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({ children, disabled = false, onClick }: ButtonProps) => {
  return (
    <>
      <div className={disabled ? "button disabled" : "button"}>
        <button className="buttonWrap" disabled={disabled} onClick={onClick}>
          {children}
        </button>
      </div>
    </>
  );
};

export default Button;
