document.addEventListener('DOMContentLoaded', () => {
    console.log("Medicine Tracker App Pro v2.5 initialized");

    // Global Application State
    let medicines = [];
    let medicationHistory = [];
    let currentEditingMedicineId = null;
    let activeReminderTarget = null;
    let audioContext = null;

    let settings = {
        enableNotifications: false,
        enableAudio: true,
        autoSave: true,
        defaultReminder: 10
    };

    // Color Swatch Mapping
    const colorClasses = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', dot: 'bg-blue-500' },
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-500' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700', dot: 'bg-purple-500' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', dot: 'bg-amber-500' },
        rose: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-700', dot: 'bg-rose-500' },
        cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-700', dot: 'bg-cyan-500' },
        slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700', dot: 'bg-slate-500' }
    };

    const formIcons = {
        Tablet: 'fa-capsules',
        Capsule: 'fa-pills',
        Liquid: 'fa-flask',
        Injection: 'fa-syringe',
        Drops: 'fa-droplet',
        Topical: 'fa-pump-soap'
    };

    // DOM Elements Mapping
    const elements = {
        // Forms & Form inputs
        medicineForm: document.getElementById('medicine-form'),
        medicineNameInput: document.getElementById('medicine-name'),
        autocompleteSuggestions: document.getElementById('autocomplete-suggestions'),
        addMedicineButton: document.getElementById('add-medicine-submit-button'),
        formHeaderTitle: document.getElementById('form-header-title'),
        formHeaderIcon: document.getElementById('form-header-icon'),
        cancelEditBtn: document.getElementById('cancel-edit-btn'),
        timeInputs: document.getElementById('time-inputs'),
        addTimeBtn: document.getElementById('add-time-btn'),
        medicineFormType: document.getElementById('medicine-form-type'),
        medicineColor: document.getElementById('medicine-color'),
        medicineStock: document.getElementById('medicine-stock'),
        medicineRefillAlert: document.getElementById('medicine-refill-alert'),
        medicineDosage: document.getElementById('medicine-dosage'),
        medicineDuration: document.getElementById('medicine-duration'),
        medicineInstructions: document.getElementById('medicine-instructions'),
        medicineReminder: document.getElementById('medicine-reminder'),

        // Patient & Doctor Profile
        patientNameInput: document.getElementById('patient-name'),
        patientDobInput: document.getElementById('patient-dob'),
        patientContactInput: document.getElementById('patient-contact'),
        patientAllergiesInput: document.getElementById('patient-allergies'),
        doctorNameInput: document.getElementById('doctor-name'),
        doctorContactInput: document.getElementById('doctor-contact'),
        togglePatientDetailsBtn: document.getElementById('toggle-patient-details'),
        patientFieldsContainer: document.getElementById('patient-fields'),

        // Low stock warning banner
        lowStockBanner: document.getElementById('low-stock-banner'),
        lowStockText: document.getElementById('low-stock-text'),
        dismissStockBannerBtn: document.getElementById('dismiss-stock-banner'),

        // Table & Schedule Display
        scheduleTableBody: document.querySelector('#schedule-table tbody'),
        emptyScheduleMessage: document.getElementById('empty-schedule'),
        searchMedicineInput: document.getElementById('search-medicine'),
        filterTimeSelect: document.getElementById('filter-time'),
        filterStatusSelect: document.getElementById('filter-status'),

        // Metrics Dashboard
        totalMedicines: document.getElementById('total-medicines'),
        activePrescriptionsCount: document.getElementById('active-prescriptions-count'),
        todayDoses: document.getElementById('today-doses'),
        takenDosesCount: document.getElementById('taken-doses-count'),
        adherenceRate: document.getElementById('adherence-rate'),
        adherenceLabel: document.getElementById('adherence-label'),
        adherenceRing: document.getElementById('adherence-ring'),
        nextDose: document.getElementById('next-dose'),
        nextDoseMedName: document.getElementById('next-dose-med-name'),
        weeklyAdherenceChart: document.getElementById('weekly-adherence-chart'),

        // Toolbar Buttons
        downloadPdfButton: document.getElementById('download-pdf'),
        exportICalButton: document.getElementById('export-ical'),
        exportDataButton: document.getElementById('export-data'),
        resetScheduleButton: document.getElementById('reset-schedule'),
        infoButton: document.getElementById('info-button'),
        settingsButton: document.getElementById('settings-button'),
        soundToggle: document.getElementById('sound-toggle'),
        soundIcon: document.getElementById('sound-icon'),

        // Modals
        infoModal: document.getElementById('info-modal'),
        settingsModal: document.getElementById('settings-modal'),
        drugInfoModal: document.getElementById('drug-info-modal'),
        reminderAlertModal: document.getElementById('reminder-alert-modal'),
        closeModalButton: document.getElementById('close-modal'),
        closeModalX: document.getElementById('close-modal-x'),
        closeSettingsButton: document.getElementById('close-settings'),
        saveSettingsButton: document.getElementById('save-settings'),
        closeDrugModalBtn: document.getElementById('close-drug-modal'),
        closeDrugModalX: document.getElementById('close-drug-modal-x'),
        drugModalName: document.getElementById('drug-modal-name'),
        drugModalGeneric: document.getElementById('drug-modal-generic'),
        drugModalCategory: document.getElementById('drug-modal-category'),
        drugModalUsage: document.getElementById('drug-modal-usage'),
        reminderModalText: document.getElementById('reminder-modal-text'),
        reminderTakeBtn: document.getElementById('reminder-take-btn'),
        reminderSnoozeBtn: document.getElementById('reminder-snooze-btn'),

        // Settings Controls
        enableNotificationsCheckbox: document.getElementById('enable-notifications'),
        enableAudioCheckbox: document.getElementById('enable-audio'),
        autoSaveCheckbox: document.getElementById('auto-save'),
        defaultReminderSelect: document.getElementById('default-reminder'),

        // History
        medicationHistoryContainer: document.getElementById('medication-history'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),

        // Notifications & Imports
        notificationContainer: document.getElementById('notification-container'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        importDataButton: document.getElementById('import-data'),
        importFileInput: document.getElementById('import-file')
    };

    // Helper: Local Date Format (YYYY-MM-DD) avoiding UTC shifts
    function getLocalDateString(dateObj = new Date()) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Helper: Format 24h HH:mm string to 12h AM/PM format
    function format12HourTime(timeStr) {
        if (!timeStr) return '--:--';
        const [hoursStr, minutesStr] = timeStr.split(':');
        let hours = parseInt(hoursStr, 10);
        const minutes = minutesStr || '00';
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        return `${hours}:${minutes} ${ampm}`;
    }

    // Application Initialization
    function init() {
        loadData();
        setupEventListeners();
        renderSchedule();
        updateDashboard();
        renderMedicationHistory();
        renderWeeklyAdherenceChart();
        checkLowStockAlerts();
        startReminderCheck();
        registerServiceWorker();
    }

    // Service Worker Registration for PWA support
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            const swUrl = new URL('./sw.js', import.meta.url);
            navigator.serviceWorker.register(swUrl)
                .then(reg => console.log('Service Worker active:', reg.scope))
                .catch(err => console.log('Service Worker fallback:', err));
        }
    }

    // LocalStorage Data Management
    function saveData() {
        try {
            localStorage.setItem('medicineSchedule', JSON.stringify(medicines));
            localStorage.setItem('medicationHistory', JSON.stringify(medicationHistory));
            localStorage.setItem('patientInfo', JSON.stringify(getPatientInfo()));
            localStorage.setItem('settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save data:', error);
            showNotification('Failed to save data locally', 'error');
        }
    }

    function loadData() {
        try {
            medicines = JSON.parse(localStorage.getItem('medicineSchedule')) || [];
            medicationHistory = JSON.parse(localStorage.getItem('medicationHistory')) || [];
            settings = { ...settings, ...JSON.parse(localStorage.getItem('settings')) };
            
            // Normalize medicine items with defaults for stock and color
            medicines = medicines.map(m => ({
                formType: 'Tablet',
                color: 'blue',
                stock: null,
                refillAlert: 5,
                taken: [],
                ...m
            }));

            loadPatientInfo();
            loadSettings();
        } catch (error) {
            console.error('Failed to load storage data:', error);
            medicines = [];
            medicationHistory = [];
        }
    }

    function getPatientInfo() {
        return {
            name: elements.patientNameInput.value.trim(),
            dob: elements.patientDobInput.value,
            contact: elements.patientContactInput.value.trim(),
            allergies: elements.patientAllergiesInput.value.trim(),
            doctorName: elements.doctorNameInput.value.trim(),
            doctorContact: elements.doctorContactInput.value.trim()
        };
    }

    function loadPatientInfo() {
        const savedInfo = JSON.parse(localStorage.getItem('patientInfo'));
        if (savedInfo) {
            elements.patientNameInput.value = savedInfo.name || '';
            elements.patientDobInput.value = savedInfo.dob || '';
            elements.patientContactInput.value = savedInfo.contact || '';
            elements.patientAllergiesInput.value = savedInfo.allergies || '';
            elements.doctorNameInput.value = savedInfo.doctorName || '';
            elements.doctorContactInput.value = savedInfo.doctorContact || '';
        }
    }

    function loadSettings() {
        elements.enableNotificationsCheckbox.checked = settings.enableNotifications;
        elements.enableAudioCheckbox.checked = settings.enableAudio !== false;
        elements.autoSaveCheckbox.checked = settings.autoSave !== false;
        elements.defaultReminderSelect.value = settings.defaultReminder || 10;
        updateSoundIconState();
    }

    function updateSoundIconState() {
        if (!elements.soundToggle) return;
        if (settings.enableAudio) {
            elements.soundIcon.className = 'fas fa-volume-up text-blue-500 mr-1.5';
        } else {
            elements.soundIcon.className = 'fas fa-volume-xmark text-slate-400 mr-1.5';
        }
    }

    // Web Audio API Reminders Chime Sound
    function playReminderSound() {
        if (!settings.enableAudio) return;
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const now = audioContext.currentTime;
            
            // Oscillator 1 (E5 - 659.25Hz)
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, now);
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);

            // Oscillator 2 (G5 - 783.99Hz)
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(783.99, now + 0.2);
            gain2.gain.setValueAtTime(0, now + 0.2);
            gain2.gain.linearRampToValueAtTime(0.3, now + 0.25);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);

            osc1.start(now);
            osc1.stop(now + 0.45);
            osc2.start(now + 0.2);
            osc2.stop(now + 0.75);
        } catch (e) {
            console.log('Audio chime blocked or unavailable:', e);
        }
    }

    // Event Listeners Setup
    function setupEventListeners() {
        // Form submit & cancel
        elements.medicineForm.addEventListener('submit', handleMedicineSubmit);
        elements.addTimeBtn.addEventListener('click', () => addTimeInput());
        elements.cancelEditBtn.addEventListener('click', cancelEditing);

        // Toggle patient details
        elements.togglePatientDetailsBtn?.addEventListener('click', () => {
            elements.patientFieldsContainer.classList.toggle('hidden');
        });

        // Patient / Doctor profile auto-save
        [elements.patientNameInput, elements.patientDobInput, elements.patientContactInput, 
         elements.patientAllergiesInput, elements.doctorNameInput, elements.doctorContactInput]
            .forEach(input => input.addEventListener('input', () => {
                if (settings.autoSave) saveData();
            }));

        // Search & Filter listeners
        elements.searchMedicineInput.addEventListener('input', debounce(filterSchedule, 250));
        elements.filterTimeSelect.addEventListener('change', filterSchedule);
        elements.filterStatusSelect.addEventListener('change', filterSchedule);

        // Toolbar action buttons
        elements.downloadPdfButton.addEventListener('click', generatePDF);
        elements.exportICalButton?.addEventListener('click', generateICalendar);
        elements.exportDataButton.addEventListener('click', exportData);
        elements.resetScheduleButton.addEventListener('click', resetSchedule);
        elements.soundToggle?.addEventListener('click', toggleAudio);

        // Modal triggers
        elements.infoButton.addEventListener('click', () => elements.infoModal.classList.remove('hidden'));
        elements.settingsButton.addEventListener('click', () => elements.settingsModal.classList.remove('hidden'));
        elements.closeModalButton.addEventListener('click', () => elements.infoModal.classList.add('hidden'));
        elements.closeModalX?.addEventListener('click', () => elements.infoModal.classList.add('hidden'));
        elements.closeSettingsButton.addEventListener('click', () => elements.settingsModal.classList.add('hidden'));
        elements.saveSettingsButton.addEventListener('click', saveSettings);
        elements.closeDrugModalBtn?.addEventListener('click', () => elements.drugInfoModal.classList.add('hidden'));
        elements.closeDrugModalX?.addEventListener('click', () => elements.drugInfoModal.classList.add('hidden'));

        // Dismiss Stock Warning Banner
        elements.dismissStockBannerBtn?.addEventListener('click', () => {
            elements.lowStockBanner.classList.add('hidden');
        });

        // Due Reminder Modal actions
        elements.reminderTakeBtn?.addEventListener('click', () => {
            if (activeReminderTarget) {
                markAsTaken(activeReminderTarget.id, activeReminderTarget.time);
            }
            elements.reminderAlertModal.classList.add('hidden');
        });
        elements.reminderSnoozeBtn?.addEventListener('click', () => {
            showNotification('Reminder snoozed for 10 minutes', 'info');
            elements.reminderAlertModal.classList.add('hidden');
        });

        // History clear
        elements.clearHistoryBtn?.addEventListener('click', clearHistory);

        // Theme toggle
        elements.themeToggle?.addEventListener('click', toggleTheme);

        // Data Import
        elements.importDataButton?.addEventListener('click', () => elements.importFileInput.click());
        elements.importFileInput?.addEventListener('change', handleImportFile);

        // Backdrop click modal close
        [elements.infoModal, elements.settingsModal, elements.drugInfoModal, elements.reminderAlertModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        });

        // Autocomplete on medicine name input
        elements.medicineNameInput.addEventListener('input', debounce(fetchAutocompleteSuggestions, 300));
        elements.autocompleteSuggestions.addEventListener('click', handleAutocompleteClick);

        // Notification Permission switch
        elements.enableNotificationsCheckbox.addEventListener('change', (e) => {
            settings.enableNotifications = e.target.checked;
            if (e.target.checked) requestNotificationPermission();
        });
    }

    // Utility: Debounce wrapper
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Notification Toast UI
    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-blue-600';
        const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';

        toast.className = `notification-toast ${bgClass}`;
        toast.innerHTML = `
            <i class="fas ${iconClass} text-lg mr-2.5"></i>
            <span class="text-xs font-semibold">${message}</span>
            <button class="ml-4 text-white/70 hover:text-white text-sm" onclick="this.parentElement.remove()">
                <i class="fas fa-xmark"></i>
            </button>
        `;

        elements.notificationContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4500);
    }

    // Time Slot Form Dynamic Input Management
    function createTimeInput(value = '') {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2';
        div.innerHTML = `
            <input type="time" class="form-input flex-1" name="medicine-time" value="${value}" required>
            <button type="button" class="text-slate-400 hover:text-red-500 px-2 text-lg" aria-label="Remove time slot" onclick="removeTimeInput(this)">&times;</button>
        `;
        return div;
    }

    function addTimeInput(value = '') {
        elements.timeInputs.appendChild(createTimeInput(value));
    }

    window.removeTimeInput = (button) => {
        if (elements.timeInputs.children.length > 1) {
            button.parentElement.remove();
        } else {
            showNotification('At least one time slot is required', 'error');
        }
    };

    // Autocomplete API (RxNav NIH)
    async function fetchAutocompleteSuggestions() {
        const query = elements.medicineNameInput.value.trim();
        if (query.length < 3) {
            elements.autocompleteSuggestions.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(query)}`);
            const data = await response.json();
            const suggestions = data.drugGroup?.drugList?.drug?.map(d => d.name) || [];
            renderAutocomplete(suggestions.slice(0, 6));
        } catch (error) {
            console.error('Failed to fetch RxNav suggestions:', error);
            elements.autocompleteSuggestions.classList.add('hidden');
        }
    }

    function renderAutocomplete(suggestions) {
        if (suggestions.length === 0) {
            elements.autocompleteSuggestions.classList.add('hidden');
            return;
        }

        elements.autocompleteSuggestions.innerHTML = suggestions
            .map(s => `<div class="px-3 py-2 text-xs hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer transition-colors flex items-center gap-2">
                <i class="fas fa-prescription-bottle text-blue-500"></i> ${s}
            </div>`)
            .join('');
        elements.autocompleteSuggestions.classList.remove('hidden');
    }

    function handleAutocompleteClick(e) {
        const targetDiv = e.target.closest('div');
        if (targetDiv) {
            elements.medicineNameInput.value = targetDiv.textContent.trim();
            elements.autocompleteSuggestions.classList.add('hidden');
        }
    }

    // Medicine Form Processing
    async function handleMedicineSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = getFormData();
        elements.addMedicineButton.disabled = true;
        elements.addMedicineButton.innerHTML = '<span class="loading-spinner mr-2"></span> Processing...';

        try {
            if (currentEditingMedicineId) {
                await updateMedicine(currentEditingMedicineId, formData);
                showNotification('Medicine updated successfully!', 'success');
            } else {
                await addMedicine(formData);
                showNotification('Medicine added to schedule!', 'success');
            }

            resetForm();
            renderSchedule();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
        } catch (error) {
            console.error('Error submitting medicine:', error);
            showNotification('Failed to save medicine', 'error');
        } finally {
            elements.addMedicineButton.disabled = false;
            elements.addMedicineButton.innerHTML = currentEditingMedicineId ? 
                '<i class="fas fa-save mr-2"></i>Update Medicine' : 
                '<i class="fas fa-plus mr-2"></i>Add Medicine';
        }
    }

    function validateForm() {
        let isValid = true;
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

        const medicineName = elements.medicineNameInput.value.trim();
        if (!medicineName) {
            showFieldError(elements.medicineNameInput, 'Medicine name is required');
            isValid = false;
        }

        const timeInputs = document.querySelectorAll('input[name="medicine-time"]');
        const validTimes = Array.from(timeInputs).map(input => input.value).filter(Boolean);
        if (validTimes.length === 0) {
            showFieldError(timeInputs[0], 'At least one scheduled time is required');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(input, message) {
        input.classList.add('invalid');
        const error = document.createElement('p');
        error.className = 'error-message';
        error.textContent = message;
        input.parentElement.appendChild(error);
    }

    function getFormData() {
        const timeInputs = document.querySelectorAll('input[name="medicine-time"]');
        const times = Array.from(timeInputs).map(input => input.value).filter(Boolean);
        const stockVal = elements.medicineStock.value !== '' ? parseInt(elements.medicineStock.value, 10) : null;
        const refillVal = elements.medicineRefillAlert.value !== '' ? parseInt(elements.medicineRefillAlert.value, 10) : 5;

        return {
            name: elements.medicineNameInput.value.trim(),
            formType: elements.medicineFormType.value,
            color: elements.medicineColor.value,
            times: times,
            duration: elements.medicineDuration.value || null,
            dosage: elements.medicineDosage.value.trim() || '',
            stock: stockVal,
            refillAlert: refillVal,
            instructions: elements.medicineInstructions.value.trim() || '',
            reminder: elements.medicineReminder.value || settings.defaultReminder
        };
    }

    async function addMedicine(formData) {
        const medicineInfo = await fetchMedicineInfo(formData.name);
        const newMedicine = {
            id: crypto.randomUUID(),
            ...formData,
            info: medicineInfo,
            createdAt: new Date().toISOString(),
            taken: []
        };

        medicines.push(newMedicine);
        addToHistory('added', newMedicine);
        saveData();
    }

    async function updateMedicine(id, formData) {
        const index = medicines.findIndex(m => m.id === id);
        if (index !== -1) {
            const oldMed = medicines[index];
            const medicineInfo = oldMed.name.toLowerCase() === formData.name.toLowerCase() ? 
                oldMed.info : await fetchMedicineInfo(formData.name);

            medicines[index] = {
                ...oldMed,
                ...formData,
                info: medicineInfo,
                updatedAt: new Date().toISOString()
            };
            addToHistory('updated', medicines[index]);
            saveData();
        }
        cancelEditing();
    }

    // Fetch RxNav Drug Information
    async function fetchMedicineInfo(medicineName) {
        try {
            const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(medicineName)}`);
            const data = await response.json();

            if (data.drugGroup?.drugList?.drug?.length > 0) {
                const drugObj = data.drugGroup.drugList.drug[0];
                const rxcui = drugObj.rxcui;
                const propResp = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allproperties.json?prop=ALL`);
                const propData = await propResp.json();

                const properties = propData.propConceptGroup?.propConcept || [];
                return {
                    rxcui: rxcui,
                    genericName: drugObj.name || 'RxNorm Match',
                    category: properties.find(p => p.propName === 'Drug Class')?.propValue || 'Prescription / OTC',
                    usage: properties.find(p => p.propName === 'DEFINITIONAL_FEATURES')?.propValue || 'Standard therapeutic regimen'
                };
            }
        } catch (error) {
            console.error('Failed to fetch RxNav properties:', error);
        }
        return { genericName: medicineName, category: 'General Healthcare', usage: 'Take as directed by prescribing physician' };
    }

    function resetForm() {
        elements.medicineForm.reset();
        elements.timeInputs.innerHTML = '';
        elements.timeInputs.appendChild(createTimeInput());
        currentEditingMedicineId = null;
        elements.formHeaderTitle.textContent = 'Add New Medicine';
        elements.formHeaderIcon.className = 'fas fa-pills text-purple-600';
        elements.addMedicineButton.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Medicine';
        elements.cancelEditBtn.classList.add('hidden');
    }

    function cancelEditing() {
        resetForm();
    }

    // Schedule Rendering Engine
    function renderSchedule() {
        const scheduleItems = [];
        medicines.forEach(medicine => {
            medicine.times.forEach(time => {
                scheduleItems.push({ ...medicine, time });
            });
        });

        const sortedSchedule = scheduleItems.sort((a, b) => a.time.localeCompare(b.time));
        renderScheduleTable(sortedSchedule);
        updateEmptyState(sortedSchedule.length === 0);
    }

    function renderScheduleTable(scheduleItems) {
        elements.scheduleTableBody.innerHTML = '';

        scheduleItems.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors text-xs sm:text-sm';

            const status = getDoseStatus(item);
            const colorMeta = colorClasses[item.color] || colorClasses.blue;
            const formIcon = formIcons[item.formType] || 'fa-capsules';

            let statusBadge = '';
            if (status === 'taken') {
                statusBadge = `<span class="pill-badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <i class="fas fa-check-circle mr-1"></i>Taken
                </span>`;
            } else if (status === 'overdue') {
                statusBadge = `<span class="pill-badge bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                    <i class="fas fa-triangle-exclamation mr-1"></i>Overdue
                </span>`;
            } else {
                statusBadge = `<span class="pill-badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    <i class="fas fa-clock mr-1"></i>Pending
                </span>`;
            }

            // Stock Badge
            let stockDisplay = '<span class="text-slate-400">N/A</span>';
            if (item.stock !== null && item.stock !== undefined) {
                if (item.stock === 0) {
                    stockDisplay = `<span class="text-rose-600 font-bold dark:text-rose-400">0 (Out)</span>`;
                } else if (item.stock <= (item.refillAlert || 5)) {
                    stockDisplay = `<span class="text-amber-600 font-semibold dark:text-amber-400">${item.stock} left</span>`;
                } else {
                    stockDisplay = `<span class="text-slate-700 dark:text-slate-300">${item.stock}</span>`;
                }
            }

            row.innerHTML = `
                <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    <div class="flex items-center gap-1.5">
                        <i class="fas fa-regular fa-clock text-blue-500 text-xs"></i>
                        <span>${format12HourTime(item.time)}</span>
                    </div>
                </td>
                <td class="px-4 py-3">
                    <div class="flex items-center space-x-2.5">
                        <div class="w-7 h-7 rounded-lg ${colorMeta.bg} ${colorMeta.text} flex items-center justify-center text-xs flex-shrink-0">
                            <i class="fas ${formIcon}"></i>
                        </div>
                        <div>
                            <button class="font-bold text-slate-900 dark:text-white hover:text-blue-600 text-left transition-colors cursor-pointer" onclick="showDrugDetailsModal('${item.id}')">
                                ${item.name}
                            </button>
                            <div class="text-[11px] text-slate-500 flex items-center gap-1">
                                <span>${item.formType || 'Medicine'}</span>
                                ${item.info?.genericName ? `• <span class="truncate max-w-[120px]">${item.info.genericName}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">
                    <span class="font-medium">${item.dosage || '1 dose'}</span>
                    ${item.instructions ? `<div class="text-[11px] text-slate-400 truncate max-w-[150px]">${item.instructions}</div>` : ''}
                </td>
                <td class="px-4 py-3">
                    ${stockDisplay}
                </td>
                <td class="px-4 py-3">
                    ${statusBadge}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end space-x-2">
                        ${status !== 'taken' ? `
                            <button class="btn-success text-xs py-1 px-2.5" onclick="markAsTaken('${item.id}', '${item.time}')" title="Mark dose taken">
                                <i class="fas fa-check"></i> <span class="hidden sm:inline">Taken</span>
                            </button>
                        ` : `
                            <button class="btn-secondary text-xs py-1 px-2 text-slate-400" onclick="unmarkTaken('${item.id}', '${item.time}')" title="Undo taken status">
                                <i class="fas fa-undo"></i>
                            </button>
                        `}
                        <button class="btn-secondary text-xs py-1 px-2 text-blue-600" onclick="editMedicine('${item.id}')" title="Edit medicine">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn-secondary text-xs py-1 px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950" onclick="deleteMedicine('${item.id}')" title="Delete medicine">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            elements.scheduleTableBody.appendChild(row);
        });
    }

    function getDoseStatus(medicine) {
        const todayStr = getLocalDateString();
        const now = new Date();
        
        const [hours, minutes] = medicine.time.split(':').map(Number);
        const doseTime = new Date();
        doseTime.setHours(hours, minutes, 0, 0);

        const isTakenToday = (medicine.taken || []).some(entry => entry.date === todayStr && entry.time === medicine.time);

        if (isTakenToday) return 'taken';
        if (doseTime < now) return 'overdue';
        return 'pending';
    }

    function updateEmptyState(isEmpty) {
        elements.emptyScheduleMessage.style.display = isEmpty ? 'block' : 'none';
        elements.downloadPdfButton.disabled = isEmpty;
        elements.exportICalButton.disabled = isEmpty;
        elements.exportDataButton.disabled = isEmpty;
    }

    // Search and Filtering
    function filterSchedule() {
        const searchTerm = elements.searchMedicineInput.value.toLowerCase().trim();
        const timeFilter = elements.filterTimeSelect.value;
        const statusFilter = elements.filterStatusSelect.value;

        const scheduleItems = [];
        medicines.forEach(medicine => {
            medicine.times.forEach(time => {
                const item = { ...medicine, time };
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                                     (item.dosage && item.dosage.toLowerCase().includes(searchTerm)) ||
                                     (item.instructions && item.instructions.toLowerCase().includes(searchTerm));
                
                const matchesTime = !timeFilter || isTimeInPeriod(time, timeFilter);
                const status = getDoseStatus(item);
                const matchesStatus = !statusFilter || status === statusFilter;

                if (matchesSearch && matchesTime && matchesStatus) {
                    scheduleItems.push(item);
                }
            });
        });

        const sortedSchedule = scheduleItems.sort((a, b) => a.time.localeCompare(b.time));
        renderScheduleTable(sortedSchedule);
    }

    function isTimeInPeriod(time, period) {
        const [hours] = time.split(':').map(Number);
        switch (period) {
            case 'morning': return hours >= 6 && hours < 12;
            case 'afternoon': return hours >= 12 && hours < 17;
            case 'evening': return hours >= 17 && hours < 21;
            case 'night': return hours >= 21 || hours < 6;
            default: return true;
        }
    }

    // Dashboard Statistics Updates
    function updateDashboard() {
        elements.totalMedicines.textContent = medicines.length;
        elements.activePrescriptionsCount.textContent = medicines.length;

        const todayDosesTotal = medicines.reduce((sum, m) => sum + m.times.length, 0);
        elements.todayDoses.textContent = todayDosesTotal;

        const todayStr = getLocalDateString();
        let takenTodayCount = 0;
        medicines.forEach(m => {
            (m.taken || []).forEach(t => {
                if (t.date === todayStr) takenTodayCount++;
            });
        });
        elements.takenDosesCount.textContent = takenTodayCount;

        const adherencePercent = todayDosesTotal > 0 ? Math.round((takenTodayCount / todayDosesTotal) * 100) : 0;
        elements.adherenceRate.textContent = adherencePercent + '%';
        
        if (todayDosesTotal === 0) {
            elements.adherenceLabel.textContent = 'No doses today';
        } else {
            elements.adherenceLabel.textContent = `${takenTodayCount} of ${todayDosesTotal} doses taken`;
        }

        // SVG progress ring
        const strokeDashoffset = 100 - adherencePercent;
        elements.adherenceRing.style.strokeDashoffset = strokeDashoffset;

        // Next Dose Calculation
        const nextInfo = getNextDoseInfo();
        if (nextInfo) {
            elements.nextDose.textContent = format12HourTime(nextInfo.time);
            elements.nextDoseMedName.textContent = `${nextInfo.medicine.name} (${nextInfo.dayLabel})`;
        } else {
            elements.nextDose.textContent = '--:--';
            elements.nextDoseMedName.textContent = 'No pending doses';
        }
    }

    function getNextDoseInfo() {
        const now = new Date();
        const todayStr = getLocalDateString();
        let candidate = null;

        medicines.forEach(m => {
            m.times.forEach(time => {
                const [h, min] = time.split(':').map(Number);
                const doseDate = new Date();
                doseDate.setHours(h, min, 0, 0);

                const isTaken = (m.taken || []).some(t => t.date === todayStr && t.time === time);

                if (!isTaken && doseDate > now) {
                    if (!candidate || doseDate < candidate.date) {
                        candidate = { date: doseDate, time, medicine: m, dayLabel: 'Today' };
                    }
                }
            });
        });

        // If all doses for today are done/passed, look for tomorrow's earliest dose
        if (!candidate && medicines.length > 0) {
            medicines.forEach(m => {
                m.times.forEach(time => {
                    const [h, min] = time.split(':').map(Number);
                    const tomorrowDose = new Date();
                    tomorrowDose.setDate(tomorrowDose.getDate() + 1);
                    tomorrowDose.setHours(h, min, 0, 0);

                    if (!candidate || tomorrowDose < candidate.date) {
                        candidate = { date: tomorrowDose, time, medicine: m, dayLabel: 'Tomorrow' };
                    }
                });
            });
        }

        return candidate;
    }

    // 7-Day Adherence Analytics Chart Renderer
    function renderWeeklyAdherenceChart() {
        if (!elements.weeklyAdherenceChart) return;
        elements.weeklyAdherenceChart.innerHTML = '';

        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d);
        }

        days.forEach(dayDate => {
            const dateStr = getLocalDateString(dayDate);
            const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });

            let totalScheduled = medicines.reduce((sum, m) => sum + m.times.length, 0);
            let totalTaken = 0;

            medicines.forEach(m => {
                (m.taken || []).forEach(t => {
                    if (t.date === dateStr) totalTaken++;
                });
            });

            const percent = totalScheduled > 0 ? Math.min(100, Math.round((totalTaken / totalScheduled) * 100)) : 0;
            const isToday = dateStr === getLocalDateString();

            const col = document.createElement('div');
            col.className = 'flex flex-col items-center gap-1 text-center';
            col.innerHTML = `
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-24 flex items-end justify-center p-1 relative group">
                    <div class="w-full ${isToday ? 'bg-gradient-to-t from-indigo-600 to-purple-500' : 'bg-blue-500/70'} rounded-t transition-all duration-500" style="height: ${percent}%"></div>
                    <div class="absolute -top-7 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${percent}% (${totalTaken}/${totalScheduled})
                    </div>
                </div>
                <span class="text-[11px] font-semibold ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}">${dayName}</span>
            `;
            elements.weeklyAdherenceChart.appendChild(col);
        });
    }

    // Low Stock Alert Warnings
    function checkLowStockAlerts() {
        const lowStockMeds = medicines.filter(m => m.stock !== null && m.stock !== undefined && m.stock <= (m.refillAlert || 5));
        if (lowStockMeds.length > 0) {
            const medNames = lowStockMeds.map(m => `${m.name} (${m.stock} left)`).join(', ');
            elements.lowStockText.textContent = `Low stock on: ${medNames}. Please request refills soon.`;
            elements.lowStockBanner.classList.remove('hidden');
        } else {
            elements.lowStockBanner.classList.add('hidden');
        }
    }

    // History Log Management
    function addToHistory(action, medicine) {
        const historyItem = {
            id: crypto.randomUUID(),
            action,
            medicineName: medicine.name,
            timestamp: new Date().toISOString(),
            details: action === 'added' ? 'Added new medication' : action === 'taken' ? 'Dose marked as taken' : 'Medication updated'
        };

        medicationHistory.unshift(historyItem);
        if (medicationHistory.length > 60) {
            medicationHistory = medicationHistory.slice(0, 60);
        }

        renderMedicationHistory();
    }

    function renderMedicationHistory() {
        elements.medicationHistoryContainer.innerHTML = '';

        if (medicationHistory.length === 0) {
            elements.medicationHistoryContainer.innerHTML = `
                <p class="text-slate-400 text-center py-4 text-xs">No activity recorded yet</p>
            `;
            return;
        }

        medicationHistory.slice(0, 10).forEach(item => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs';
            
            const icon = item.action === 'added' ? 'fa-plus text-purple-500' : 
                         item.action === 'taken' ? 'fa-check text-emerald-500' : 'fa-pen text-blue-500';

            div.innerHTML = `
                <div class="flex items-center space-x-2.5">
                    <div class="w-6 h-6 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] shadow-sm">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 dark:text-slate-200">${item.medicineName}</p>
                        <p class="text-[11px] text-slate-500">${item.details}</p>
                    </div>
                </div>
                <span class="text-[10px] text-slate-400">${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            `;
            elements.medicationHistoryContainer.appendChild(div);
        });
    }

    function clearHistory() {
        medicationHistory = [];
        saveData();
        renderMedicationHistory();
        showNotification('Activity history cleared', 'info');
    }

    // Global Functions for Action Buttons
    window.editMedicine = (id) => {
        const medicine = medicines.find(m => m.id === id);
        if (medicine) {
            currentEditingMedicineId = id;
            elements.medicineNameInput.value = medicine.name;
            elements.medicineFormType.value = medicine.formType || 'Tablet';
            elements.medicineColor.value = medicine.color || 'blue';
            elements.medicineDuration.value = medicine.duration || '';
            elements.medicineDosage.value = medicine.dosage || '';
            elements.medicineStock.value = medicine.stock !== null && medicine.stock !== undefined ? medicine.stock : '';
            elements.medicineRefillAlert.value = medicine.refillAlert !== undefined ? medicine.refillAlert : 5;
            elements.medicineInstructions.value = medicine.instructions || '';
            elements.medicineReminder.value = medicine.reminder || settings.defaultReminder;

            elements.timeInputs.innerHTML = '';
            (medicine.times || []).forEach(time => {
                addTimeInput(time);
            });

            elements.formHeaderTitle.textContent = 'Edit Medicine';
            elements.formHeaderIcon.className = 'fas fa-pen text-blue-600';
            elements.addMedicineButton.innerHTML = '<i class="fas fa-save mr-2"></i>Update Medicine';
            elements.cancelEditBtn.classList.remove('hidden');
            window.scrollTo({ top: elements.medicineForm.offsetTop - 100, behavior: 'smooth' });
        }
    };

    window.deleteMedicine = (id) => {
        if (confirm('Are you sure you want to remove this medication from your schedule?')) {
            const medicine = medicines.find(m => m.id === id);
            medicines = medicines.filter(m => m.id !== id);
            addToHistory('deleted', medicine);
            saveData();
            renderSchedule();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            showNotification('Medicine deleted successfully', 'success');
        }
    };

    window.markAsTaken = (id, time) => {
        const medicine = medicines.find(m => m.id === id);
        if (medicine) {
            const todayStr = getLocalDateString();
            if (!medicine.taken) medicine.taken = [];

            // Remove previous entry for today+time if present
            medicine.taken = medicine.taken.filter(t => !(t.date === todayStr && t.time === time));

            // Push new taken entry
            medicine.taken.push({
                date: todayStr,
                time: time,
                timestamp: new Date().toISOString()
            });

            // Decrement inventory stock if set
            if (medicine.stock !== null && medicine.stock !== undefined && medicine.stock > 0) {
                medicine.stock -= 1;
            }

            addToHistory('taken', medicine);
            saveData();
            renderSchedule();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            showNotification(`Marked ${medicine.name} as taken!`, 'success');
        }
    };

    window.unmarkTaken = (id, time) => {
        const medicine = medicines.find(m => m.id === id);
        if (medicine && medicine.taken) {
            const todayStr = getLocalDateString();
            medicine.taken = medicine.taken.filter(t => !(t.date === todayStr && t.time === time));
            
            // Re-increment stock if set
            if (medicine.stock !== null && medicine.stock !== undefined) {
                medicine.stock += 1;
            }

            saveData();
            renderSchedule();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            showNotification(`Unmarked dose for ${medicine.name}`, 'info');
        }
    };

    window.showDrugDetailsModal = (id) => {
        const medicine = medicines.find(m => m.id === id);
        if (medicine) {
            elements.drugModalName.textContent = medicine.name;
            elements.drugModalGeneric.textContent = medicine.info?.genericName || medicine.name;
            elements.drugModalCategory.textContent = medicine.info?.category || 'General Therapeutic';
            elements.drugModalUsage.textContent = medicine.info?.usage || 'Take as directed';
            elements.drugInfoModal.classList.remove('hidden');
        }
    };

    // Application Preferences & Settings
    function saveSettings() {
        settings.enableNotifications = elements.enableNotificationsCheckbox.checked;
        settings.enableAudio = elements.enableAudioCheckbox.checked;
        settings.autoSave = elements.autoSaveCheckbox.checked;
        settings.defaultReminder = parseInt(elements.defaultReminderSelect.value, 10);

        saveData();
        updateSoundIconState();
        elements.settingsModal.classList.add('hidden');
        showNotification('Preferences updated', 'success');
    }

    function toggleAudio() {
        settings.enableAudio = !settings.enableAudio;
        elements.enableAudioCheckbox.checked = settings.enableAudio;
        saveData();
        updateSoundIconState();
        showNotification(settings.enableAudio ? 'Audio reminders enabled' : 'Audio reminders muted', 'info');
    }

    // Theme Switcher (Dark / Light Mode)
    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    }

    function updateThemeIcon(isDark) {
        if (!elements.themeIcon) return;
        elements.themeIcon.className = isDark ? 'fas fa-sun text-amber-400 mr-1.5' : 'fas fa-moon text-indigo-500 mr-1.5';
    }

    (function applySavedTheme() {
        const saved = localStorage.getItem('theme');
        const isDark = saved === 'dark';
        if (isDark) document.documentElement.classList.add('dark');
        updateThemeIcon(isDark);
    })();

    // Data Import & Export Features
    function handleImportFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result);
                if (json.medicines && Array.isArray(json.medicines)) {
                    medicines = json.medicines;
                }
                if (json.patientInfo) {
                    elements.patientNameInput.value = json.patientInfo.name || '';
                    elements.patientDobInput.value = json.patientInfo.dob || '';
                    elements.patientContactInput.value = json.patientInfo.contact || '';
                    elements.patientAllergiesInput.value = json.patientInfo.allergies || '';
                    elements.doctorNameInput.value = json.patientInfo.doctorName || '';
                    elements.doctorContactInput.value = json.patientInfo.doctorContact || '';
                }
                saveData();
                renderSchedule();
                updateDashboard();
                renderWeeklyAdherenceChart();
                checkLowStockAlerts();
                showNotification('Data imported successfully!', 'success');
            } catch (e) {
                showNotification('Invalid JSON import file', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    function exportData() {
        const data = {
            medicines,
            patientInfo: getPatientInfo(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medicine-tracker-backup-${getLocalDateString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Data exported as JSON', 'success');
    }

    // iCalendar (.ics) Sync Export
    function generateICalendar() {
        if (medicines.length === 0) {
            showNotification('No medicines to export', 'error');
            return;
        }

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Medicine Tracker Pro//NONSGML v2.5//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        medicines.forEach(m => {
            m.times.forEach(timeStr => {
                const [hh, mm] = timeStr.split(':');
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                
                const dtStart = `${year}${month}${day}T${hh}${mm}00`;
                
                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`SUMMARY:Take ${m.name} (${m.dosage || '1 dose'})`);
                icsContent.push(`DESCRIPTION:Medication Reminder: ${m.name}. Instructions: ${m.instructions || 'None'}`);
                icsContent.push(`DTSTART:${dtStart}`);
                icsContent.push(`RRULE:FREQ=DAILY`);
                icsContent.push('END:VEVENT');
            });
        });

        icsContent.push('END:VCALENDAR');

        const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medication-schedule-${getLocalDateString()}.ics`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('iCal (.ics) exported for calendar sync!', 'success');
    }

    // Reset Schedule
    function resetSchedule() {
        if (confirm('Are you sure you want to clear all medicines and settings? This action cannot be undone.')) {
            medicines = [];
            medicationHistory = [];
            localStorage.clear();
            renderSchedule();
            updateDashboard();
            renderMedicationHistory();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            showNotification('All data cleared', 'info');
        }
    }

    // Browser Push & Due Dose Alarm Reminder Logic
    function requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('Browser push notifications enabled', 'success');
                } else {
                    showNotification('Notification permission denied', 'error');
                    elements.enableNotificationsCheckbox.checked = false;
                }
            });
        }
    }

    function checkForUpcomingDoses() {
        const now = new Date();
        const todayStr = getLocalDateString();
        const currentHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        medicines.forEach(medicine => {
            medicine.times.forEach(time => {
                if (time === currentHHmm) {
                    const isTaken = (medicine.taken || []).some(t => t.date === todayStr && t.time === time);
                    if (!isTaken) {
                        triggerDoseAlarm(medicine, time);
                    }
                }
            });
        });
    }

    function triggerDoseAlarm(medicine, time) {
        playReminderSound();

        // Show browser push notification if enabled
        if (settings.enableNotifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`Medicine Time: ${medicine.name}`, {
                body: `Scheduled for ${format12HourTime(time)}. Dosage: ${medicine.dosage || '1 dose'}.`,
                icon: 'favicon.svg'
            });
        }

        // Show interactive Due Reminder Modal
        activeReminderTarget = { id: medicine.id, time };
        elements.reminderModalText.textContent = `It is time to take ${medicine.name} (${medicine.dosage || '1 dose'}) scheduled for ${format12HourTime(time)}.`;
        elements.reminderAlertModal.classList.remove('hidden');
    }

    function startReminderCheck() {
        setInterval(checkForUpcomingDoses, 30000); // Check twice every minute
    }

    // Printable PDF Generation (jsPDF)
    function generatePDF() {
        if (typeof window.jspdf === 'undefined') {
            showNotification('PDF library loading error', 'error');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header Title & Branding
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Medication Schedule & Health Plan', 15, 18);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 195, 18, null, null, 'right');

        let yOffset = 42;

        // Patient & Doctor Box
        const pInfo = getPatientInfo();
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Patient & Physician Information', 15, yOffset);
        yOffset += 6;

        const infoTable = [
            ['Patient Name', pInfo.name || 'N/A', 'Doctor Name', pInfo.doctorName || 'N/A'],
            ['Date of Birth', pInfo.dob || 'N/A', 'Doctor Contact', pInfo.doctorContact || 'N/A'],
            ['Contact Number', pInfo.contact || 'N/A', 'Allergies', pInfo.allergies || 'None reported']
        ];

        doc.autoTable({
            startY: yOffset,
            body: infoTable,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [241, 245, 249] },
            columnStyles: { 
                0: { fontStyle: 'bold', cellWidth: 30 }, 
                1: { cellWidth: 60 },
                2: { fontStyle: 'bold', cellWidth: 30 },
                3: { cellWidth: 60 }
            },
            margin: { left: 15, right: 15 },
            didDrawPage: (data) => { yOffset = data.cursor.y + 12; }
        });

        // Schedule Table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Daily Medication Protocol', 15, yOffset);
        yOffset += 6;

        const scheduleItems = [];
        medicines.forEach(m => {
            m.times.forEach(t => {
                scheduleItems.push({ ...m, time: t });
            });
        });
        const sorted = scheduleItems.sort((a, b) => a.time.localeCompare(b.time));

        const tableHeaders = ['Time', 'Medicine Name', 'Form', 'Dosage', 'Instructions', 'Duration'];
        const tableRows = sorted.map(item => [
            format12HourTime(item.time),
            item.name,
            item.formType || 'Tablet',
            item.dosage || '1 dose',
            item.instructions || 'None',
            item.duration ? `${item.duration} Days` : 'Indefinite'
        ]);

        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: yOffset,
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 8, cellPadding: 3 },
            margin: { left: 15, right: 15, bottom: 20 },
            didDrawPage: (data) => {
                const pageHeight = doc.internal.pageSize.height;
                doc.setFontSize(7);
                doc.setTextColor(100);
                doc.text('Notice: Keep all medications stored safely as instructed. Consult your doctor prior to altering dosage.', 15, pageHeight - 12);
                doc.text(`Page ${doc.internal.getNumberOfPages()}`, 195, pageHeight - 12, null, null, 'right');
            }
        });

        doc.save(`medication-schedule-${getLocalDateString()}.pdf`);
        showNotification('Printable PDF generated successfully', 'success');
    }

    // Launch Application
    init();
});