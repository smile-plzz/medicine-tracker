document.addEventListener('DOMContentLoaded', () => {
    const medicineForm = document.getElementById('medicine-form');
    const scheduleTableBody = document.querySelector('#schedule-table tbody');
    const emptyScheduleMessage = document.getElementById('empty-schedule');
    const downloadPdfButton = document.getElementById('download-pdf');
    const resetScheduleButton = document.getElementById('reset-schedule');

    resetScheduleButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire schedule? This action cannot be undone.')) {
            localStorage.removeItem('medicineSchedule');
            medicines = [];
            renderSchedule();
        }
    });
    const patientNameInput = document.getElementById('patient-name');
    const addTimeBtn = document.getElementById('add-time-btn');

    const createTimeInput = () => {
        const div = document.createElement('div');
        div.className = 'flex items-center mb-2';
        div.innerHTML = `
            <input type="time" class="form-input w-full" name="medicine-time" required>
            <button type="button" class="ml-2 text-red-500 hover:text-red-700 text-xl" aria-label="Remove time input" onclick="removeTimeInput(this)">&times;</button>
        `;
        return div;
    };

    addTimeBtn.addEventListener('click', () => {
        const timeInputs = document.getElementById('time-inputs');
        timeInputs.appendChild(createTimeInput());
    });

    window.removeTimeInput = (button) => {
        button.parentElement.remove();
    };

    const medicineNameInput = document.getElementById('medicine-name');
    const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');
    const addMedicineButton = document.getElementById('add-medicine-submit-button');
    const medicineNameError = document.createElement('p');
    medicineNameError.className = 'error-message';
    medicineNameInput.parentElement.appendChild(medicineNameError);

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const fetchAutocompleteSuggestions = async (query) => {
        if (query.length < 3) {
            autocompleteSuggestions.style.display = 'none';
            return;
        }
        medicineNameInput.classList.add('loading');
        try {
            const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`);
            const data = await response.json();

            const suggestions = data.drugGroup?.drugList?.drug?.map(d => d.name) || [];
            renderAutocomplete(suggestions.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        } finally {
            medicineNameInput.classList.remove('loading');
        }
    };

    const renderAutocomplete = (suggestions) => {
        if (suggestions.length === 0) {
            autocompleteSuggestions.style.display = 'none';
            return;
        }
        autocompleteSuggestions.innerHTML = suggestions.map(s => `<div class="p-2 hover:bg-gray-200 cursor-pointer">${s}</div>`).join('');
        autocompleteSuggestions.style.display = 'block';
    };

    autocompleteSuggestions.addEventListener('click', (e) => {
        if (e.target.tagName === 'DIV') {
            medicineNameInput.value = e.target.textContent;
            autocompleteSuggestions.style.display = 'none';
        }
    });

        medicineNameInput.addEventListener('input', debounce(async () => {
        await fetchAutocompleteSuggestions(medicineNameInput.value);
    }, 300));

    const patientDobInput = document.getElementById('patient-dob');
    const patientContactInput = document.getElementById('patient-contact');
    const patientAllergiesInput = document.getElementById('patient-allergies');
    const doctorNameInput = document.getElementById('doctor-name');
    const doctorContactInput = document.getElementById('doctor-contact');

    const savePatientInfo = () => {
        const patientInfo = {
            name: patientNameInput.value,
            dob: patientDobInput.value,
            contact: patientContactInput.value,
            allergies: patientAllergiesInput.value,
            doctorName: doctorNameInput.value,
            doctorContact: doctorContactInput.value
        };
        localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
    };

    const loadPatientInfo = () => {
        const savedPatientInfo = JSON.parse(localStorage.getItem('patientInfo'));
        if (savedPatientInfo) {
            patientNameInput.value = savedPatientInfo.name || '';
            patientDobInput.value = savedPatientInfo.dob || '';
            patientContactInput.value = savedPatientInfo.contact || '';
            patientAllergiesInput.value = savedPatientInfo.allergies || '';
            doctorNameInput.value = savedPatientInfo.doctorName || '';
            doctorContactInput.value = savedPatientInfo.doctorContact || '';
        }
    };

    patientNameInput.addEventListener('input', savePatientInfo);
    patientDobInput.addEventListener('input', savePatientInfo);
    patientContactInput.addEventListener('input', savePatientInfo);
    patientAllergiesInput.addEventListener('input', savePatientInfo);
    doctorNameInput.addEventListener('input', savePatientInfo);
    doctorContactInput.addEventListener('input', savePatientInfo);

    loadPatientInfo();

    let medicines = JSON.parse(localStorage.getItem('medicineSchedule')) || [];

    const renderSchedule = () => {
        scheduleTableBody.innerHTML = '';
        if (medicines.length === 0) {
            emptyScheduleMessage.style.display = 'block';
            downloadPdfButton.disabled = true;
            return;
        }
        emptyScheduleMessage.style.display = 'none';
        downloadPdfButton.disabled = false;

        const scheduleItems = [];
        medicines.forEach(medicine => {
            medicine.times.forEach(time => {
                scheduleItems.push({ ...medicine, time });
            });
        });

        const sortedSchedule = scheduleItems.sort((a, b) => a.time.localeCompare(b.time));

        sortedSchedule.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${item.time}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${item.name}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.dosage || 'N/A'}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.instructions || 'N/A'}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.info?.genericName || 'N/A'}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.info?.category || 'N/A'}</td>
                <td class="px-4 py-2 text-sm text-gray-500">${item.info?.usage || 'No information available.'}</td>
                <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-2" onclick="editMedicine('${item.id}')" aria-label="Edit medicine"><i class="fas fa-edit"></i> Edit</button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteMedicine('${item.id}')" aria-label="Delete medicine"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
            scheduleTableBody.appendChild(row);
        });
    };

    const addMedicine = async (name, times, duration, dosage, instructions) => {
        console.log('Attempting to add medicine:', { name, times, duration, dosage, instructions });
        try {
            const medicineInfo = await fetchMedicineInfo(name);
            const newMedicine = {
                id: self.crypto.randomUUID(),
                name,
                times,
                duration,
                dosage,
                instructions,
                info: medicineInfo
            };
            medicines.push(newMedicine);
            try {
                localStorage.setItem('medicineSchedule', JSON.stringify(medicines));
                console.log('Medicine schedule saved to localStorage.');
            } catch (lsError) {
                console.error('Failed to save medicine schedule to localStorage:', lsError);
            }
            renderSchedule();
            console.log('Medicine added and schedule rendered.');
        } catch (error) {
            console.error('Error in addMedicine:', error);
        }
    };

    const fetchMedicineInfo = async (medicineName) => {
        console.log('Fetching medicine info for:', medicineName);
        try {
            const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${medicineName}`);
            console.log('RxNav drugs API response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('RxNav drugs API response data:', data);

            if (data.drugGroup.drugList && data.drugGroup.drugList.drug) {
                const rxcui = data.drugGroup.drugList.drug[0].rxcui;
                console.log('Found RxCUI:', rxcui);
                const propertiesResponse = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allproperties.json?prop=ALL`);
                console.log('RxNav properties API response status:', propertiesResponse.status);
                if (!propertiesResponse.ok) {
                    throw new Error(`HTTP error! status: ${propertiesResponse.status}`);
                }
                const propertiesData = await propertiesResponse.json();
                console.log('RxNav properties API response data:', propertiesData);

                const properties = propertiesData.propConceptGroup?.propConcept;
                const usage = properties?.find(p => p.propName === 'DEFINITIONAL_FEATURES')?.propValue || 'N/A';
                const category = properties?.find(p => p.propName === 'Drug Class')?.propValue || 'N/A';
                const genericName = properties?.find(p => p.propName === 'RxNorm Name')?.propValue || 'N/A';
                console.log('Fetched medicine info:', { usage, category, genericName });
                return { usage, category, genericName };
            } else {
                console.log('No drug found for:', medicineName);
            }
        } catch (error) {
            console.error('Failed to fetch medicine info:', error);
        }
        return null;
    };

    window.editMedicine = (id) => {
        const medicineToEdit = medicines.find(m => m.id === id);
        if (medicineToEdit) {
            document.getElementById('medicine-name').value = medicineToEdit.name;
            document.getElementById('medicine-duration').value = medicineToEdit.duration;
            document.getElementById('medicine-dosage').value = medicineToEdit.dosage || '';
            document.getElementById('medicine-instructions').value = medicineToEdit.instructions || '';
            const timeInputsContainer = document.getElementById('time-inputs');
            timeInputsContainer.innerHTML = '';
            medicineToEdit.times.forEach(time => {
                const timeInput = createTimeInput();
                timeInput.querySelector('input[name="medicine-time"]').value = time;
                timeInputsContainer.appendChild(timeInput);
            });
            deleteMedicine(id);
        }
    };

    window.deleteMedicine = (id) => {
        medicines = medicines.filter(m => m.id !== id);
        localStorage.setItem('medicineSchedule', JSON.stringify(medicines));
        renderSchedule();
    };

    medicineForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate Medicine Name
        const medicineName = medicineNameInput.value.trim();
        if (medicineName === '') {
            medicineNameInput.classList.add('invalid');
            medicineNameError.textContent = 'Medicine name is required.';
            isValid = false;
        } else {
            medicineNameInput.classList.remove('invalid');
            medicineNameError.textContent = '';
        }

        // Validate Medicine Times
        const timeInputs = document.querySelectorAll('input[name="medicine-time"]');
        const medicineTimes = Array.from(timeInputs).map(input => input.value).filter(Boolean);
        if (medicineTimes.length === 0) {
            timeInputs.forEach(input => input.classList.add('invalid'));
            // Assuming there's a common error message area for times or the first time input
            const timeError = document.createElement('p');
            timeError.className = 'error-message';
            timeError.textContent = 'At least one time is required.';
            timeInputs[0].parentElement.appendChild(timeError);
            isValid = false;
        } else {
            timeInputs.forEach(input => input.classList.remove('invalid'));
            // Remove any existing time error messages
            const existingTimeError = timeInputs[0].parentElement.querySelector('.error-message');
            if (existingTimeError) existingTimeError.remove();
        }

        if (!isValid) {
            return;
        }

        const medicineDuration = document.getElementById('medicine-duration').value;
        const medicineDosage = document.getElementById('medicine-dosage').value;
        const medicineInstructions = document.getElementById('medicine-instructions').value;

        addMedicineButton.disabled = true;
        addMedicineButton.innerHTML = '<span class="loading-indicator"></span> Adding...';

        try {
            await addMedicine(medicineName, medicineTimes, medicineDuration, medicineDosage, medicineInstructions);
            medicineForm.reset();
            const timeInputsContainer = document.getElementById('time-inputs');
            timeInputsContainer.innerHTML = ''; // Clear dynamic times
            timeInputsContainer.appendChild(createTimeInput()); // Add back one
        } finally {
            addMedicineButton.disabled = false;
            addMedicineButton.innerHTML = 'Add Medicine';
        }
    });

    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(22);
        doc.text('Medication Schedule', 105, 20, null, null, 'center');
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 180, 30, null, null, 'right');

        const patientName = patientNameInput.value || 'Patient';
        const patientDob = patientDobInput.value;
        const patientContact = patientContactInput.value;
        const patientAllergies = patientAllergiesInput.value;
        const doctorName = doctorNameInput.value;
        const doctorContact = doctorContactInput.value;

        let yOffset = 40;

        // Patient Information
        doc.setFontSize(14);
        doc.text('Patient Information:', 20, yOffset);
        doc.setFontSize(12);
        yOffset += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Name:', 20, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(patientName, 50, yOffset);
        if (patientDob) {
            yOffset += 7;
            doc.setFont('helvetica', 'bold');
            doc.text('Date of Birth:', 20, yOffset);
            doc.setFont('helvetica', 'normal');
            doc.text(patientDob, 50, yOffset);
        }
        if (patientContact) {
            yOffset += 7;
            doc.setFont('helvetica', 'bold');
            doc.text('Contact:', 20, yOffset);
            doc.setFont('helvetica', 'normal');
            doc.text(patientContact, 50, yOffset);
        }
        if (patientAllergies) {
            yOffset += 7;
            doc.setFont('helvetica', 'bold');
            doc.text('Allergies:', 20, yOffset);
            doc.setFont('helvetica', 'normal');
            doc.text(patientAllergies, 50, yOffset);
        }

        // Doctor Information
        if (doctorName || doctorContact) {
            yOffset += 15;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Doctor Information:', 20, yOffset);
            doc.setFontSize(12);
            yOffset += 10;
            if (doctorName) {
                doc.setFont('helvetica', 'bold');
                doc.text('Name:', 20, yOffset);
                doc.setFont('helvetica', 'normal');
                doc.text(doctorName, 50, yOffset);
            }
            if (doctorContact) {
                yOffset += 7;
                doc.setFont('helvetica', 'bold');
                doc.text('Contact:', 20, yOffset);
                doc.setFont('helvetica', 'normal');
                doc.text(doctorContact, 50, yOffset);
            }
        }

        yOffset += 15; // Space before table

        const tableColumn = ["Time", "Medicine", "Dosage", "Instructions", "Duration (days)", "Generic Name", "Category", "Description"];
        const tableRows = [];

        const scheduleItems = [];
        medicines.forEach(medicine => {
            medicine.times.forEach(time => {
                scheduleItems.push({ ...medicine, time });
            });
        });

        const sortedSchedule = scheduleItems.sort((a, b) => a.time.localeCompare(b.time));

        sortedSchedule.forEach(item => {
            const medicineData = [
                item.time,
                item.name,
                item.dosage || 'N/A',
                item.instructions || 'N/A',
                item.duration || 'N/A',
                item.info?.genericName || 'N/A',
                item.info?.category || 'N/A',
                item.info?.usage || 'No information available.'
            ];
            tableRows.push(medicineData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: yOffset,
            startY: yOffset,
            headStyles: { fillColor: [67, 56, 202], textColor: 255, fontSize: 10, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { top: 10, right: 20, bottom: 30, left: 20 },
            didDrawPage: function (data) {
                // Footer
                doc.setFontSize(8);
                const pageHeight = doc.internal.pageSize.height;
                doc.text('Disclaimer: Consult your doctor before making changes to your medication schedule.', 20, pageHeight - 20);
                doc.text(`Generated on ${new Date().toLocaleString()}`, 20, pageHeight - 15);
            }
        });

        doc.save(`medication_schedule_${new Date().toISOString().slice(0, 10)}.pdf`);
    });

    renderSchedule();
});