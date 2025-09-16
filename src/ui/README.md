# UI

This folder contains pure, reusable UI components with no business logic. All components here are Storybook-ready.

---

## TireSkidTrail

**TireSkidTrail** is a global cursor effect component that renders a tyre skid trail following mouse movement. It overlays a canvas on all pages and replaces the default cursor with a dynamic tread pattern.

- Location: `src/ui/TireSkidTrail.jsx`
- Integrated globally in `src/App.jsx`
- Automatically hides the default cursor and draws the trail
- Accessibility: restores cursor on unmount, does not block keyboard navigation

To use: Ensure `<TireSkidTrail />` is rendered at the top level of your app (already integrated in App.jsx).
