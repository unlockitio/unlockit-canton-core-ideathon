# CSS Conversion Script

For the remaining large files, here's the pattern to follow:

## Files to Convert:
1. ✅ transaction-type-mockup.html (completed)
2. ✅ profiles-permissions-mockup.html (completed)
3. ✅ document-type-mockup.html (completed)
4. ✅ document-workflow-mockup.html (completed)
5. ✅ tasks-mockup.html (completed)
6. ✅ transaction-list-mockup.html (completed)
7. ✅ workflow-selection-mockup.html (completed)

## Conversion Steps:

### 1. Add CSS Link
Replace the `<title>` line with:
```html
<title>Original Title</title>
<link rel="stylesheet" href="../../common-mock-assets/css/unlockit-ui.css">
```

### 2. Replace Common CSS
Remove these sections entirely (they're in shared CSS):
- `*` reset styles
- `body` styles
- `.default-layout`
- All navigation (`.nav-bar*`, `.menu-bar*`)
- Common layouts (`.page-content`, `.page-header`)
- Standard components (`.card*`, `.btn*`, `.modal*`, `.form*`)
- Typography (`.page-title`, `.page-description`, `.breadcrumb`)

### 3. Keep Page-Specific Styles
Preserve only unique styles like:
- Document-specific item styles (`.document-type-item`, `.doc-*`)
- Transaction-specific styles (`.transaction-*`)
- Workflow-specific styles (`.workflow-*`)
- Assignment-specific styles (`.assignment-*`)
- History/meta styles unique to that page

### 4. Key Files Status:

**document-type-mockup.html** - Partially converted, needs cleanup of remaining common CSS
**Others** - Need full conversion using this pattern

The goal is to reduce each file from ~800 lines of CSS to ~50-100 lines of page-specific styles.