## 2026-03-08 - Array reference churn in NextActionZone props
**Learning:** Found a specific pattern in apps/dealer/modules/customers/ui/DetailPage.tsx where `initialCallbacks?.data ?? []` is passed directly as a prop to a child component (`NextActionZone`) which causes its internal useMemo to re-evaluate on every parent render because the inline empty array `[]` creates a new reference.
**Action:** Always memoize derived array props (like defaults from undefined objects) before passing to components that rely on reference equality for `useMemo` optimizations.
