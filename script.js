// Global değişkenler
let currentStep = 1;
const totalSteps = 7;
let experimentRunning = false;
let experimentData = [];
let startTime = Date.now();
let temperature = 25;
let timeElapsed = 0;
let selectedHypothesis = '';
let experimentInterval;

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Uygulama başlatma
function initializeApp() {
    updateProgressBar();
    updateStepDisplay();
    showStep(1);
}

// Event listener'ları kurma
function setupEventListeners() {
    // Güvenlik checkbox kontrolü
    const safetyCheck = document.getElementById('safetyCheck');
    const safetyNextBtn = document.getElementById('safetyNextBtn');
    
    if (safetyCheck && safetyNextBtn) {
        safetyCheck.addEventListener('change', function() {
            safetyNextBtn.disabled = !this.checked;
        });
    }

    // Hipotez seçimi kontrolü
    const hypothesisInputs = document.querySelectorAll('input[name="hypothesis"]');
    const hypothesisNextBtn = document.getElementById('hypothesisNextBtn');
    
    hypothesisInputs.forEach(input => {
        input.addEventListener('change', function() {
            selectedHypothesis = this.value;
            if (hypothesisNextBtn) {
                hypothesisNextBtn.disabled = false;
            }
        });
    });

    // Klavye navigasyonu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && currentStep > 1) {
            prevStep();
        } else if (e.key === 'ArrowRight' && currentStep < totalSteps) {
            nextStep();
        }
    });
}

// Sonraki adıma geçme
function nextStep() {
    if (currentStep < totalSteps) {
        // Mevcut adımı gizle
        showStep(currentStep + 1);
        currentStep++;
        updateProgressBar();
        updateStepDisplay();

        // 7. adımda hipotez sonucunu göster
        if (currentStep === 7) {
            showHypothesisResult();
        }
    }
}

// Önceki adıma dönme
function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
        currentStep--;
        updateProgressBar();
        updateStepDisplay();
    }
}

// Belirtilen adımı gösterme
function showStep(stepNumber) {
    // Tüm adımları gizle
    const allSteps = document.querySelectorAll('.step-content');
    allSteps.forEach(step => {
        step.classList.remove('active');
    });

    // Belirtilen adımı göster
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
}

// Progress bar güncelleme
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
    }
}

// Adım bilgisi güncelleme
function updateStepDisplay() {
    const stepDisplay = document.getElementById('currentStep');
    if (stepDisplay) {
        stepDisplay.textContent = currentStep;
    }
}

// Deneyi başlatma
function startExperiment() {
    if (experimentRunning) return;

    experimentRunning = true;
    startTime = Date.now();
    timeElapsed = 0;
    temperature = 25;
    experimentData = [];

    // UI elementlerini al
    const startBtn = document.getElementById('startExperiment');
    const naphthalene = document.getElementById('naphthalene');
    const vapor = document.getElementById('vapor');
    const heater = document.getElementById('heater');
    const coldGlass = document.getElementById('coldGlass');
    const frost = document.getElementById('frost');
    const experimentNextBtn = document.getElementById('experimentNextBtn');
    const temperatureDisplay = document.getElementById('temperature');
    const timeDisplay = document.getElementById('time');
    const statusDisplay = document.getElementById('experimentStatus');

    // Buton durumunu değiştir
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deney Çalışıyor...';
    }

    // Isıtıcıyı aktif et
    if (heater) {
        heater.classList.add('active');
    }

    // Deney aşamalarını başlat
    experimentInterval = setInterval(() => {
        timeElapsed++;
        
        // Süre ve sıcaklık güncelleme
        if (timeDisplay) timeDisplay.textContent = timeElapsed;
        
        // Deney aşamaları
        if (timeElapsed <= 3) {
            // Isınma aşaması (0-3 dakika)
            temperature = 25 + (timeElapsed * 25); // 25°C'den 100°C'ye
            updateExperimentStatus('Naftalin ısınıyor...', statusDisplay);
            
        } else if (timeElapsed <= 6) {
            // Süblimleşme başlangıcı (3-6 dakika)
            temperature = 100 + ((timeElapsed - 3) * 10); // 100°C'den 130°C'ye
            updateExperimentStatus('Naftalin süblimleşmeye başlıyor!', statusDisplay);
            
            if (timeElapsed === 4) {
                // Naftalin erimeye başlar
                if (naphthalene) naphthalene.classList.add('heating');
            }
            
        } else if (timeElapsed <= 10) {
            // Aktif süblimleşme (6-10 dakika)
            temperature = 130 + ((timeElapsed - 6) * 5); // 130°C'den 150°C'ye
            updateExperimentStatus('Süblimleşme aktif! Buhar oluşuyor.', statusDisplay);
            
            if (timeElapsed === 7) {
                // Buhar görünür olur
                if (vapor) vapor.classList.add('active');
            }
            
        } else if (timeElapsed <= 13) {
            // Kırağılaşma (10-13 dakika)
            temperature = 150 - ((timeElapsed - 10) * 10); // 150°C'den 120°C'ye
            updateExperimentStatus('Soğuk camda kırağılaşma başlıyor!', statusDisplay);
            
            if (timeElapsed === 11) {
                // Kırağı oluşur
                if (frost) frost.classList.add('active');
            }
            
        } else {
            // Deney tamamlandı (13+ dakika)
            finishExperiment();
            return;
        }

        // Sıcaklık görüntüsünü güncelle
        if (temperatureDisplay) temperatureDisplay.textContent = Math.round(temperature);
        
        // Veri kaydı
        recordObservation(timeElapsed, Math.round(temperature));
        
    }, 1000); // Her saniye güncelle (hızlı simülasyon için)
}

// Deney durumu güncelleme
function updateExperimentStatus(message, statusElement) {
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.classList.add('animate-pulse');
        setTimeout(() => {
            statusElement.classList.remove('animate-pulse');
        }, 1000);
    }
}

// Gözlem kaydı
function recordObservation(time, temp) {
    let observation = '';
    
    if (time <= 3) {
        observation = 'Naftalin ısınıyor, henüz değişim yok';
    } else if (time <= 6) {
        observation = 'Naftalin küçülmeye başlıyor';
    } else if (time <= 10) {
        observation = 'Naftalin buharlaşıyor, beyaz buhar görülüyor';
    } else if (time <= 13) {
        observation = 'Soğuk camda beyaz kristaller oluşuyor';
    } else {
        observation = 'Süblimleşme ve kırağılaşma tamamlandı';
    }

    // Sadece belirli zaman aralıklarında kaydet (her 2 dakikada bir)
    if (time % 2 === 0 || time >= 13) {
        experimentData.push({
            time: time,
            temperature: temp,
            observation: observation
        });
        
        updateObservationTable();
    }
}

// Gözlem tablosunu güncelleme
function updateObservationTable() {
    const tableBody = document.getElementById('observationData');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    experimentData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.time}</td>
            <td>${data.temperature}</td>
            <td>${data.observation}</td>
        `;
        tableBody.appendChild(row);
        
        // Yeni satırı animasyonla göster
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        setTimeout(() => {
            row.style.transition = 'all 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Deneyi bitirme
function finishExperiment() {
    experimentRunning = false;
    clearInterval(experimentInterval);

    // UI elementlerini güncelle
    const startBtn = document.getElementById('startExperiment');
    const experimentNextBtn = document.getElementById('experimentNextBtn');
    const statusDisplay = document.getElementById('experimentStatus');
    const heater = document.getElementById('heater');

    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-check"></i> Deney Tamamlandı';
        startBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    }

    if (experimentNextBtn) {
        experimentNextBtn.disabled = false;
        experimentNextBtn.classList.add('animate-bounce');
    }

    if (statusDisplay) {
        statusDisplay.textContent = '🎉 Deney başarıyla tamamlandı! Süblimleşme ve kırağılaşma gözlemlendi.';
        statusDisplay.style.color = '#27ae60';
        statusDisplay.style.fontWeight = 'bold';
    }

    // Isıtıcıyı kapat
    if (heater) {
        heater.classList.remove('active');
    }

    // Başarı sesi (opsiyonel)
    playSuccessSound();
}

// Başarı sesi çalma (opsiyonel)
function playSuccessSound() {
    // Web Audio API ile basit bir başarı sesi
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Ses çalınamazsa sessizce devam et
        console.log('Ses çalınamadı:', e);
    }
}

// Hipotez sonucunu gösterme
function showHypothesisResult() {
    const resultDiv = document.getElementById('hypothesisResult');
    if (!resultDiv) return;

    let resultHTML = '';
    const correctAnswer = 'sublimleşir';

    if (selectedHypothesis === correctAnswer) {
        resultHTML = `
            <div style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <h4><i class="fas fa-check-circle"></i> Tebrikler! Hipoteziniz Doğru</h4>
                <p>Naftalin gerçekten de doğrudan katıdan gaza geçti (süblimleşti). Bu, bazı maddelerin erime noktasına ulaşmadan doğrudan buharlaşabildiğini gösterir.</p>
            </div>
        `;
    } else {
        resultHTML = `
            <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <h4><i class="fas fa-times-circle"></i> Hipoteziniz Yanlış</h4>
                <p><strong>Seçiminiz:</strong> ${getHypothesisText(selectedHypothesis)}</p>
                <p><strong>Doğru Cevap:</strong> Naftalin doğrudan katıdan gaza geçti (süblimleşti)</p>
                <p>Bu normal! Bilim öğrenme sürecidir. Şimdi doğru cevabı öğrendiniz.</p>
            </div>
        `;
    }

    resultDiv.innerHTML = resultHTML;
    
    // Animasyonla göster
    resultDiv.style.opacity = '0';
    resultDiv.style.transform = 'scale(0.8)';
    setTimeout(() => {
        resultDiv.style.transition = 'all 0.5s ease';
        resultDiv.style.opacity = '1';
        resultDiv.style.transform = 'scale(1)';
    }, 100);
}

// Hipotez metni alma
function getHypothesisText(value) {
    switch(value) {
        case 'erir':
            return 'Önce eriyecek, sonra buharlaşacak';
        case 'sublimleşir':
            return 'Doğrudan katıdan gaza geçecek (süblimleşecek)';
        case 'değişmez':
            return 'Hiçbir değişiklik olmayacak';
        default:
            return 'Belirtilmemiş';
    }
}

// Deneyi yeniden başlatma
function restartExperiment() {
    // Tüm değişkenleri sıfırla
    currentStep = 1;
    experimentRunning = false;
    experimentData = [];
    temperature = 25;
    timeElapsed = 0;
    selectedHypothesis = '';
    
    // Interval'ı temizle
    if (experimentInterval) {
        clearInterval(experimentInterval);
    }

    // UI'yi sıfırla
    resetExperimentUI();
    
    // İlk adıma dön
    showStep(1);
    updateProgressBar();
    updateStepDisplay();
    
    // Sayfa başına scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Deney UI'sini sıfırlama
function resetExperimentUI() {
    // Checkbox ve radio button'ları sıfırla
    const safetyCheck = document.getElementById('safetyCheck');
    if (safetyCheck) safetyCheck.checked = false;

    const hypothesisInputs = document.querySelectorAll('input[name="hypothesis"]');
    hypothesisInputs.forEach(input => input.checked = false);

    // Button'ları sıfırla
    const safetyNextBtn = document.getElementById('safetyNextBtn');
    if (safetyNextBtn) safetyNextBtn.disabled = true;

    const hypothesisNextBtn = document.getElementById('hypothesisNextBtn');
    if (hypothesisNextBtn) hypothesisNextBtn.disabled = true;

    const experimentNextBtn = document.getElementById('experimentNextBtn');
    if (experimentNextBtn) {
        experimentNextBtn.disabled = true;
        experimentNextBtn.classList.remove('animate-bounce');
    }

    // Deney button'unu sıfırla
    const startBtn = document.getElementById('startExperiment');
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Deneyi Başlat';
        startBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }

    // Animasyon class'larını temizle
    const animatedElements = document.querySelectorAll('.heating, .active');
    animatedElements.forEach(element => {
        element.classList.remove('heating', 'active');
    });

    // Sıcaklık ve süre görüntüsünü sıfırla
    const temperatureDisplay = document.getElementById('temperature');
    const timeDisplay = document.getElementById('time');
    const statusDisplay = document.getElementById('experimentStatus');

    if (temperatureDisplay) temperatureDisplay.textContent = '25';
    if (timeDisplay) timeDisplay.textContent = '0';
    if (statusDisplay) {
        statusDisplay.textContent = 'Deneyi başlatmak için butona basın';
        statusDisplay.style.color = '#7f8c8d';
        statusDisplay.style.fontWeight = '600';
    }

    // Tabloyu temizle
    const tableBody = document.getElementById('observationData');
    if (tableBody) tableBody.innerHTML = '';
}

// Utility fonksiyonları
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function validateStep(stepNumber) {
    switch(stepNumber) {
        case 3:
            return document.getElementById('safetyCheck')?.checked || false;
        case 4:
            return selectedHypothesis !== '';
        case 5:
            return !experimentRunning;
        default:
            return true;
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Bir hata oluştu:', e.error);
    
    // Kullanıcıya minimal hata bildirimi
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Bir hata oluştu. Sayfayı yenileyin.';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
});

// Konsol mesajı
console.log('🧪 5. Sınıf Süblimleşme Deneyi Simülasyonu');
console.log('📚 Fen Bilimleri Laboratuvarı - İnteraktif Öğrenme');
console.log('🚀 React + TypeScript teknolojilerinden vanilla JS\'e dönüştürüldü');