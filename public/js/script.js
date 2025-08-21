// Guard ayarlarını kaydet
async function saveGuardSettings(guildId) {
    const settings = {
        autoProtection: document.getElementById('autoProtection').checked,
        antiRaid: document.getElementById('antiRaid').checked,
        antiBot: document.getElementById('antiBot').checked,
        antiLink: document.getElementById('antiLink').checked
    };
    
    try {
        const response = await fetch(`/api/${guildId}/guard-settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Guard ayarları kaydedildi!');
        } else {
            alert('Hata: ' + result.error);
        }
    } catch (error) {
        alert('Ayarlar kaydedilirken hata oluştu: ' + error.message);
    }
}

// Log ayarlarını kaydet
async function saveLogSettings(guildId) {
    const settings = {
        channel: document.getElementById('logChannel').value,
        messages: document.getElementById('logMessages').checked,
        joins: document.getElementById('logJoins').checked,
        moderation: document.getElementById('logModeration').checked,
        voice: document.getElementById('logVoice').checked
    };
    
    try {
        const response = await fetch(`/api/${guildId}/log-settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Log ayarları kaydedildi!');
        } else {
            alert('Hata: ' + result.error);
        }
    } catch (error) {
        alert('Ayarlar kaydedilirken hata oluştu: ' + error.message);
    }
}