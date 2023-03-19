import { PropsIcons } from "./PropsIcons";

export default function LogoMobile({className} : PropsIcons) {
  return (
    <svg width="24" height="25" xmlns="http://www.w3.org/2000/svg" className={className ? className : undefined}>
      <g fill="#635FC7" fillRule="evenodd">
        <rect width="6" height="25" rx="2" />
        <rect opacity=".75" x="9" width="6" height="25" rx="2" />
        <rect opacity=".5" x="18" width="6" height="25" rx="2" />
      </g>
    </svg>
  );
}
