# Edge Gesture & Conflict Protocol

- **Mandate**: Mobile applications often suffer from edge gesture hijacking (e.g., iOS swipe-to-go-back crashing with horizontal scroll carousels).
- **Rules**:
  1. **Safe Area Shielding**: Horizontal scrolling containers (like galleries) MUST define an edge-padding of at least `16px` where `touch-action: pan-y` is forced, preventing horizontal swipe hijacking of the OS back navigation.
  2. **Backdrop Swipe**: Modals and Bottom Sheets MUST support swipe-down-to-dismiss, mirroring physical gravity constraints.
