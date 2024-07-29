export function useTheme() {
  return { resolvedTheme: "dark" };
}

export function ThemeProvider() {
  return <div className="dark"></div>;
}
