# 004-Assistants: Trust Layer Map Selector

## Goal
Provide a map-first assistant entry where users can select Portuguese districts or draw a custom polygon to request verified real estate data.

## Core Experience
- The map is the primary surface, occupying the full width of the main content area.
- A single top-right mode button toggles between district selection and polygon drawing.
- When a polygon is completed, a bottom-center call to action appears to issue the first assistant prompt.

## Behaviors
- **Select zones mode**
  - District boundaries are visible and selectable.
  - The mode button reads “Draw zone”.
- **Draw zone mode**
  - Districts are hidden.
  - The mode button reads “Select zone”.
  - The user can draw exactly one polygon; a new draw replaces the previous one.
- **Prompt handoff**
  - After drawing, a “Use drawn area” button appears and sends the first prompt to the assistant.

## UI Elements
- Top toolbar: search input and reset link.
- Map header: zone filter dropdown.
- Top-right: mode toggle button.
- Bottom-center: prompt button after drawing.

## Related Files
- `docs/features/004-assistants/003-trust-layer/ai-trust-layer-chat-mockup.html`
