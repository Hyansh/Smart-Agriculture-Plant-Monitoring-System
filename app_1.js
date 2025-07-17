// Application data
const appData = {
    dashboard: {
        soil_moisture: 65,
        temperature: 24,
        humidity: 72,
        ph_level: 6.8,
        weather: "Partly Cloudy",
        field_status: "Healthy"
    },
    sensors: {
        soil_readings: [62, 65, 68, 64, 67, 65, 63, 66, 64, 68],
        temperature_readings: [22, 24, 26, 23, 25, 24, 22, 25, 23, 26],
        humidity_readings: [68, 72, 75, 70, 73, 72, 69, 74, 71, 75],
        npk_levels: {
            nitrogen: 45,
            phosphorus: 38,
            potassium: 52
        }
    },
    control: {
        current_mode: "auto",
        irrigation_zones: [
            { name: "Zone 1", status: "active" },
            { name: "Zone 2", status: "stopped" },
            { name: "Zone 3", status: "stopped" },
            { name: "Zone 4", status: "stopped" }
        ],
        schedule: {
            morning: "06:00",
            evening: "18:00"
        }
    },
    analytics: {
        crop_health: 85,
        water_efficiency: 78,
        yield_prediction: 92
    }
};

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.screen');

    console.log('Initializing navigation...', navItems.length, 'nav items found');

    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const screenId = item.getAttribute('data-screen');
            console.log('Navigation clicked:', screenId);
            
            if (!screenId) return;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding screen
            screens.forEach(screen => {
                screen.classList.remove('active');
                screen.style.display = 'none';
            });
            
            const targetScreen = document.getElementById(screenId);
            if (targetScreen) {
                targetScreen.classList.add('active');
                targetScreen.style.display = 'block';
                console.log('Screen activated:', screenId);
                
                // Initialize screen-specific functionality
                if (screenId === 'sensors') {
                    setTimeout(() => initializeSensorChart(), 100);
                }
            }
        });
    });
}

// Sensor data chart
let sensorChart;

function initializeSensorChart() {
    const ctx = document.getElementById('sensorChart');
    if (!ctx) {
        console.log('Sensor chart canvas not found');
        return;
    }

    console.log('Initializing sensor chart...');

    // Destroy existing chart if it exists
    if (sensorChart) {
        sensorChart.destroy();
    }

    const labels = ['10min', '8min', '6min', '4min', '2min', 'Now'];
    
    sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Soil Moisture (%)',
                    data: appData.sensors.soil_readings.slice(-6),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Temperature (°C)',
                    data: appData.sensors.temperature_readings.slice(-6),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Humidity (%)',
                    data: appData.sensors.humidity_readings.slice(-6),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Control panel functionality
function initializeControlPanel() {
    // Mode toggle
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const mode = btn.getAttribute('data-mode');
            appData.control.current_mode = mode;
            
            // Update UI based on mode
            updateModeUI(mode);
        });
    });

    // Zone controls
    const zoneButtons = document.querySelectorAll('.zone-btn');
    zoneButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const zoneCard = btn.closest('.zone-card');
            const zoneTitle = zoneCard.querySelector('h4').textContent;
            const zoneStatus = zoneCard.querySelector('.zone-status');
            const isOnButton = btn.textContent.trim() === 'ON';
            
            // Update zone status
            if (isOnButton) {
                zoneStatus.textContent = 'Running';
                zoneStatus.classList.add('active');
            } else {
                zoneStatus.textContent = 'Stopped';
                zoneStatus.classList.remove('active');
            }
            
            // Update button states
            const zoneButtons = zoneCard.querySelectorAll('.zone-btn');
            zoneButtons.forEach(zb => zb.classList.remove('on'));
            btn.classList.add('on');
            
            showNotification(`${zoneTitle} ${isOnButton ? 'started' : 'stopped'}`);
        });
    });

    // Schedule updates
    const scheduleBtn = document.querySelector('.control-section .btn--primary');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const morningTime = document.getElementById('morningTime').value;
            const eveningTime = document.getElementById('eveningTime').value;
            
            appData.control.schedule.morning = morningTime;
            appData.control.schedule.evening = eveningTime;
            
            showNotification('Irrigation schedule updated successfully');
        });
    }

    // Emergency stop
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Stop all zones
            const allZoneCards = document.querySelectorAll('.zone-card');
            allZoneCards.forEach(card => {
                const status = card.querySelector('.zone-status');
                const offButton = card.querySelector('.zone-btn:last-child');
                
                status.textContent = 'Stopped';
                status.classList.remove('active');
                
                const zoneButtons = card.querySelectorAll('.zone-btn');
                zoneButtons.forEach(btn => btn.classList.remove('on'));
                offButton.classList.add('on');
            });
            
            showNotification('Emergency stop activated - All zones stopped', 'error');
        });
    }
}

function updateModeUI(mode) {
    const zoneControls = document.querySelectorAll('.zone-controls');
    
    if (mode === 'auto') {
        zoneControls.forEach(control => {
            control.style.opacity = '0.5';
            control.style.pointerEvents = 'none';
        });
        showNotification('Switched to automatic mode');
    } else {
        zoneControls.forEach(control => {
            control.style.opacity = '1';
            control.style.pointerEvents = 'auto';
        });
        showNotification('Switched to manual mode');
    }
}

// Settings functionality
function initializeSettings() {
    // Threshold sliders
    const sliders = document.querySelectorAll('.threshold-slider');
    sliders.forEach(slider => {
        const valueDisplay = slider.parentElement.querySelector('.threshold-value');
        
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            const unit = slider.max <= 8 ? (slider.step === '0.1' ? '' : '°C') : '%';
            valueDisplay.textContent = value + unit;
        });
    });

    // Notification checkboxes
    const checkboxes = document.querySelectorAll('.notification-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const label = e.target.parentElement.textContent.trim();
            const status = e.target.checked ? 'enabled' : 'disabled';
            showNotification(`${label} notifications ${status}`);
        });
    });

    // Settings buttons
    const saveBtn = document.querySelector('.settings-actions .btn--primary');
    const resetBtn = document.querySelector('.settings-actions .btn--outline');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Settings saved successfully', 'success');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to reset all settings to default?')) {
                resetSettings();
                showNotification('Settings reset to default values', 'info');
            }
        });
    }
}

function resetSettings() {
    // Reset sliders
    const sliders = document.querySelectorAll('.threshold-slider');
    sliders.forEach(slider => {
        const valueDisplay = slider.parentElement.querySelector('.threshold-value');
        if (slider.min === '0' && slider.max === '100') {
            slider.value = '30';
            valueDisplay.textContent = '30%';
        } else if (slider.min === '20' && slider.max === '40') {
            slider.value = '35';
            valueDisplay.textContent = '35°C';
        } else if (slider.min === '5' && slider.max === '8') {
            slider.value = '6';
            valueDisplay.textContent = '6.0';
        }
    });

    // Reset checkboxes
    const checkboxes = document.querySelectorAll('.notification-item input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = index < 2; // First two checked by default
    });

    // Reset selects
    const selects = document.querySelectorAll('.settings-section select');
    selects.forEach(select => {
        select.selectedIndex = 0;
    });
}

// Dashboard functionality
function initializeDashboard() {
    // Quick irrigation button
    const quickIrrigationBtn = document.getElementById('quickIrrigation');
    if (quickIrrigationBtn) {
        quickIrrigationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            quickIrrigationBtn.textContent = '💧 Irrigating...';
            quickIrrigationBtn.disabled = true;
            
            setTimeout(() => {
                quickIrrigationBtn.textContent = '💧 Start Irrigation';
                quickIrrigationBtn.disabled = false;
                showNotification('Quick irrigation completed');
            }, 3000);
        });
    }

    // View alerts button
    const viewAlertsBtn = document.getElementById('viewAlerts');
    if (viewAlertsBtn) {
        viewAlertsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('No active alerts at this time', 'info');
        });
    }

    // Export data button
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportSensorData();
        });
    }
}

// Data simulation and updates
function startDataSimulation() {
    setInterval(() => {
        // Simulate slight variations in sensor readings
        const soilVariation = (Math.random() - 0.5) * 4;
        const tempVariation = (Math.random() - 0.5) * 2;
        const humidityVariation = (Math.random() - 0.5) * 6;
        
        appData.dashboard.soil_moisture = Math.max(0, Math.min(100, 
            appData.dashboard.soil_moisture + soilVariation));
        appData.dashboard.temperature = Math.max(15, Math.min(40, 
            appData.dashboard.temperature + tempVariation));
        appData.dashboard.humidity = Math.max(40, Math.min(100, 
            appData.dashboard.humidity + humidityVariation));
        
        updateDashboardMetrics();
        
        // Add new readings to sensor arrays
        appData.sensors.soil_readings.push(Math.round(appData.dashboard.soil_moisture));
        appData.sensors.temperature_readings.push(Math.round(appData.dashboard.temperature));
        appData.sensors.humidity_readings.push(Math.round(appData.dashboard.humidity));
        
        // Keep only last 10 readings
        if (appData.sensors.soil_readings.length > 10) {
            appData.sensors.soil_readings.shift();
            appData.sensors.temperature_readings.shift();
            appData.sensors.humidity_readings.shift();
        }
        
        // Update chart if visible
        if (sensorChart && document.getElementById('sensors').classList.contains('active')) {
            updateSensorChart();
        }
        
        updateRecentReadings();
    }, 10000); // Update every 10 seconds
}

function updateDashboardMetrics() {
    const metrics = document.querySelectorAll('.metric-value');
    if (metrics.length >= 4) {
        metrics[0].innerHTML = `${Math.round(appData.dashboard.soil_moisture)}<span class="unit">%</span>`;
        metrics[1].innerHTML = `${Math.round(appData.dashboard.temperature)}<span class="unit">°C</span>`;
        metrics[2].innerHTML = `${Math.round(appData.dashboard.humidity)}<span class="unit">%</span>`;
        metrics[3].innerHTML = `${appData.dashboard.ph_level.toFixed(1)}`;
    }
}

function updateSensorChart() {
    if (!sensorChart) return;
    
    const labels = ['10min', '8min', '6min', '4min', '2min', 'Now'];
    sensorChart.data.labels = labels;
    sensorChart.data.datasets[0].data = appData.sensors.soil_readings.slice(-6);
    sensorChart.data.datasets[1].data = appData.sensors.temperature_readings.slice(-6);
    sensorChart.data.datasets[2].data = appData.sensors.humidity_readings.slice(-6);
    sensorChart.update();
}

function updateRecentReadings() {
    const readingsList = document.querySelector('.readings-list');
    if (!readingsList) return;
    
    const readings = [
        { time: '2 min ago', soil: appData.sensors.soil_readings.slice(-1)[0], temp: appData.sensors.temperature_readings.slice(-1)[0] },
        { time: '5 min ago', soil: appData.sensors.soil_readings.slice(-2)[0], temp: appData.sensors.temperature_readings.slice(-2)[0] },
        { time: '8 min ago', soil: appData.sensors.soil_readings.slice(-3)[0], temp: appData.sensors.temperature_readings.slice(-3)[0] }
    ];
    
    readingsList.innerHTML = readings.map(reading => `
        <div class="reading-item">
            <span class="reading-time">${reading.time}</span>
            <span class="reading-value">Soil: ${reading.soil}% | Temp: ${reading.temp}°C</span>
        </div>
    `).join('');
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--color-surface);
        color: var(--color-text);
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 300px;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set color based on type
    if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.color = 'var(--color-error)';
    } else if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.color = 'var(--color-success)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function exportSensorData() {
    const data = {
        timestamp: new Date().toISOString(),
        soil_readings: appData.sensors.soil_readings,
        temperature_readings: appData.sensors.temperature_readings,
        humidity_readings: appData.sensors.humidity_readings,
        npk_levels: appData.sensors.npk_levels
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Sensor data exported successfully', 'success');
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - initializing app...');
    
    // Initialize all screens to be hidden except dashboard
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Show dashboard by default
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
        dashboard.classList.add('active');
    }
    
    // Initialize functionality
    initializeNavigation();
    initializeDashboard();
    initializeControlPanel();
    initializeSettings();
    startDataSimulation();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Smart Agriculture System connected successfully', 'success');
    }, 1000);
});

// Handle window resize for chart
window.addEventListener('resize', () => {
    if (sensorChart) {
        sensorChart.resize();
    }
});