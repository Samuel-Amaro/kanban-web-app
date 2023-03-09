import React from "react";

type PropsTypeHeadings = {
  level: number;
  className?: string;
  children: React.ReactNode;
};

export default function Headings({
  level,
  className,
  children,
}: PropsTypeHeadings) {
  switch (level) {
    case 1:
      return <h1 className="heading-xl">{children}</h1>;
  }
}
