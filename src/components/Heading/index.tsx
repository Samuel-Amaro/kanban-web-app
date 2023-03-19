import React from "react";
import "./Heading.css";

interface PropsTypeHeadings {
  level: number;
  className?: string;
  children: React.ReactNode;
  id?: string;
};

export default function Heading({
  level,
  className,
  children,
  id
}: PropsTypeHeadings) {
  switch (level) {
    case 1:
      return (
        <h1 className={className ? `heading-xl ${className}` : "heading-xl"} id={id ? id : undefined}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2
          className={className ? `heading-l ${className}` : "heading-l"}
          id={id ? id : undefined}
        >
          {children}
        </h2>
      );
    case 3:
      return (
        <h3
          className={className ? `heading-m ${className}` : "heading-m"}
          id={id ? id : undefined}
        >
          {children}
        </h3>
      );
    case 4:
      return (
        <h4
          className={className ? `heading-s ${className}` : "heading-s"}
          id={id ? id : undefined}
        >
          {children}
        </h4>
      );
    default:
      throw "Level de headings undefined";
  }
}
