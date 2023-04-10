import { PropsIcons } from "./PropsIcons";

export default function VerticalEllipsis({className} : PropsIcons) {
  return (
    <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg" className={className ? className : undefined}>
      <g fill="#828FA3" fillRule="evenodd">
        <circle cx="2.308" cy="2.308" r="2.308" />
        <circle cx="2.308" cy="10" r="2.308" />
        <circle cx="2.308" cy="17.692" r="2.308" />
      </g>
    </svg>
  );
}
