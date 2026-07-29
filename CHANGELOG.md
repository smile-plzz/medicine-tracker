# Changelog

All notable changes to the Medicine Tracker application will be documented in this file.

## [3.8.0] - 2026-07-29

### 🎨 Dark Mode Default & Layout Refinement
- **Dark mode as default**: Changed theme default to dark mode. Light mode now requires explicit toggle.
- **Layout tightening**: Reduced padding across all cards (p-6 → p-4/p-5), sections (space-y-8 → space-y-4/6), and main container (py-8 → py-4/6).
- **Mobile layout fixes**: Improved grid responsiveness for dashboard cards (4→2 columns on mobile), reduced header padding, and tighter schedule table spacing.
- **Component sizing**: Reduced icon sizes (12→10), ring size (14→12), timeline marker size (14→12), and timeline bar height (8→6px).
- **Spacing consistency**: Unified gap sizes across grids (gap-5/6/8 → gap-4), reduced form field spacing, and compacted modal padding.
- **Typography scale**: Reduced heading sizes in dashboard cards and section headers for better visual hierarchy.

### 🐛 Bug Fixes
- **Service Worker Stale Cache**: Fixed "keeps loading" issue by switching to network-first fetch strategy, adding `skipWaiting()`/`clients.claim()` for immediate activation, and bumping cache name to invalidate old assets.

## [3.7.0] - 2026-07-29

### 🎨 Minimalistic Modern Theme
- **Clean flat design**: Removed glassmorphism, backdrop blur, and heavy gradients from cards, header, and banners.
- **Simplified color palette**: Replaced multi-gradient buttons with flat indigo/emerald/purple/rose solid colors; reduced shadow intensity across all components.
- **Reduced visual noise**: Simplified timeline markers, form inputs, and notification toasts; removed unnecessary decorative effects.
- **Tighter spacing**: Reduced border-radius (1rem → 0.75rem for cards, 0.625rem → 0.5rem for buttons/inputs), reduced padding, and smaller font sizes.
- **Subtle animations**: Shortened transition durations (0.25s → 0.2s) and removed heavy hover transforms (card translateY, button gradients).
- **Cleaner dark mode**: Simplified dark theme to flat `#1e293b` backgrounds with `#334155` borders instead of rgba overlays.
- **Minimal header**: Removed `backdrop-blur-md` and glass effect from sticky header; uses clean white background.
- **Simplified banners**: Alert banners use flat `bg-rose-50`/`bg-amber-50` instead of translucent gradient backgrounds.

### 🎨 UI/UX Improvements
- **Inline Handler Refactor**: Removed all inline `onclick` handlers from HTML and dynamically generated schedule rows; replaced with delegated event listeners in `src/main.js` for maintainability.
- **Modal Animations**: Added enter/exit animations (scale + translate + opacity) with backdrop blur fade transitions for all modals.
- **Ripple/Press Feedback**: Added scale-down + shadow shift press feedback on `.btn-primary` and `.btn-success` buttons.
- **Schedule Table UX**: Added striped hover rows, selected-row highlight state, horizontal scroll with gradient fade, and improved empty state with contextual "Add Your First Medicine" prompt.
- **Dashboard Enhancements**: Upgraded weekly adherence chart with segmented columns and trend indicator (▲/▼ vs yesterday delta).
- **Form Validation Feedback**: Added inline success/error field states with icons (`✅`/`❌`), preserving user input on validation failure.
- **Mobile Responsive Toolbar**: Added collapsible "More actions" chip for `sm` and smaller viewports in the schedule section.
- **Accessibility Polish**: Added `role="dialog"`, `aria-modal`, `aria-label`, `aria-haspopup`, `aria-expanded` attributes to modals and interactive elements; added `focus-visible` styles and keyboard `Esc` dismiss for all modals with focus return.
- **RxNav Loading State**: Added spinner indicator during RxNav autocomplete and drug info fetch operations.
- **CSS Fixes**: Replaced invalid `composes: btn-base` with repeated properties; added `bounce-short` keyframes animation for reminder modal; standardized dark-mode contrast overrides for inputs, borders, and muted text.

### 🩺 Ultimate Health Suite Features
- **Emergency Medical ID Card**: Emergency ID modal displaying patient name, DOB, blood type, emergency contact, allergies, and active life-sustaining medications with quick print capability.
- **Health Vitals Tracker**: Log and track daily Blood Pressure (mmHg), Glucose (mg/dL), Pulse Rate (BPM), and Weight.
- **Symptom & Side Effect Logger**: Track side effects linked to specific medications with severity badges (`Mild 🟡`, `Moderate 🟠`, `Severe 🔴`) and timestamps.
- **Dietary & Meal Caution Badges**: Visual dietary warning tags (`🥛 Take with Food`, `🍊 Avoid Grapefruit`, `🍷 Avoid Alcohol`, `⏳ Empty Stomach`).
- **Pharmacy Contact Phone Info**: Added pharmacy phone number field with direct click-to-call integration.

## [3.0.0] - 2026-07-29

### 🚀 Ultra Features Added
- **RxNav Drug-Drug Interaction Safety Matrix**: Automated multi-drug interaction checking via NIH RxNav API with real-time safety warnings.
- **24-Hour Visual Daily Timeline**: Interactive 24-hour timeline bar rendering glowing color-coded marker dots for all scheduled doses across the day.
- **Text-to-Speech Voice Assistant**: Voice readout button using Web SpeechSynthesis API to speak today's medication protocol out loud.
- **Prescription Refill Request Generator**: Auto-generates clean, copyable email/text refill requests for physicians or pharmacies.
- **Printable Weekly Pillbox Organizer Sheet**: Interactive modal rendering a Mon-Sun x Morning/Afternoon/Evening/Night pillbox packing matrix designed specifically for printing.
- **Multi-User / Family Profile Switcher**: Switch between independent family member profiles (Primary, Family 1, Family 2) stored seamlessly in localStorage.
- **Adherence Streak Counter**: Consecutive day adherence streak calculator (`🔥 Xd Streak`) encouraging medication compliance.
- **CSV History Exporter**: Export complete dose action logs as structured CSV files.

## [2.5.0] - 2026-07-29

### ✨ Added & Enhanced
- **Modern Glassmorphism UI**: Redesigned UI featuring `Plus Jakarta Sans` Google Font, glowing pill swatches, backdrop blur glass cards, dark mode integration, and micro-interactions.
- **Pill Form & Color Customization**: Customizable pill forms (Tablet, Capsule, Liquid, Injection, Drops, Topical) and color swatches (Blue, Emerald, Purple, Amber, Rose, Cyan, Slate).
- **Inventory & Refill Stock Tracking**: Real-time pill stock auto-decrement upon marking dose taken, customizable refill threshold alerts, and prominent low stock banner.
- **Web Audio Reminder Alarm Chime**: Dual-tone synthesized Web Audio chime for dose reminders with toggle control.
- **iCalendar (.ics) Sync Export**: Export daily recurring medication schedules directly to Apple Calendar, Google Calendar, or Microsoft Outlook.
- **7-Day Adherence Analytics Bar Chart**: Visual past 7-day adherence history chart and SVG progress ring.
- **Drug Info Modal (RxNav)**: Interactive modal retrieving NIH RxNav official generic name, drug category, and definitional features.
- **12-Hour AM/PM Formatting**: Clean 12-hour formatted time displays with 24-hour underlying schedule management.
- **Interactive Due Dose Modal**: Pop-up alert when a dose is due with "Take Now" and "Snooze (10m)" options.
- **Timezone Fixes**: Resolved local date string formatting issues across timezone boundaries.

## [2.0.0] - 2024-01-XX

### ✨ Added
- **Modern Dashboard**: Real-time statistics showing total medicines, today's doses, adherence rate, and next dose time
- **Smart Notifications**: Browser notifications for medication reminders with customizable timing
- **Search & Filter**: Find medicines quickly and filter by time periods (morning, afternoon, evening, night)
- **Medication History**: Track all changes and actions taken with detailed history
- **Adherence Monitoring**: Real-time adherence rate calculation and visual indicators
- **Dose Status Tracking**: Visual indicators for taken, pending, and overdue doses
- **Export Functionality**: Export data as JSON for backup or sharing
- **Settings Management**: Configure notification preferences and auto-save options
- **PWA Support**: Progressive Web App features with service worker and manifest
- **Enhanced UI/UX**: Beautiful gradient backgrounds, card hover effects, and smooth animations
- **Improved Layout**: Two-column layout for better organization and user experience
- **Better Icons**: Updated Font Awesome icons throughout the application
- **Enhanced Tables**: Better responsive table design with status indicators
- **Auto-save**: Automatic data saving with configurable options
- **Favicon**: Custom SVG favicon for better branding
- **Offline Support**: Basic offline functionality with service worker

### 🎨 Enhanced
- **Visual Design**: Complete UI redesign with modern dashboard and improved aesthetics
- **Responsive Design**: Better mobile experience with optimized layouts
- **Color Scheme**: Improved color palette with better contrast and accessibility
- **Typography**: Better font hierarchy and readability
- **Animations**: Smooth transitions and hover effects throughout the app
- **Button Styles**: Enhanced button designs with gradients and better states
- **Form Validation**: Improved validation with better error messages and visual feedback
- **Table Design**: Enhanced table with status indicators and better mobile responsiveness

### 🔧 Improved
- **Performance**: Optimized rendering and better memory management
- **Error Handling**: More robust error handling with user-friendly messages
- **Data Management**: Better localStorage management with auto-save functionality
- **API Integration**: Improved RxNav API integration with better error handling
- **Accessibility**: Enhanced ARIA labels and keyboard navigation
- **Code Organization**: Better code structure and modular functions
- **Documentation**: Comprehensive README with usage guides and feature documentation

### 🐛 Fixed
- **Mobile Responsiveness**: Fixed table display issues on mobile devices
- **Form Validation**: Improved validation logic and error display
- **Data Persistence**: Fixed issues with data saving and loading
- **PDF Generation**: Enhanced PDF layout and formatting
- **Notification System**: Fixed notification timing and display issues

### 📱 Technical Improvements
- **Service Worker**: Added offline functionality and caching
- **PWA Manifest**: Made the app installable as a PWA
- **Modern JavaScript**: Updated to use modern JavaScript features
- **Better Error Handling**: More comprehensive error handling throughout
- **Performance Optimization**: Debounced search and optimized rendering
- **Memory Management**: Automatic cleanup of old history entries

## [1.0.0] - 2023-XX-XX

### ✨ Initial Release
- Basic medicine management functionality
- RxNav API integration for medicine information
- PDF generation for medication schedules
- Local storage for data persistence
- Responsive design with Tailwind CSS
- Patient and doctor information management
- Medicine autocomplete functionality
- Basic CRUD operations for medicines

---

## Version History Summary

### v2.0.0 (Current)
- Complete redesign with modern dashboard
- Advanced tracking and notification features
- Enhanced user experience and accessibility
- PWA capabilities and offline support

### v1.0.0 (Previous)
- Basic medicine management
- PDF generation
- RxNav API integration
- Local storage persistence
