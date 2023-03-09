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
      return <h1 className={"heading-xl " + className}>{children}</h1>;
    case 2:
      return <h2 className={"heading-l " + className}>{children}</h2>;
    case 3:
      return <h3 className={"heading-m " + className}>{children}</h3>;
    case 4:
      return <h4 className={"heading-s " + className}>{children}</h4>;
    default:
        throw("Level de headings undefined");
  }
}
