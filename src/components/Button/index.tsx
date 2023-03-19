import React, { forwardRef } from "react";
import classNames from "classnames";
import "./Button.css";

interface PropsTypeButton extends React.ComponentPropsWithRef<"button"> {
  size?: "l" | "s";
  variant?: "primary" | "secondary" | "destructive";
  className?: string;
}

export type Ref = HTMLButtonElement;

const Button = forwardRef<Ref, PropsTypeButton>(function Button(props, ref) {
  const { size, className, variant, ...rest } = props;
  const classNameMapped = classNames(
    "button",
    { [`button__${size}`]: size },
    { [`button__${variant}`]: variant },
    className
  );
  return <button className={classNameMapped} ref={ref} {...rest} />;
});

/*
export default function Button(props: PropsTypeButton) {
  const { size, className, variant,...rest } = props;
  const classNameMapped = classNames("button", {[`button__${size}`]: size}, {[`button__${variant}`]: variant, className});
  return (
    <button
      className={classNameMapped}
      ref={mRef}
      {...rest}
    />
  );
}
*/

export default Button;