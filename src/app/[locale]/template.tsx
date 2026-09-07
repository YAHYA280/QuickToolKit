/** Re-mounts on every navigation so the page content fades in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade [animation-duration:280ms]">{children}</div>;
}
