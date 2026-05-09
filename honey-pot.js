// ============================================
// MSD Honey Pot System
// مصيدة متطورة لاصطياد المخترقين
// ============================================

(function() {
    // مصائد متعددة
    const honeyTraps = [
        { id: 'fake-database', content: 'Database credentials: admin/password123' },
        { id: 'fake-config', content: 'API_KEY=sk-1234567890abcdef' },
        { id: 'fake-admin', content: 'Admin panel: /secret-admin-panel' },
        { id: 'fake-backup', content: 'Backup location: /backup/site_backup.zip' }
    ];
    
    // إضافة المصائد إلى الصفحة (مخفية)
    honeyTraps.forEach(trap => {
        const div = document.createElement('div');
        div.id = trap.id;
        div.style.display = 'none';
        div.setAttribute('data-fake', 'true');
        div.textContent = trap.content;
        document.body.appendChild(div);
        
        // مراقبة محاولة الوصول
        Object.defineProperty(div, 'innerHTML', {
            get: function() { return this.textContent; },
            set: function(value) {
                if (value !== this.textContent) {
                    triggerHoneyTrap(trap.id);
                }
                return value;
            }
        });
    });
    
    function triggerHoneyTrap(trapId) {
        // تسجيل المحاولة
        let attempts = JSON.parse(localStorage.getItem('msd_honey_attempts') || '[]');
        attempts.push({
            trap: trapId,
            time: Date.now(),
            userAgent: navigator.userAgent
        });
        localStorage.setItem('msd_honey_attempts', JSON.stringify(attempts));
        
        // قفل الموقع
        localStorage.setItem('msd_site_blocked', 'true');
        localStorage.setItem('msd_block_reason', `HONEY_TRAP_${trapId}`);
        
        // إعادة التوجيه
        window.location.href = 'warning.html?reason=HONEY_TRAP_TRIGGERED';
    }
    
    // مراقبة محاولات الوصول إلى console
    const originalLog = console.log;
    console.log = function() {
        const args = Array.from(arguments);
        if (args.some(arg => typeof arg === 'string' && 
            (arg.includes('config') || arg.includes('password') || arg.includes('api_key')))) {
            triggerHoneyTrap('CONSOLE_ACCESS');
        }
        originalLog.apply(console, args);
    };
    
    console.log('🐝 MSD Honey Pot System Active');
})();
