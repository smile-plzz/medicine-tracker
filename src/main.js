document.addEventListener('DOMContentLoaded', () => {
    console.log("Medicine Tracker Ultimate v3.5 initialized");

    // Global Application State
    let currentProfile = 'Primary';
    let medicines = [];
    let medicationHistory = [];
    let symptomsLog = [];
    let vitalsData = null;
    let currentEditingMedicineId = null;
    let activeReminderTarget = null;
    let audioContext = null;

    let settings = {
        enableNotifications: false,
        enableAudio: true,
        enableInteractionCheck: true,
        autoSave: true,
        defaultReminder: 10
    };

    // Color Swatches Mapping
    const colorClasses = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', dot: '#3b82f6' },
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', dot: '#10b981' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700', dot: '#8b5cf6' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', dot: '#f59e0b' },
        rose: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-700', dot: '#ef4444' },
        cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-700', dot: '#06b6d4' },
        slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700', dot: '#64748b' }
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
        // Navigation
        profileSelector: document.getElementById('profile-selector'),
        openEmergencyIdBtn: document.getElementById('open-emergency-id-btn'),
        voiceSpeakBtn: document.getElementById('voice-speak-btn'),
        soundToggle: document.getElementById('sound-toggle'),
        soundIcon: document.getElementById('sound-icon'),
        infoButton: document.getElementById('info-button'),
        settingsButton: document.getElementById('settings-button'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),

        // Banners
        interactionAlertBanner: document.getElementById('interaction-alert-banner'),
        interactionAlertSummary: document.getElementById('interaction-alert-summary'),
        interactionDetailsList: document.getElementById('interaction-details-list'),
        dismissInteractionBannerBtn: document.getElementById('dismiss-interaction-banner'),
        lowStockBanner: document.getElementById('low-stock-banner'),
        lowStockText: document.getElementById('low-stock-text'),
        dismissStockBannerBtn: document.getElementById('dismiss-stock-banner'),
        openRefillModalBtn: document.getElementById('open-refill-modal-btn'),

        // Timeline
        timelineContainer: document.getElementById('timeline-container'),

        // Vitals & Symptoms
        vitalsForm: document.getElementById('vitals-form'),
        vitalBp: document.getElementById('vital-bp'),
        vitalGlucose: document.getElementById('vital-glucose'),
        vitalPulse: document.getElementById('vital-pulse'),
        vitalWeight: document.getElementById('vital-weight'),
        vitalsLastUpdated: document.getElementById('vitals-last-updated'),
        openSymptomModalBtn: document.getElementById('open-symptom-modal-btn'),
        symptomsListContainer: document.getElementById('symptoms-list-container'),
        symptomModal: document.getElementById('symptom-modal'),
        symptomForm: document.getElementById('symptom-form'),
        symptomMedSelect: document.getElementById('symptom-med-select'),
        symptomSeverity: document.getElementById('symptom-severity'),
        symptomNotes: document.getElementById('symptom-notes'),
        closeSymptomModalX: document.getElementById('close-symptom-modal-x'),

        // Emergency ID Modal
        emergencyIdModal: document.getElementById('emergency-id-modal'),
        closeEmergencyModalX: document.getElementById('close-emergency-modal-x'),
        closeEmergencyModalBtn: document.getElementById('close-emergency-modal'),
        printEmergencyIdBtn: document.getElementById('print-emergency-id-btn'),
        emIdName: document.getElementById('em-id-name'),
        emIdBlood: document.getElementById('em-id-blood'),
        emIdPhone: document.getElementById('em-id-phone'),
        emIdAllergies: document.getElementById('em-id-allergies'),
        emIdMedsList: document.getElementById('em-id-meds-list'),

        // Form & Form Inputs
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
        medicineDietaryCaution: document.getElementById('medicine-dietary-caution'),
        medicineDosage: document.getElementById('medicine-dosage'),
        medicineDuration: document.getElementById('medicine-duration'),
        medicineInstructions: document.getElementById('medicine-instructions'),
        medicineReminder: document.getElementById('medicine-reminder'),

        // Patient & Doctor Profile
        patientNameInput: document.getElementById('patient-name'),
        patientDobInput: document.getElementById('patient-dob'),
        patientContactInput: document.getElementById('patient-contact'),
        patientBloodType: document.getElementById('patient-blood-type'),
        pharmacyPhoneInput: document.getElementById('pharmacy-phone'),
        patientAllergiesInput: document.getElementById('patient-allergies'),
        doctorNameInput: document.getElementById('doctor-name'),
        doctorContactInput: document.getElementById('doctor-contact'),
        togglePatientDetailsBtn: document.getElementById('toggle-patient-details'),
        patientFieldsContainer: document.getElementById('patient-fields'),

        // Schedule & Table
        scheduleTableBody: document.querySelector('#schedule-table tbody'),
        emptyScheduleMessage: document.getElementById('empty-schedule'),
        searchMedicineInput: document.getElementById('search-medicine'),
        filterTimeSelect: document.getElementById('filter-time'),
        filterStatusSelect: document.getElementById('filter-status'),

        // Dashboard Cards
        totalMedicines: document.getElementById('total-medicines'),
        activePrescriptionsCount: document.getElementById('active-prescriptions-count'),
        todayDoses: document.getElementById('today-doses'),
        takenDosesCount: document.getElementById('taken-doses-count'),
        adherenceRate: document.getElementById('adherence-rate'),
        adherenceLabel: document.getElementById('adherence-label'),
        adherenceRing: document.getElementById('adherence-ring'),
        streakBadge: document.getElementById('streak-badge'),
        nextDose: document.getElementById('next-dose'),
        nextDoseMedName: document.getElementById('next-dose-med-name'),
        weeklyAdherenceChart: document.getElementById('weekly-adherence-chart'),

        // Action Toolbar
        downloadPdfButton: document.getElementById('download-pdf'),
        printPillboxBtn: document.getElementById('print-pillbox-btn'),
        exportICalButton: document.getElementById('export-ical'),
        exportCsvBtn: document.getElementById('export-csv-btn'),
        exportDataButton: document.getElementById('export-data'),
        resetScheduleButton: document.getElementById('reset-schedule'),
        importDataButton: document.getElementById('import-data'),
        importFileInput: document.getElementById('import-file'),

        // Modals
        infoModal: document.getElementById('info-modal'),
        settingsModal: document.getElementById('settings-modal'),
        drugInfoModal: document.getElementById('drug-info-modal'),
        reminderAlertModal: document.getElementById('reminder-alert-modal'),
        refillModal: document.getElementById('refill-modal'),
        pillboxModal: document.getElementById('pillbox-modal'),
        closeModalButton: document.getElementById('close-modal'),
        closeModalX: document.getElementById('close-modal-x'),
        closeSettingsButton: document.getElementById('close-settings'),
        saveSettingsButton: document.getElementById('save-settings'),
        closeDrugModalBtn: document.getElementById('close-drug-modal'),
        closeDrugModalX: document.getElementById('close-drug-modal-x'),
        closeRefillModalBtn: document.getElementById('close-refill-modal'),
        closeRefillModalX: document.getElementById('close-refill-modal-x'),
        copyRefillTextBtn: document.getElementById('copy-refill-text-btn'),
        refillTextArea: document.getElementById('refill-text-area'),
        closePillboxModalBtn: document.getElementById('close-pillbox-modal'),
        closePillboxModalX: document.getElementById('close-pillbox-modal-x'),
        printPillboxBtnModal: document.getElementById('print-pillbox-btn-modal'),
        pillboxTableBody: document.getElementById('pillbox-table-body'),

        drugModalName: document.getElementById('drug-modal-name'),
        drugModalGeneric: document.getElementById('drug-modal-generic'),
        drugModalCategory: document.getElementById('drug-modal-category'),
        drugModalUsage: document.getElementById('drug-modal-usage'),
        reminderModalText: document.getElementById('reminder-modal-text'),
        reminderTakeBtn: document.getElementById('reminder-take-btn'),
        reminderSnoozeBtn: document.getElementById('reminder-snooze-btn'),

        // Settings inputs
        enableNotificationsCheckbox: document.getElementById('enable-notifications'),
        enableAudioCheckbox: document.getElementById('enable-audio'),
        enableInteractionCheckCheckbox: document.getElementById('enable-interaction-check'),
        autoSaveCheckbox: document.getElementById('auto-save'),
        defaultReminderSelect: document.getElementById('default-reminder'),

        // History
        medicationHistoryContainer: document.getElementById('medication-history'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        notificationContainer: document.getElementById('notification-container')
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
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    // App Initialization
    function init() {
        loadData();
        setupEventListeners();
        renderSchedule();
        renderTimeline();
        updateDashboard();
        renderMedicationHistory();
        renderWeeklyAdherenceChart();
        renderVitals();
        renderSymptomsLog();
        checkLowStockAlerts();
        checkDrugInteractions();
        startReminderCheck();
        registerServiceWorker();
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            const swUrl = new URL('./sw.js', import.meta.url);
            navigator.serviceWorker.register(swUrl)
                .then(reg => console.log('Service Worker active:', reg.scope))
                .catch(err => console.log('Service Worker fallback:', err));
        }
    }

    // Data Storage Keys & Profiles
    function getStorageKey(base) {
        return `${base}_${currentProfile}`;
    }

    function saveData() {
        try {
            localStorage.setItem(getStorageKey('medicineSchedule'), JSON.stringify(medicines));
            localStorage.setItem(getStorageKey('medicationHistory'), JSON.stringify(medicationHistory));
            localStorage.setItem(getStorageKey('patientInfo'), JSON.stringify(getPatientInfo()));
            localStorage.setItem(getStorageKey('symptomsLog'), JSON.stringify(symptomsLog));
            localStorage.setItem(getStorageKey('vitalsData'), JSON.stringify(vitalsData));
            localStorage.setItem('settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save storage data:', error);
            showNotification('Failed to save data locally', 'error');
        }
    }

    function loadData() {
        try {
            medicines = JSON.parse(localStorage.getItem(getStorageKey('medicineSchedule'))) || [];
            medicationHistory = JSON.parse(localStorage.getItem(getStorageKey('medicationHistory'))) || [];
            symptomsLog = JSON.parse(localStorage.getItem(getStorageKey('symptomsLog'))) || [];
            vitalsData = JSON.parse(localStorage.getItem(getStorageKey('vitalsData'))) || null;
            settings = { ...settings, ...JSON.parse(localStorage.getItem('settings')) };

            medicines = medicines.map(m => ({
                formType: 'Tablet',
                color: 'blue',
                stock: null,
                refillAlert: 5,
                dietaryCaution: '',
                taken: [],
                ...m
            }));

            loadPatientInfo();
            loadSettings();
        } catch (error) {
            console.error('Failed to load storage data:', error);
            medicines = [];
            medicationHistory = [];
            symptomsLog = [];
            vitalsData = null;
        }
    }

    function getPatientInfo() {
        return {
            name: elements.patientNameInput.value.trim(),
            dob: elements.patientDobInput.value,
            contact: elements.patientContactInput.value.trim(),
            bloodType: elements.patientBloodType.value,
            pharmacyPhone: elements.pharmacyPhoneInput.value.trim(),
            allergies: elements.patientAllergiesInput.value.trim(),
            doctorName: elements.doctorNameInput.value.trim(),
            doctorContact: elements.doctorContactInput.value.trim()
        };
    }

    function loadPatientInfo() {
        const savedInfo = JSON.parse(localStorage.getItem(getStorageKey('patientInfo')));
        if (savedInfo) {
            elements.patientNameInput.value = savedInfo.name || '';
            elements.patientDobInput.value = savedInfo.dob || '';
            elements.patientContactInput.value = savedInfo.contact || '';
            elements.patientBloodType.value = savedInfo.bloodType || 'O+';
            elements.pharmacyPhoneInput.value = savedInfo.pharmacyPhone || '';
            elements.patientAllergiesInput.value = savedInfo.allergies || '';
            elements.doctorNameInput.value = savedInfo.doctorName || '';
            elements.doctorContactInput.value = savedInfo.doctorContact || '';
        } else {
            elements.patientNameInput.value = '';
            elements.patientDobInput.value = '';
            elements.patientContactInput.value = '';
            elements.patientBloodType.value = 'O+';
            elements.pharmacyPhoneInput.value = '';
            elements.patientAllergiesInput.value = '';
            elements.doctorNameInput.value = '';
            elements.doctorContactInput.value = '';
        }
    }

    function loadSettings() {
        elements.enableNotificationsCheckbox.checked = settings.enableNotifications;
        elements.enableAudioCheckbox.checked = settings.enableAudio !== false;
        elements.enableInteractionCheckCheckbox.checked = settings.enableInteractionCheck !== false;
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

    // Sound Reminders
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
            
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, now);
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);

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
            console.log('Audio chime unavailable:', e);
        }
    }

    // Voice Assistant
    function speakSchedule() {
        if (!('speechSynthesis' in window)) {
            showNotification('Text-to-speech not supported in browser', 'error');
            return;
        }

        window.speechSynthesis.cancel();
        const pName = elements.patientNameInput.value.trim() || 'Patient';
        const todayCount = medicines.reduce((sum, m) => sum + m.times.length, 0);

        if (todayCount === 0) {
            const utter = new SpeechSynthesisUtterance(`Hello ${pName}. You have no medicines scheduled for today.`);
            window.speechSynthesis.speak(utter);
            return;
        }

        const nextInfo = getNextDoseInfo();
        let text = `Hello ${pName}. You have ${todayCount} scheduled dose times today. `;
        if (nextInfo) {
            text += `Your next dose is ${nextInfo.medicine.name}, scheduled for ${format12HourTime(nextInfo.time)}.`;
        } else {
            text += `All scheduled doses for today have been completed. Great job!`;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
        showNotification('Speaking schedule...', 'info');
    }

    // Event Listeners Setup
    function setupEventListeners() {
        // Profile Selector
        elements.profileSelector?.addEventListener('change', (e) => {
            currentProfile = e.target.value;
            loadData();
            renderSchedule();
            renderTimeline();
            updateDashboard();
            renderMedicationHistory();
            renderWeeklyAdherenceChart();
            renderVitals();
            renderSymptomsLog();
            checkLowStockAlerts();
            checkDrugInteractions();
            showNotification(`Switched profile to ${currentProfile}`, 'info');
        });

        // Emergency Medical ID Card Modal
        elements.openEmergencyIdBtn?.addEventListener('click', openEmergencyModal);
        elements.closeEmergencyModalBtn?.addEventListener('click', () => closeModal(elements.emergencyIdModal));
        elements.closeEmergencyModalX?.addEventListener('click', () => closeModal(elements.emergencyIdModal));
        elements.printEmergencyIdBtn?.addEventListener('click', () => window.print());

        // Vitals Form Submit
        elements.vitalsForm?.addEventListener('submit', handleVitalsSubmit);

        // Symptoms Modal & Submit
        elements.openSymptomModalBtn?.addEventListener('click', openSymptomModal);
        elements.closeSymptomModalX?.addEventListener('click', () => closeModal(elements.symptomModal));
        elements.symptomForm?.addEventListener('submit', handleSymptomSubmit);

        // Voice Readout Button
        elements.voiceSpeakBtn?.addEventListener('click', speakSchedule);

        // Form events
        elements.medicineForm.addEventListener('submit', handleMedicineSubmit);
        elements.addTimeBtn.addEventListener('click', () => addTimeInput());
        elements.cancelEditBtn.addEventListener('click', cancelEditing);

        // Toggle patient details
        elements.togglePatientDetailsBtn?.addEventListener('click', () => {
            elements.patientFieldsContainer.classList.toggle('hidden');
        });

        // Patient profile auto-save
        [elements.patientNameInput, elements.patientDobInput, elements.patientContactInput,
         elements.patientBloodType, elements.pharmacyPhoneInput, elements.patientAllergiesInput,
         elements.doctorNameInput, elements.doctorContactInput]
            .forEach(input => input.addEventListener('input', () => {
                if (settings.autoSave) saveData();
            }));

        // Search & Filter
        elements.searchMedicineInput.addEventListener('input', debounce(filterSchedule, 250));
        elements.filterTimeSelect.addEventListener('change', filterSchedule);
        elements.filterStatusSelect.addEventListener('change', filterSchedule);

        // Toolbar Buttons
        elements.downloadPdfButton.addEventListener('click', generatePDF);
        elements.printPillboxBtn?.addEventListener('click', openPillboxModal);
        elements.exportICalButton?.addEventListener('click', generateICalendar);
        elements.exportCsvBtn?.addEventListener('click', exportCSV);
        elements.exportDataButton.addEventListener('click', exportData);
        elements.resetScheduleButton.addEventListener('click', resetSchedule);
        elements.soundToggle?.addEventListener('click', toggleAudio);

        // Banners
        elements.dismissStockBannerBtn?.addEventListener('click', () => elements.lowStockBanner.classList.add('hidden'));
        elements.dismissInteractionBannerBtn?.addEventListener('click', () => elements.interactionAlertBanner.classList.add('hidden'));
        elements.openRefillModalBtn?.addEventListener('click', openRefillModal);

        // Refill Modal
        elements.closeRefillModalBtn?.addEventListener('click', () => closeModal(elements.refillModal));
        elements.closeRefillModalX?.addEventListener('click', () => closeModal(elements.refillModal));
        elements.copyRefillTextBtn?.addEventListener('click', copyRefillText);

        // Pillbox Modal
        elements.closePillboxModalBtn?.addEventListener('click', () => closeModal(elements.pillboxModal));
        elements.closePillboxModalX?.addEventListener('click', () => closeModal(elements.pillboxModal));
        elements.printPillboxBtnModal?.addEventListener('click', () => window.print());

        // Info & Settings Modals
        elements.infoButton.addEventListener('click', () => openModal(elements.infoModal));
        elements.settingsButton.addEventListener('click', () => openModal(elements.settingsModal));
        elements.closeModalButton.addEventListener('click', () => closeModal(elements.infoModal));
        elements.closeModalX?.addEventListener('click', () => closeModal(elements.infoModal));
        elements.closeSettingsButton.addEventListener('click', () => closeModal(elements.settingsModal));
        elements.saveSettingsButton.addEventListener('click', saveSettings);
        elements.closeDrugModalBtn?.addEventListener('click', () => closeModal(elements.drugInfoModal));
        elements.closeDrugModalX?.addEventListener('click', () => closeModal(elements.drugInfoModal));

        // Reminder Modal
        elements.reminderTakeBtn?.addEventListener('click', () => {
            if (activeReminderTarget) {
                markAsTaken(activeReminderTarget.id, activeReminderTarget.time);
            }
            closeModal(elements.reminderAlertModal);
        });
        elements.reminderSnoozeBtn?.addEventListener('click', () => {
            showNotification('Reminder snoozed for 10 minutes', 'info');
            closeModal(elements.reminderAlertModal);
        });

        // History
        elements.clearHistoryBtn?.addEventListener('click', clearHistory);
        elements.themeToggle?.addEventListener('click', toggleTheme);

        // Import
        elements.importDataButton?.addEventListener('click', () => elements.importFileInput.click());
        elements.importFileInput?.addEventListener('change', handleImportFile);

        // Empty state add button
        document.getElementById('empty-state-add-btn')?.addEventListener('click', () => {
            elements.medicineNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            elements.medicineNameInput.focus();
        });

        // Backdrop click modals
        [elements.infoModal, elements.settingsModal, elements.drugInfoModal, elements.reminderAlertModal,
         elements.refillModal, elements.pillboxModal, elements.emergencyIdModal, elements.symptomModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });

        // Keyboard dismiss for modals (Esc)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const visibleModals = [elements.infoModal, elements.settingsModal, elements.drugInfoModal,
                    elements.reminderAlertModal, elements.refillModal, elements.pillboxModal,
                    elements.emergencyIdModal, elements.symptomModal].filter(m => m && !m.classList.contains('hidden'));
                if (visibleModals.length > 0) {
                    closeModal(visibleModals[visibleModals.length - 1]);
                }
            }
        });

        // Delegated event: Schedule table actions
        elements.scheduleTableBody?.addEventListener('click', (e) => {
            const markTakenBtn = e.target.closest('.mark-taken-btn');
            if (markTakenBtn) {
                markAsTaken(markTakenBtn.dataset.id, markTakenBtn.dataset.time);
                return;
            }
            const unmarkTakenBtn = e.target.closest('.unmark-taken-btn');
            if (unmarkTakenBtn) {
                unmarkTaken(unmarkTakenBtn.dataset.id, unmarkTakenBtn.dataset.time);
                return;
            }
            const editBtn = e.target.closest('.edit-medicine-btn');
            if (editBtn) {
                editMedicine(editBtn.dataset.id);
                return;
            }
            const deleteBtn = e.target.closest('.delete-medicine-btn');
            if (deleteBtn) {
                deleteMedicine(deleteBtn.dataset.id);
                return;
            }
            const drugBtn = e.target.closest('.drug-detail-btn');
            if (drugBtn) {
                showDrugDetailsModal(drugBtn.dataset.id);
                return;
            }
        });

        // Delegated event: Remove time input buttons
        elements.timeInputs?.addEventListener('click', (e) => {
            const btn = e.target.closest('.remove-time-btn');
            if (btn) {
                removeTimeInput(btn);
            }
        });

        // Delegated event: Notification toast close
        elements.notificationContainer?.addEventListener('click', (e) => {
            const btn = e.target.closest('.toast-close-btn');
            if (btn) {
                btn.closest('.notification-toast')?.remove();
            }
        });

        // More actions dropdown
        const moreActionsChip = document.getElementById('more-actions-chip');
        const moreActionsDropdown = document.getElementById('more-actions-dropdown');
        if (moreActionsChip && moreActionsDropdown) {
            moreActionsChip.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = !moreActionsDropdown.classList.contains('hidden');
                moreActionsDropdown.classList.toggle('hidden');
                moreActionsChip.setAttribute('aria-expanded', !isOpen);
            });
            document.addEventListener('click', (e) => {
                if (!moreActionsDropdown.contains(e.target) && e.target !== moreActionsChip) {
                    moreActionsDropdown.classList.add('hidden');
                    moreActionsChip.setAttribute('aria-expanded', 'false');
                }
            });
            moreActionsDropdown.addEventListener('click', (e) => {
                const btn = e.target.closest('.more-action-btn');
                if (!btn) return;
                const action = btn.dataset.action;
                if (action === 'print-pillbox') openPillboxModal();
                else if (action === 'export-ical') generateICalendar();
                else if (action === 'export-csv') exportCSV();
                else if (action === 'export-data') exportData();
                else if (action === 'import-data') elements.importFileInput.click();
                else if (action === 'reset-schedule') resetSchedule();
                moreActionsDropdown.classList.add('hidden');
                moreActionsChip.setAttribute('aria-expanded', 'false');
            });
        }

        // Autocomplete
        elements.medicineNameInput.addEventListener('input', debounce(fetchAutocompleteSuggestions, 300));
        elements.autocompleteSuggestions.addEventListener('click', handleAutocompleteClick);

        elements.enableNotificationsCheckbox.addEventListener('change', (e) => {
            settings.enableNotifications = e.target.checked;
            if (e.target.checked) requestNotificationPermission();
        });
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.remove('hidden');
        // Force reflow for animation
        void modal.offsetWidth;
        modal.classList.add('active');
        // Focus the first focusable element
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 250);
    }

    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-blue-600';
        const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';

        toast.className = `notification-toast ${bgClass}`;
        toast.innerHTML = `
            <i class="fas ${iconClass} text-lg mr-2.5"></i>
            <span class="text-xs font-semibold">${message}</span>
            <button class="ml-4 text-white/70 hover:text-white text-sm toast-close-btn" aria-label="Dismiss notification">
                <i class="fas fa-xmark"></i>
            </button>
        `;

        elements.notificationContainer.appendChild(toast);
        toast.querySelector('.toast-close-btn').addEventListener('click', () => toast.remove());
        setTimeout(() => toast.remove(), 4500);
    }

    // Emergency Medical ID Card Renderer
function openEmergencyModal() {
        const pInfo = getPatientInfo();
        elements.emIdName.textContent = pInfo.name || 'Not specified';
        elements.emIdBlood.textContent = pInfo.bloodType || 'O+';
        elements.emIdPhone.textContent = pInfo.contact || pInfo.doctorContact || 'N/A';
        elements.emIdAllergies.textContent = pInfo.allergies || 'None reported';

        elements.emIdMedsList.innerHTML = '';
        if (medicines.length === 0) {
            elements.emIdMedsList.innerHTML = '<li>No active medications</li>';
        } else {
            medicines.forEach(m => {
                const li = document.createElement('li');
                li.textContent = `${m.name} (${m.dosage || '1 dose'}) — ${m.times.map(format12HourTime).join(', ')}`;
                elements.emIdMedsList.appendChild(li);
            });
        }

        elements.emergencyIdModal.classList.remove('hidden');
        void elements.emergencyIdModal.offsetWidth;
        elements.emergencyIdModal.classList.add('active');
    }

    // Health Vitals Log Processor
    function handleVitalsSubmit(e) {
        e.preventDefault();
        vitalsData = {
            bp: elements.vitalBp.value.trim() || '120/80',
            glucose: elements.vitalGlucose.value ? `${elements.vitalGlucose.value} mg/dL` : '--',
            pulse: elements.vitalPulse.value ? `${elements.vitalPulse.value} BPM` : '--',
            weight: elements.vitalWeight.value.trim() || '--',
            timestamp: new Date().toISOString()
        };
        saveData();
        renderVitals();
        showNotification('Current health vitals recorded!', 'success');
    }

    function renderVitals() {
        if (!vitalsData) {
            elements.vitalsLastUpdated.textContent = 'Not logged today';
            return;
        }
        elements.vitalBp.value = vitalsData.bp || '';
        elements.vitalGlucose.value = (vitalsData.glucose || '').replace(' mg/dL', '');
        elements.vitalPulse.value = (vitalsData.pulse || '').replace(' BPM', '');
        elements.vitalWeight.value = vitalsData.weight || '';
        elements.vitalsLastUpdated.textContent = `Logged ${new Date(vitalsData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Symptom Logger Processor
    function openSymptomModal() {
        elements.symptomMedSelect.innerHTML = '';
        if (medicines.length === 0) {
            elements.symptomMedSelect.innerHTML = '<option value="General">General / Unspecified</option>';
        } else {
            medicines.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.name;
                opt.textContent = m.name;
                elements.symptomMedSelect.appendChild(opt);
            });
        }
        elements.symptomModal.classList.remove('hidden');
        void elements.symptomModal.offsetWidth;
        elements.symptomModal.classList.add('active');
    }

    function handleSymptomSubmit(e) {
        e.preventDefault();
        const newSymptom = {
            id: crypto.randomUUID(),
            medicineName: elements.symptomMedSelect.value,
            severity: elements.symptomSeverity.value,
            notes: elements.symptomNotes.value.trim(),
            timestamp: new Date().toISOString()
        };
        symptomsLog.unshift(newSymptom);
        saveData();
        renderSymptomsLog();
        elements.symptomForm.reset();
        elements.symptomModal.classList.remove('active');
        setTimeout(() => {
            elements.symptomModal.classList.add('hidden');
        }, 250);
        showNotification('Symptom logged to profile!', 'success');
    }

    function renderSymptomsLog() {
        elements.symptomsListContainer.innerHTML = '';
        if (symptomsLog.length === 0) {
            elements.symptomsListContainer.innerHTML = '<p class="text-slate-400 text-center py-3">No side effects logged</p>';
            return;
        }

        symptomsLog.slice(0, 5).forEach(s => {
            const div = document.createElement('div');
            const sevColor = s.severity === 'Severe' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' : 
                             s.severity === 'Moderate' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' : 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50';

            div.className = 'p-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg flex justify-between items-start';
            div.innerHTML = `
                <div>
                    <div class="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <span>${s.medicineName}</span>
                        <span class="text-[10px] px-1.5 py-0.5 rounded font-extrabold ${sevColor}">${s.severity}</span>
                    </div>
                    <p class="text-[11px] text-slate-500">${s.notes}</p>
                </div>
                <span class="text-[10px] text-slate-400 whitespace-nowrap ml-2">${new Date(s.timestamp).toLocaleDateString()}</span>
            `;
            elements.symptomsListContainer.appendChild(div);
        });
    }

    // Time Input Generator
    function createTimeInput(value = '') {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-2';
        div.innerHTML = `
            <input type="time" class="form-input flex-1" name="medicine-time" value="${value}" required>
            <button type="button" class="text-slate-400 hover:text-red-500 px-2 text-lg remove-time-btn" aria-label="Remove time slot">&times;</button>
        `;
        return div;
    }

    function addTimeInput(value = '') {
        elements.timeInputs.appendChild(createTimeInput(value));
    }

    function removeTimeInput(button) {
        if (elements.timeInputs.children.length > 1) {
            button.parentElement.remove();
        } else {
            showNotification('At least one time slot is required', 'error');
        }
    }

    // Autocomplete
    async function fetchAutocompleteSuggestions() {
        const query = elements.medicineNameInput.value.trim();
        if (query.length < 3) {
            elements.autocompleteSuggestions.classList.add('hidden');
            return;
        }

        elements.autocompleteSuggestions.innerHTML = '<div class="px-3 py-2 text-xs text-slate-400 flex items-center gap-2"><span class="rxnav-spinner"></span>Searching...</div>';
        elements.autocompleteSuggestions.classList.remove('hidden');

        try {
            const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(query)}`);
            const data = await response.json();
            const suggestions = data.drugGroup?.drugList?.drug?.map(d => d.name) || [];
            renderAutocomplete(suggestions.slice(0, 6));
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
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

    // Medicine Submission
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
            renderTimeline();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            checkDrugInteractions();
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
        document.querySelectorAll('.field-icon').forEach(el => el.remove());
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        document.querySelectorAll('.field-success').forEach(el => el.classList.remove('field-success'));
        document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

        const medicineName = elements.medicineNameInput.value.trim();
        if (!medicineName) {
            showFieldError(elements.medicineNameInput, 'Medicine name is required');
            isValid = false;
        } else {
            showFieldSuccess(elements.medicineNameInput);
        }

        const timeInputs = document.querySelectorAll('input[name="medicine-time"]');
        const validTimes = Array.from(timeInputs).map(input => input.value).filter(Boolean);
        if (validTimes.length === 0) {
            showFieldError(timeInputs[0], 'At least one scheduled time is required');
            isValid = false;
        } else {
            timeInputs.forEach(input => {
                if (input.value) showFieldSuccess(input);
            });
        }

        return isValid;
    }

    function showFieldError(input, message) {
        input.classList.add('invalid');
        input.classList.remove('field-success');
        input.classList.add('field-error');
        const error = document.createElement('p');
        error.className = 'error-message';
        error.textContent = message;
        input.parentElement.appendChild(error);
        const icon = document.createElement('span');
        icon.className = 'field-icon error';
        icon.innerHTML = '<i class="fas fa-circle-exclamation"></i>';
        input.parentElement.appendChild(icon);
    }

    function showFieldSuccess(input) {
        input.classList.remove('invalid', 'field-error');
        input.classList.add('field-success');
        const existingIcon = input.parentElement.querySelector('.field-icon');
        if (existingIcon) existingIcon.remove();
        const icon = document.createElement('span');
        icon.className = 'field-icon success';
        icon.innerHTML = '<i class="fas fa-circle-check"></i>';
        input.parentElement.appendChild(icon);
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
            dietaryCaution: elements.medicineDietaryCaution.value,
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
            row.className = 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors text-xs sm:text-sm cursor-pointer schedule-row';
            row.setAttribute('data-id', item.id);
            row.setAttribute('role', 'row');
            row.setAttribute('tabindex', '0');

            row.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                row.classList.toggle('schedule-row-selected');
            });
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    row.classList.toggle('schedule-row-selected');
                }
            });

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

            let dietaryTag = '';
            if (item.dietaryCaution) {
                dietaryTag = `<span class="text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded mt-0.5 inline-block">${item.dietaryCaution}</span>`;
            }

            row.innerHTML = `
                <td class="px-3 py-2 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    <div class="flex items-center gap-1.5">
                        <i class="fas fa-regular fa-clock text-blue-500 text-xs"></i>
                        <span>${format12HourTime(item.time)}</span>
                    </div>
                </td>
                <td class="px-3 py-2">
                    <div class="flex items-center space-x-2.5">
                        <div class="w-7 h-7 rounded-lg ${colorMeta.bg} ${colorMeta.text} flex items-center justify-center text-xs flex-shrink-0">
                            <i class="fas ${formIcon}"></i>
                        </div>
                        <div>
                            <button class="font-bold text-slate-900 dark:text-white hover:text-blue-600 text-left transition-colors cursor-pointer drug-detail-btn" data-id="${item.id}">
                                ${item.name}
                            </button>
                            <div class="text-[11px] text-slate-500 flex items-center gap-1">
                                <span>${item.formType || 'Medicine'}</span>
                                ${item.info?.genericName ? `• <span class="truncate max-w-[120px]">${item.info.genericName}</span>` : ''}
                            </div>
                            ${dietaryTag}
                        </div>
                    </div>
                </td>
                <td class="px-3 py-2 text-slate-600 dark:text-slate-400">
                    <span class="font-medium">${item.dosage || '1 dose'}</span>
                    ${item.instructions ? `<div class="text-[11px] text-slate-400 truncate max-w-[150px]">${item.instructions}</div>` : ''}
                </td>
                <td class="px-3 py-2">
                    ${stockDisplay}
                </td>
                <td class="px-3 py-2">
                    ${statusBadge}
                </td>
                <td class="px-3 py-2 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end space-x-1.5">
                        ${status !== 'taken' ? `
                            <button class="btn-success text-xs py-1 px-2.5 mark-taken-btn" data-id="${item.id}" data-time="${item.time}" title="Mark dose taken">
                                <i class="fas fa-check"></i> <span class="hidden sm:inline">Taken</span>
                            </button>
                        ` : `
                            <button class="btn-secondary text-xs py-1 px-2 text-slate-400 unmark-taken-btn" data-id="${item.id}" data-time="${item.time}" title="Undo taken status">
                                <i class="fas fa-undo"></i>
                            </button>
                        `}
                        <button class="btn-secondary text-xs py-1 px-2 text-blue-600 edit-medicine-btn" data-id="${item.id}" title="Edit medicine">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn-secondary text-xs py-1 px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 delete-medicine-btn" data-id="${item.id}" title="Delete medicine">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            elements.scheduleTableBody.appendChild(row);
        });
    }

    function renderTimeline() {
        if (!elements.timelineContainer) return;
        elements.timelineContainer.innerHTML = '';

        const scheduleItems = [];
        medicines.forEach(medicine => {
            medicine.times.forEach(time => {
                scheduleItems.push({ ...medicine, time });
            });
        });

        if (scheduleItems.length === 0) return;

        scheduleItems.forEach(item => {
            const [h, min] = item.time.split(':').map(Number);
            const totalMinutes = h * 60 + min;
            const percentage = (totalMinutes / 1440) * 100;

            const colorMeta = colorClasses[item.color] || colorClasses.blue;
            const marker = document.createElement('div');
            marker.className = 'timeline-marker group';
            marker.style.left = `${percentage}%`;
            marker.style.backgroundColor = colorMeta.dot;

            marker.innerHTML = `
                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none z-30">
                    <span class="font-bold">${format12HourTime(item.time)}</span> — ${item.name} (${item.dosage || '1 dose'})
                </div>
            `;
            elements.timelineContainer.appendChild(marker);
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

        const strokeDashoffset = 100 - adherencePercent;
        elements.adherenceRing.style.strokeDashoffset = strokeDashoffset;

        const streakDays = calculateAdherenceStreak();
        if (elements.streakBadge) {
            elements.streakBadge.textContent = `🔥 ${streakDays}d Streak`;
        }

        const nextInfo = getNextDoseInfo();
        if (nextInfo) {
            elements.nextDose.textContent = format12HourTime(nextInfo.time);
            elements.nextDoseMedName.textContent = `${nextInfo.medicine.name} (${nextInfo.dayLabel})`;
        } else {
            elements.nextDose.textContent = '--:--';
            elements.nextDoseMedName.textContent = 'No pending doses';
        }
    }

    function calculateAdherenceStreak() {
        if (medicines.length === 0) return 0;
        let streak = 0;
        let d = new Date();

        for (let i = 0; i < 30; i++) {
            const dateStr = getLocalDateString(d);
            const totalScheduled = medicines.reduce((sum, m) => sum + m.times.length, 0);
            if (totalScheduled === 0) break;

            let takenCount = 0;
            medicines.forEach(m => {
                (m.taken || []).forEach(t => {
                    if (t.date === dateStr) takenCount++;
                });
            });

            if (takenCount >= totalScheduled) {
                streak++;
            } else if (i > 0) {
                break;
            }
            d.setDate(d.getDate() - 1);
        }
        return streak;
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

    function renderWeeklyAdherenceChart() {
        if (!elements.weeklyAdherenceChart) return;
        elements.weeklyAdherenceChart.innerHTML = '';

        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d);
        }

        const adherenceData = days.map(dayDate => {
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

            return { dayName, percent, totalTaken, totalScheduled, isToday, dateStr };
        });

        const todayData = adherenceData[adherenceData.length - 1];
        const yesterdayData = adherenceData.length >= 2 ? adherenceData[adherenceData.length - 2] : null;
        const trendDelta = todayData && yesterdayData && todayData.totalScheduled > 0 && yesterdayData.totalScheduled > 0
            ? todayData.percent - yesterdayData.percent
            : null;

        adherenceData.forEach(day => {
            const col = document.createElement('div');
            col.className = 'flex flex-col items-center gap-1 text-center';

            const segments = [];
            const segmentCount = 4;
            for (let s = 0; s < segmentCount; s++) {
                const segPercent = day.totalScheduled > 0 ? Math.min(100, Math.round(((day.totalTaken / day.totalScheduled) * 100) / segmentCount * (s + 1))) : 0;
                const prevPercent = s > 0 ? Math.min(100, Math.round(((day.totalTaken / day.totalScheduled) * 100) / segmentCount * s)) : 0;
                const segHeight = Math.max(0, segPercent - prevPercent);
                const segColor = day.isToday ? 'bg-indigo-500' : 'bg-blue-400 dark:bg-blue-600';
                segments.push(`<div class="w-full ${segColor} rounded-sm transition-all duration-300" style="height:${segHeight}%"></div>`);
            }

            col.innerHTML = `
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-24 flex flex-col-reverse items-center p-1 relative group">
                    ${segments.join('')}
                    <div class="absolute -top-7 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${day.percent}% (${day.totalTaken}/${day.totalScheduled})
                    </div>
                </div>
                <span class="text-[11px] font-semibold ${day.isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}">${day.dayName}</span>
            `;
            elements.weeklyAdherenceChart.appendChild(col);
        });

        if (todayData && todayData.totalScheduled > 0 && trendDelta !== null) {
            const trendIcon = trendDelta > 0 ? '▲' : trendDelta < 0 ? '▼' : '—';
            const trendColor = trendDelta > 0 ? 'text-emerald-600 dark:text-emerald-400' : trendDelta < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400';
            const trendLabel = trendDelta > 0 ? 'up from yesterday' : trendDelta < 0 ? 'down from yesterday' : 'same as yesterday';
            const trendEl = document.createElement('div');
            trendEl.className = `flex items-center gap-1 text-[11px] font-semibold ${trendColor} mt-1`;
            trendEl.innerHTML = `<span>${trendIcon} ${todayData.percent}% vs yesterday (${trendLabel})</span>`;
            elements.weeklyAdherenceChart.parentElement.appendChild(trendEl);
        }
    }

    async function checkDrugInteractions() {
        if (!settings.enableInteractionCheck || medicines.length < 2) {
            elements.interactionAlertBanner.classList.add('hidden');
            return;
        }

        const rxcuis = medicines.map(m => m.info?.rxcui).filter(Boolean);
        if (rxcuis.length < 2) {
            elements.interactionAlertBanner.classList.add('hidden');
            return;
        }

        try {
            const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuis.join('+')}`;
            const response = await fetch(url);
            const data = await response.json();

            const interactionPairs = [];
            const fullPairs = data.fullInteractionTypeGroup?.[0]?.fullInteractionType || [];
            
            fullPairs.forEach(group => {
                group.interactionPair?.forEach(pair => {
                    const desc = pair.description || 'Potential interaction reported between medications.';
                    const drugA = pair.interactionConcept?.[0]?.minConceptItem?.name || 'Drug A';
                    const drugB = pair.interactionConcept?.[1]?.minConceptItem?.name || 'Drug B';
                    interactionPairs.push(`• <strong>${drugA}</strong> ↔ <strong>${drugB}</strong>: ${desc}`);
                });
            });

            if (interactionPairs.length > 0) {
                elements.interactionAlertSummary.textContent = `${interactionPairs.length} potential interaction(s) detected between your active medications.`;
                elements.interactionDetailsList.innerHTML = interactionPairs.slice(0, 3).join('<br>');
                elements.interactionAlertBanner.classList.remove('hidden');
            } else {
                elements.interactionAlertBanner.classList.add('hidden');
            }
        } catch (err) {
            console.error('RxNav interaction check error:', err);
            elements.interactionAlertBanner.classList.add('hidden');
        }
    }

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

    function openRefillModal() {
        const patientName = elements.patientNameInput.value.trim() || 'Patient';
        const docName = elements.doctorNameInput.value.trim() || 'Healthcare Provider';
        const lowMeds = medicines.filter(m => m.stock !== null && m.stock !== undefined && m.stock <= (m.refillAlert || 5));
        const medList = lowMeds.length > 0 ? lowMeds : medicines;

        let message = `REFILL REQUEST NOTICE\n`;
        message += `Date: ${new Date().toLocaleDateString()}\n`;
        message += `Patient Name: ${patientName}\n`;
        message += `Doctor: ${docName}\n\n`;
        message += `Dear Pharmacy / Clinic,\n\n`;
        message += `I would like to request a prescription refill for the following medications:\n`;

        medList.forEach((m, idx) => {
            message += `${idx + 1}. ${m.name} (${m.dosage || 'Standard Dosage'}) — Current Stock: ${m.stock !== null ? m.stock : 'Low'}\n`;
        });

        message += `\nThank you,\n${patientName}`;
        elements.refillTextArea.value = message;
        elements.refillModal.classList.remove('hidden');
        void elements.refillModal.offsetWidth;
        elements.refillModal.classList.add('active');
    }

    function copyRefillText() {
        elements.refillTextArea.select();
        navigator.clipboard.writeText(elements.refillTextArea.value);
        showNotification('Refill request copied to clipboard!', 'success');
    }

    function openPillboxModal() {
        const tbody = elements.pillboxTableBody;
        if (!tbody) return;
        tbody.innerHTML = '';

        const timeSlots = ['Morning (6am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-9pm)', 'Night (9pm-6am)'];

        timeSlots.forEach(slot => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
            
            let slotPeriod = 'morning';
            if (slot.includes('Afternoon')) slotPeriod = 'afternoon';
            if (slot.includes('Evening')) slotPeriod = 'evening';
            if (slot.includes('Night')) slotPeriod = 'night';

            const slotMeds = medicines.filter(m => isTimeInPeriod(m.times[0] || '08:00', slotPeriod));
            const medCellContent = slotMeds.length > 0 ? 
                slotMeds.map(m => `<div><strong>${m.name}</strong> (${m.dosage || '1 dose'})</div>`).join('') : '<span class="text-slate-300">-</span>';

            row.innerHTML = `
                <td class="p-2 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap bg-slate-50 dark:bg-slate-900">${slot}</td>
                <td class="p-2">${medCellContent}</td>
                <td class="p-2">${medCellContent}</td>
                <td class="p-2">${medCellContent}</td>
                <td class="p-2">${medCellContent}</td>
                <td class="p-2">${medCellContent}</td>
                <td class="p-2">${medCellContent}</td>
                <td class="p-2">${medCellContent}</td>
            `;
            tbody.appendChild(row);
        });

        elements.pillboxModal.classList.remove('hidden');
        void elements.pillboxModal.offsetWidth;
        elements.pillboxModal.classList.add('active');
    }

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
            div.className = 'flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs';
            
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

    function editMedicine(id) {
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
            elements.medicineDietaryCaution.value = medicine.dietaryCaution || '';
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
    }

    function deleteMedicine(id) {
        if (confirm('Are you sure you want to remove this medication from your schedule?')) {
            const medicine = medicines.find(m => m.id === id);
            medicines = medicines.filter(m => m.id !== id);
            addToHistory('deleted', medicine);
            saveData();
            renderSchedule();
            renderTimeline();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            checkDrugInteractions();
            showNotification('Medicine deleted successfully', 'success');
        }
    }

function markAsTaken(id, time) {
        const medicine = medicines.find(m => m.id === id);
        if (medicine) {
            const todayStr = getLocalDateString();
            if (!medicine.taken) medicine.taken = [];

            medicine.taken = medicine.taken.filter(t => !(t.date === todayStr && t.time === time));

            medicine.taken.push({
                date: todayStr,
                time: time,
                timestamp: new Date().toISOString()
            });

            if (medicine.stock !== null && medicine.stock !== undefined && medicine.stock > 0) {
                medicine.stock -= 1;
            }

            addToHistory('taken', medicine);
            saveData();
            renderSchedule();
            renderTimeline();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            showNotification(`Marked ${medicine.name} as taken!`, 'success');
        }
    }

    function unmarkTaken(id, time) {
        const medicine = medicines.find(m => m.id === id);
        if (medicine && medicine.taken) {
            const todayStr = getLocalDateString();
            medicine.taken = medicine.taken.filter(t => !(t.date === todayStr && t.time === time));

            if (medicine.stock !== null && medicine.stock !== undefined) {
                medicine.stock += 1;
            }

            saveData();
            renderSchedule();
            renderTimeline();
            updateDashboard();
            renderWeeklyAdherenceChart();
            checkLowStockAlerts();
            showNotification(`Unmarked dose for ${medicine.name}`, 'info');
        }
    }

    function showDrugDetailsModal(id) {
        const medicine = medicines.find(m => m.id === id);
        if (medicine) {
            elements.drugModalName.textContent = medicine.name;
            elements.drugModalGeneric.textContent = medicine.info?.genericName || medicine.name;
            elements.drugModalCategory.textContent = medicine.info?.category || 'General Therapeutic';
            elements.drugModalUsage.textContent = medicine.info?.usage || 'Take as directed';
            elements.drugInfoModal.classList.remove('hidden');
            void elements.drugInfoModal.offsetWidth;
            elements.drugInfoModal.classList.add('active');
        }
    }

    function saveSettings() {
        settings.enableNotifications = elements.enableNotificationsCheckbox.checked;
        settings.enableAudio = elements.enableAudioCheckbox.checked;
        settings.enableInteractionCheck = elements.enableInteractionCheckCheckbox.checked;
        settings.autoSave = elements.autoSaveCheckbox.checked;
        settings.defaultReminder = parseInt(elements.defaultReminderSelect.value, 10);

        saveData();
        updateSoundIconState();
        checkDrugInteractions();
        elements.settingsModal.classList.remove('active');
        setTimeout(() => {
            elements.settingsModal.classList.add('hidden');
        }, 250);
        showNotification('Preferences updated', 'success');
    }

    function toggleAudio() {
        settings.enableAudio = !settings.enableAudio;
        elements.enableAudioCheckbox.checked = settings.enableAudio;
        saveData();
        updateSoundIconState();
        showNotification(settings.enableAudio ? 'Audio reminders enabled' : 'Audio reminders muted', 'info');
    }

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
        const isDark = saved !== 'light';
        if (isDark) document.documentElement.classList.add('dark');
        updateThemeIcon(isDark);
    })();

    // Import / Export Systems
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
                    elements.patientBloodType.value = json.patientInfo.bloodType || 'O+';
                    elements.pharmacyPhoneInput.value = json.patientInfo.pharmacyPhone || '';
                    elements.patientAllergiesInput.value = json.patientInfo.allergies || '';
                    elements.doctorNameInput.value = json.patientInfo.doctorName || '';
                    elements.doctorContactInput.value = json.patientInfo.doctorContact || '';
                }
                saveData();
                renderSchedule();
                renderTimeline();
                updateDashboard();
                renderWeeklyAdherenceChart();
                renderVitals();
                renderSymptomsLog();
                checkLowStockAlerts();
                checkDrugInteractions();
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
            profile: currentProfile,
            medicines,
            patientInfo: getPatientInfo(),
            vitals: vitalsData,
            symptoms: symptomsLog,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medicine-tracker-backup-${currentProfile}-${getLocalDateString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Data exported as JSON', 'success');
    }

    function exportCSV() {
        if (medicationHistory.length === 0) {
            showNotification('No history to export', 'error');
            return;
        }

        let csv = 'Timestamp,Medicine,Action,Details\n';
        medicationHistory.forEach(h => {
            csv += `"${h.timestamp}","${h.medicineName}","${h.action}","${h.details}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medication-history-${getLocalDateString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('History exported as CSV', 'success');
    }

    function generateICalendar() {
        if (medicines.length === 0) {
            showNotification('No medicines to export', 'error');
            return;
        }

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Medicine Tracker Ultimate//NONSGML v3.5//EN',
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

    function resetSchedule() {
        if (confirm('Are you sure you want to clear all medicines and settings for this profile? This action cannot be undone.')) {
            medicines = [];
            medicationHistory = [];
            symptomsLog = [];
            vitalsData = null;
            localStorage.removeItem(getStorageKey('medicineSchedule'));
            localStorage.removeItem(getStorageKey('medicationHistory'));
            localStorage.removeItem(getStorageKey('patientInfo'));
            localStorage.removeItem(getStorageKey('symptomsLog'));
            localStorage.removeItem(getStorageKey('vitalsData'));
            renderSchedule();
            renderTimeline();
            updateDashboard();
            renderMedicationHistory();
            renderWeeklyAdherenceChart();
            renderVitals();
            renderSymptomsLog();
            checkLowStockAlerts();
            checkDrugInteractions();
            showNotification('Profile data cleared', 'info');
        }
    }

    // Reminders Engine
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

        if (settings.enableNotifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`Medicine Time: ${medicine.name}`, {
                body: `Scheduled for ${format12HourTime(time)}. Dosage: ${medicine.dosage || '1 dose'}.`,
                icon: 'favicon.svg'
            });
        }

        activeReminderTarget = { id: medicine.id, time };
        elements.reminderModalText.textContent = `It is time to take ${medicine.name} (${medicine.dosage || '1 dose'}) scheduled for ${format12HourTime(time)}.`;
        elements.reminderAlertModal.classList.remove('hidden');
        void elements.reminderAlertModal.offsetWidth;
        elements.reminderAlertModal.classList.add('active');
    }

    function startReminderCheck() {
        setInterval(checkForUpcomingDoses, 30000);
    }

    // PDF Generator
    function generatePDF() {
        if (typeof window.jspdf === 'undefined') {
            showNotification('PDF library loading error', 'error');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

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

        const pInfo = getPatientInfo();
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Patient & Physician Information', 15, yOffset);
        yOffset += 6;

        const infoTable = [
            ['Patient Name', pInfo.name || 'N/A', 'Doctor Name', pInfo.doctorName || 'N/A'],
            ['Date of Birth', pInfo.dob || 'N/A', 'Doctor Contact', pInfo.doctorContact || 'N/A'],
            ['Blood Type', pInfo.bloodType || 'N/A', 'Pharmacy Contact', pInfo.pharmacyPhone || 'N/A'],
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

    init();
});