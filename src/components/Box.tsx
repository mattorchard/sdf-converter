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
  gap?: JSX.CSSProperties["gap"];
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

const numericsAsRem = (value: unknown) => {
  if (typeof value === 'number') return `${value}rem`
  return value;
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
  gap,
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
    marginTop: numericsAsRem(mt ?? my ?? m),
    marginRight: numericsAsRem(mr ?? mx ?? m),
    marginBottom: numericsAsRem(mb ?? my ?? m),
    marginLeft: numericsAsRem(ml ?? mx ?? m),
    paddingTop: numericsAsRem(pt ?? py ?? p),
    paddingRight: numericsAsRem(pr ?? px ?? p),
    paddingBottom: numericsAsRem(pb ?? py ?? p),
    paddingLeft: numericsAsRem(pl ?? px ?? p),
    gap: numericsAsRem(gap),
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
