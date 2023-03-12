import React from "react";
import classNames from "classnames";

interface PropsTypeButton extends React.ComponentPropsWithRef<"button"> {
  size: "l" | "s";
  variant?: "primary" | "secondary" | "destructive";
  className?: string;
}

export default function Button(props: PropsTypeButton) {
  const { size, className, variant, ...rest } = props;
  const classNameMapped = classNames("button", {[`button__${size}`]: size}, {[`button__${variant}`]: variant, className});
  return (
    <button
      className={classNameMapped}
      {...rest}
    />
  );
}
