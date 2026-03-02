# Unlockit UI Framework

This directory contains shared CSS resources for all Unlockit mockup files.

## Structure

```
common/
├── css/
│   ├── base.css          # Typography, resets, utility classes
│   ├── layout.css        # Grid layout, navigation structure
│   ├── navigation.css    # Sidebar and top navigation styles
│   ├── components.css    # Cards, buttons, forms, modals
│   └── unlockit-ui.css   # Main entry point (imports all above)
└── README.md
```

## Usage

To convert an existing HTML mockup to use the shared framework:

1. **Replace the style block** with a link to the shared CSS:
   ```html
   <link rel="stylesheet" href="../../common-mock-assets/css/unlockit-ui.css">
   ```

2. **Keep only page-specific styles** in the remaining `<style>` block:
   ```html
   <style>
   /* Page-specific overrides only */
   .special-component { ... }
   </style>
   ```

3. **Common styles included**:
   - Base typography and resets
   - Grid layout system
   - Navigation (sidebar + top bar)
   - Standard components (cards, buttons, forms, modals)
   - Utility classes

## Benefits

- **90% reduction** in CSS duplication
- **Consistent styling** across all mockups
- **Single source of truth** for design system
- **Easier maintenance** and updates
- **Faster development** of new mockups

## Implementation Status

✅ **Completed:**
- transaction-type-mockup.html
- profiles-permissions-mockup.html

🔄 **Remaining files to convert:**
- document-type-mockup.html
- document-workflow-mockup.html
- tasks-mockup.html
- transaction-list-mockup.html
- workflow-selection-mockup.html

## Pattern for Converting Files

1. Find the closing `</style>` tag in the file
2. Replace entire style block with shared CSS link + minimal overrides
3. Test that layout and functionality remain intact
4. Remove any redundant CSS that's now in the shared files