import { FunctionComponent, JSX } from "preact";
import "./Button.css";

type BaseButtonProps = JSX.DetailedHTMLProps<
  JSX.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: FunctionComponent<BaseButtonProps> = ({
  className,
  children,
  type = "button",
  ...props
}) => (
  <button {...props} type={type} className={`${className} button`}>
    {children}
  </button>
);
