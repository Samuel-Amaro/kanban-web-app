import React from "react";

interface PropsTypeButton extends React.ComponentPropsWithRef<"button"> {
  size: "l" | "s";
  variant: "primary" | "secondary" | "destructive";
  className?: string;
}

export default function Button(props: PropsTypeButton) {
  const { size, className, variant, ...rest } = props;
  return (
    <button
      className={
        className
          ? `button button__${size} button__${variant} ${className}`
          : `button button__${size} button__${variant}`
      }
      {...rest}
    />
  );
}
