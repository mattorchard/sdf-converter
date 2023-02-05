import { FunctionComponent, JSX } from "preact";
import "./Button.css";

type BaseButtonProps = JSX.DetailedHTMLProps<
  JSX.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface ButtonProps extends Omit<BaseButtonProps, "size"> {
  size?: "large" | "small"
};

export const Button: FunctionComponent<ButtonProps> = ({
  className,
  children,
  size = "large",
  type = "button",
  ...props
}) => (
  <button {...props} type={type} className={`${className} button button--${size}`}>
    {children}
  </button>
);
