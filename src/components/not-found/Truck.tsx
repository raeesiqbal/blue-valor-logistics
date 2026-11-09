import type { SVGProps } from 'react';

export default function Truck({ className, ...svgProps }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...svgProps}
      className={className}
      viewBox="0 0 180 78"
      role={svgProps.role ?? 'img'}
      aria-label={svgProps['aria-label'] ?? 'Blue Valor Logistics semi-truck'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#21577e" strokeLinejoin="round" strokeWidth="2">
        <path d="M7 12.5Q7 9 10.5 9H112v39H7z" fill="#62c0de" />
        <path d="M12 15h96v28H12z" fill="#3b82bb" stroke="none" />
        <path d="M16 19h88v1.6H16zM16 38h88v1.6H16z" fill="#9ddff0" stroke="none" opacity=".8" />
        <path d="M112 23h24.5q4.8 0 7.8 4.2l12.2 16.5V49H112z" fill="#3b82bb" />
        <path d="M119 27h16.3q2.6 0 4.3 2.2l8.4 11.3H119z" fill="#c9eff8" />
        <path d="M141 30.4v10.1h7.1z" fill="#62c0de" stroke="none" />
        <path d="M112 47h45v5h-45z" fill="#276a9f" />
        <path d="M5 45h109v7H5z" fill="#276a9f" />
        <path d="M12 54h9v3h-9zM94 54h9v3h-9z" fill="#d8e9ee" />
        <path d="M27 14v31M32 14v31M109 13v32" fill="none" stroke="#8dd9ec" strokeWidth="1.5" />
      </g>
      <path d="M15 26h81" fill="none" stroke="#d9f3fa" strokeWidth="2" opacity=".8" />
      <path d="M153 45h7" fill="none" stroke="#f4d278" strokeLinecap="round" strokeWidth="3" />
      <g>
        <circle cx="30" cy="55" r="10" fill="#1e2d3b" />
        <circle cx="30" cy="55" r="5.8" fill="#cad6d9" />
        <circle cx="30" cy="55" r="2" fill="#3b82bb" />
        <circle cx="82" cy="55" r="10" fill="#1e2d3b" />
        <circle cx="82" cy="55" r="5.8" fill="#cad6d9" />
        <circle cx="82" cy="55" r="2" fill="#3b82bb" />
        <circle cx="132" cy="55" r="10" fill="#1e2d3b" />
        <circle cx="132" cy="55" r="5.8" fill="#cad6d9" />
        <circle cx="132" cy="55" r="2" fill="#3b82bb" />
        <circle cx="154" cy="55" r="10" fill="#1e2d3b" />
        <circle cx="154" cy="55" r="5.8" fill="#cad6d9" />
        <circle cx="154" cy="55" r="2" fill="#3b82bb" />
      </g>
      <path d="M8 61h151" fill="none" stroke="#21577e" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
