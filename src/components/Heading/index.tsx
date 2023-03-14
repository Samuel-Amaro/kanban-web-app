import React from "react";

type PropsTypeHeadings = {
  level: number;
  className?: string;
  children: React.ReactNode;
};

export default function Heading({
  level,
  className,
  children,
}: PropsTypeHeadings) {
  switch (level) {
    case 1:
      return (
        <h1 className={className ? `heading-xl ${className}` : "heading-xl"}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={className ? `heading-l ${className}` : "heading-l"}>
          {children}
        </h2>
      );
    case 3:
      return <h3 className={className ? `heading-m ${className}` : "heading-m"}>{children}</h3>;
    case 4:
      return <h4 className={className ? `heading-s ${className}` : "heading-s"}>{children}</h4>;
    default:
      throw "Level de headings undefined";
  }
}
