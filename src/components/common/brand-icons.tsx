import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true } as const;

export function GoogleScholarIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M2.5 9.2 12 3l9.5 6.2L12 15.4 2.5 9.2Z" fill="currentColor"/><path d="M6.2 12.2v4.2c2.7 2.2 8.9 2.2 11.6 0v-4.2L12 16l-5.8-3.8Z" fill="currentColor" opacity=".62"/><path d="M20 10.2v5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export function OrcidIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="8.1" cy="8" r="1.35" fill="#061316"/><path d="M6.9 10.3h2.35v7H6.9v-7Zm4.25 0h3.35c2.45 0 4.3 1.28 4.3 3.5s-1.85 3.5-4.3 3.5h-3.35v-7Zm2.25 1.85v3.3h1c1.2 0 2.05-.55 2.05-1.65 0-1.1-.85-1.65-2.05-1.65h-1Z" fill="#061316"/></svg>;
}

export function ResearchGateIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="12" cy="12" r="9.5" stroke="currentColor"/><path d="M7.1 17V7h4.25c2.35 0 3.8 1.15 3.8 3.15 0 1.38-.72 2.35-1.98 2.82L15.65 17h-2.7l-2.08-3.55H9.45V17H7.1Zm2.35-5.5h1.62c1.08 0 1.7-.43 1.7-1.25 0-.83-.62-1.25-1.7-1.25H9.45v2.5Z" fill="currentColor"/><path d="M16.7 7.1h2.2M17.8 6v2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}

export function GithubIcon(props: IconProps) {
  return <svg {...base} {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.374 6.84 9.73.5.095.683-.222.683-.493 0-.244-.009-.89-.014-1.747-2.782.62-3.369-1.375-3.369-1.375-.455-1.184-1.11-1.5-1.11-1.5-.908-.636.069-.623.069-.623 1.003.073 1.53 1.057 1.53 1.057.893 1.567 2.341 1.114 2.91.852.091-.663.35-1.114.636-1.37-2.221-.26-4.555-1.14-4.555-5.068 0-1.12.39-2.034 1.03-2.752-.103-.26-.447-1.304.098-2.714 0 0 .84-.276 2.75 1.05A9.36 9.36 0 0 1 12 6.975a9.37 9.37 0 0 1 2.504.345c1.909-1.326 2.747-1.05 2.747-1.05.546 1.41.202 2.454.1 2.714.64.718 1.028 1.633 1.028 2.752 0 3.938-2.338 4.805-4.566 5.06.359.318.679.946.679 1.907 0 1.376-.013 2.486-.013 2.824 0 .274.18.593.688.492C19.137 20.628 22 16.784 22 12.253 22 6.59 17.523 2 12 2Z" clipRule="evenodd"/></svg>;
}

export function LinkedinIcon(props: IconProps) {
  return <svg {...base} {...props}><path fill="currentColor" d="M5.3 7.8H2.4V21h2.9V7.8ZM3.85 2A1.85 1.85 0 1 0 3.85 5.7 1.85 1.85 0 0 0 3.85 2ZM21.6 13.43c0-3.98-2.13-5.83-4.96-5.83-2.29 0-3.31 1.26-3.88 2.14V7.8H9.87V21h2.89v-6.54c0-1.72.33-3.39 2.47-3.39 2.1 0 2.13 1.97 2.13 3.5V21h2.9l.01-7.57h1.33Z"/></svg>;
}

export function FacebookIcon(props: IconProps) {
  return <svg {...base} {...props}><path fill="currentColor" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.09 0 2.23.2 2.23.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56v1.9h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z"/></svg>;
}

export function WhatsAppIcon(props: IconProps) {
  return <svg {...base} {...props}><path fill="currentColor" fillRule="evenodd" d="M12.04 2a9.84 9.84 0 0 0-8.52 14.75L2 22l5.37-1.41A9.96 9.96 0 1 0 12.04 2Zm0 17.96a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.19.84.85-3.1-.2-.32A8.01 8.01 0 1 1 12.04 20Zm4.45-6.04c-.24-.12-1.44-.71-1.66-.79-.23-.08-.39-.12-.56.12-.16.25-.63.79-.78.95-.14.17-.28.19-.52.07-.24-.12-1.03-.38-1.95-1.21a7.35 7.35 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.5.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" clipRule="evenodd"/></svg>;
}
