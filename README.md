# Medicine Tracker Application

This is a minimal, user-friendly web application to help users track their daily medications, fetch medicine information via a public API, and generate a printable PDF schedule.

## Features

- **Medicine Input:** Add medicine details including name, multiple times, duration, dosage, and custom instructions.
- **Medicine Info Fetch:** Fetches medicine information (usage, category, generic name) from the RxNav API with autocomplete suggestions.
- **Schedule Display:** Dynamic table view of the medication schedule, sortable by time, with edit and delete options.
- **PDF Generation:** Generates a printable PDF schedule including patient and doctor information.
- **Local Storage:** All data is persisted locally in your browser's `localStorage`.
- **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.
- **Patient Information:** Fields for patient name, date of birth, contact number, and allergies.
- **Doctor Information:** Fields for doctor's name and contact number.

## Getting Started

To run this application locally, follow these steps:

1.  **Clone the repository (if applicable) or navigate to the project directory:**

    ```bash
    cd path/to/MedicineTracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm start
    ```

    This will open the application in your default web browser at `http://localhost:1234` (or a similar address).

4.  **Build for production:**

    ```bash
    npm run build
    ```

    This will create an optimized production build in the `dist` directory.

## Usage

- **Add Medicine:** Fill out the form with medicine details and click "Add Medicine".
- **Edit/Delete:** Use the "Edit" and "Delete" buttons in the schedule table to manage entries.
- **Download PDF:** Click "Download Schedule as PDF" to generate a printable schedule.
- **Reset Schedule:** Click "Reset Schedule" to clear all saved medication data.

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript
- Parcel (for bundling)
- jsPDF & jspdf-autotable (for PDF generation)
- RxNav API (for medicine information)
