# Medicine Tracker Application

This is a minimal, user-friendly web application to help users track their daily medications, fetch medicine information via a public API, and generate a printable PDF schedule.

## Features

- **Medicine Input & Management:** Easily add new medications with details like name, multiple daily times, duration, dosage, and custom instructions. Supports editing and deleting existing entries.
- **RxNav API Integration:** Fetches comprehensive medicine information (usage, category, generic name) from the RxNav API, including real-time autocomplete suggestions for medicine names.
- **Dynamic Schedule Display:** Presents a clear, sortable table view of your medication schedule, allowing for easy overview and management.
- **Printable PDF Generation:** Generates a professional, printable PDF schedule that includes patient and doctor information, along with all medication details.
- **Local Data Persistence:** All entered data, including patient and doctor information, is securely stored locally in your browser's `localStorage` for continuous access.
- **Responsive User Interface:** Designed with Tailwind CSS to provide an optimal viewing and interaction experience across various screen sizes and devices.
- **Comprehensive Information Fields:** Dedicated sections for patient details (name, date of birth, contact, allergies) and doctor information (name, contact) to be included in the PDF schedule.

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

- **Frontend:** HTML5, CSS3 (Tailwind CSS), JavaScript
- **Bundler:** Parcel
- **PDF Generation:** jsPDF & jspdf-autotable
- **API Integration:** RxNav API
- **Data Storage:** Browser's `localStorage`

## Project Structure

```
MedicineTracker/
├── .gitignore
├── package.json
├── README.md
├── public/
│   └── index.html
└── src/
    └── main.js
```
