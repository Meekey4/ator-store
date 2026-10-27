/** Re-mounts on every page change, so each page plays its entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
