import { JSX, FunctionComponent } from "preact";

type DivProps = JSX.DetailedHTMLProps<
  JSX.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type PaddingType = JSX.CSSProperties["paddingTop"];
type MarginType = JSX.CSSProperties["paddingTop"];

export interface BoxProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  alignItems?: JSX.CSSProperties["alignItems"];
  justifyContent?: JSX.CSSProperties["justifyContent"];
  flexDirection?: JSX.CSSProperties["flexDirection"];
  inline?: boolean;
  p?: PaddingType;
  px?: PaddingType;
  py?: PaddingType;
  pt?: PaddingType;
  pr?: PaddingType;
  pb?: PaddingType;
  pl?: PaddingType;
  m?: MarginType;
  mx?: MarginType;
  my?: MarginType;
  mt?: MarginType;
  mr?: MarginType;
  mb?: MarginType;
  ml?: MarginType;
}

const Box: FunctionComponent<BoxProps & DivProps> = ({
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  inline,
  flexDirection,
  alignItems,
  justifyContent,
  className,
  as: As = "div",
  children,
  ...props
}) => {
  const style = {
    marginTop: mt ?? my ?? m,
    marginRight: mr ?? mx ?? m,
    marginBottom: mb ?? my ?? m,
    marginLeft: ml ?? mx ?? m,
    paddingTop: pt ?? py ?? p,
    paddingRight: pr ?? px ?? p,
    paddingBottom: pb ?? py ?? p,
    paddingLeft: pl ?? px ?? p,
    display: inline ? "inline-flex" : "flex",
    flexDirection,
    alignItems,
    justifyContent,
  };

  return (
    // @ts-ignore
    <As {...props} className={className} style={style}>
      {children}
    </As>
  );
};

export default Box;
