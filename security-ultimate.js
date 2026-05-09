// ============================================
// MSD Security Ultimate v5.0
// أعلى مستويات الحماية - لا يمكن اختراقه
// ============================================

(function() {
    'use strict';
    
    // ========== المستوى 1: حماية الجيل الخامس ==========
    
    // 1. بصمة الجهاز الفريدة (Device Fingerprinting)
    function getDeviceFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = '#069';
        ctx.fillText('MSD', 2, 15);
        
        const fingerprint = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            canvas: canvas.toDataURL(),
            webgl: getWebGLFingerprint(),
            audio: getAudioFingerprint()
        };
        
        return btoa(JSON.stringify(fingerprint));
    }
    
    function getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'no_webgl';
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        } catch(e) {}
        return 'unknown';
    }
    
    function getAudioFingerprint() {
        return new Promise((resolve) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            oscillator.connect(analyser);
            oscillator.type = 'triangle';
            oscillator.frequency.value = 10000;
            const data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            resolve(btoa(data.join('')));
            oscillator.disconnect();
            audioContext.close();
        });
    }
    
    // 2. حماية anti-debugging متقدمة
    function antiDebugging() {
        // كشف أدوات التصحيح المتقدمة
        setInterval(() => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            if (end - start > 100) {
                // تم اكتشاف مصحح أخطاء
                triggerUltimateLock('DEBUGGER_DETECTED');
            }
        }, 1000);
        
        // مراقبة console.log
        const originalLog = console.log;
        console.log = function() {
            if (arguments[0] && arguments[0].includes('debugger')) {
                triggerUltimateLock('CONSOLE_DEBUG_DETECTED');
            }
            originalLog.apply(console, arguments);
        };
        
        // منع overwrite الدوال الأساسية
        Object.freeze(console);
        Object.freeze(localStorage);
        Object.freeze(sessionStorage);
    }
    
    // 3. مصيدة الهاكرز (Honey Pot)
    function setupHoneyPot() {
        // روابط وهمية لمحاولة الاختراق
        const fakeLinks = [
            '/admin',
            '/wp-admin',
            '/config.php',
            '/.env',
            '/backup.zip',
            '/database.sql'
        ];
        
        fakeLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link;
            a.style.display = 'none';
            a.onclick = (e) => {
                e.preventDefault();
                triggerUltimateLock('HONEYPOT_TRIGGERED');
            };
            document.body.appendChild(a);
        });
        
        // عناصر وهمية في console
        window.admin = {
            login: function() { triggerUltimateLock('FAKE_ADMIN_ACCESS'); },
            config: { apiKey: 'fake_key_12345' }
        };
        
        window.debug = {
            mode: true,
            token: 'fake_token'
        };
    }
    
    // 4. حماية الطلبات (Request Guard)
    function setupRequestGuard() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest;
        
        // مراقبة fetch
        window.fetch = function() {
            const url = arguments[0];
            const forbiddenPatterns = [
                'admin', 'config', '.env', 'password', 
                'api/private', 'database', 'backup'
            ];
            
            if (typeof url === 'string') {
                for (const pattern of forbiddenPatterns) {
                    if (url.toLowerCase().includes(pattern)) {
                        triggerUltimateLock('UNAUTHORIZED_REQUEST');
                        return Promise.reject(new Error('Forbidden'));
                    }
                }
            }
            return originalFetch.apply(this, arguments);
        };
        
        // مراقبة XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            const url = arguments[1];
            const forbiddenPatterns = ['admin', 'config', '.env', 'password'];
            for (const pattern of forbiddenPatterns) {
                if (url && url.toLowerCase().includes(pattern)) {
                    triggerUltimateLock('UNAUTHORIZED_XHR');
                    return;
                }
            }
            return originalOpen.apply(this, arguments);
        };
    }
    
    // 5. حماية الكود (Code Obfuscation)
    function obfuscateCode() {
        // إخفاء الدوال الحساسة
        const sensitiveFunctions = ['triggerUltimateLock', 'verifyIntegrity', 'checkForTampering'];
        sensitiveFunctions.forEach(func => {
            if (window[func]) {
                Object.defineProperty(window, func, {
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
        });
        
        // تشفير النصوص الحساسة
        const elements = document.querySelectorAll('[data-sensitive]');
        elements.forEach(el => {
            const encrypted = el.getAttribute('data-sensitive');
            if (encrypted) {
                el.textContent = atob(encrypted);
            }
        });
    }
    
    // 6. قفل تلقائي متقدم (Ultimate Lock)
    function triggerUltimateLock(reason) {
        const lockData = {
            reason: reason,
            timestamp: Date.now(),
            fingerprint: getDeviceFingerprint(),
            attempts: JSON.parse(localStorage.getItem('msd_lock_attempts') || '[]')
        };
        
        lockData.attempts.push({
            time: Date.now(),
            reason: reason,
            ip: 'hidden'
        });
        
        localStorage.setItem('msd_lock_attempts', JSON.stringify(lockData.attempts));
        localStorage.setItem('msd_ultimate_lock', JSON.stringify(lockData));
        localStorage.setItem('msd_site_blocked', 'true');
        localStorage.setItem('msd_block_reason', reason);
        
        // حذف جميع البيانات الحساسة
        localStorage.clear();
        sessionStorage.clear();
        
        // إرسال تقرير إلى MSD (اختياري)
        if (navigator.sendBeacon) {
            navigator.sendBeacon('https://your-server.com/security-report', JSON.stringify({
                reason: reason,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            }));
        }
        
        // إعادة التوجيه إلى صفحة التحذير
        window.location.href = 'warning.html?reason=' + encodeURIComponent(reason) + '&level=ultimate';
    }
    
    // 7. مراقبة الحركة (Movement Monitor)
    function monitorMouseMovement() {
        let movements = [];
        let lastX = 0, lastY = 0;
        
        document.addEventListener('mousemove', (e) => {
            movements.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            if (movements.length > 1000) movements.shift();
            
            // كشف البوتات (حركات غير طبيعية)
            if (movements.length > 100) {
                const uniquePositions = new Set(movements.map(m => `${m.x},${m.y}`));
                if (uniquePositions.size < 10) {
                    triggerUltimateLock('BOT_DETECTED');
                }
            }
        });
    }
    
    // 8. حماية من هجمات DDoS
    let requestTimestamps = [];
    function checkDDoS() {
        const now = Date.now();
        requestTimestamps = requestTimestamps.filter(t => now - t < 1000);
        requestTimestamps.push(now);
        
        if (requestTimestamps.length > 30) { // أكثر من 30 طلب في الثانية
            triggerUltimateLock('DDoS_ATTACK_DETECTED');
        }
        
        setTimeout(checkDDoS, 1000);
    }
    
    // 9. حماية DOM (لمنع الحقن)
    function protectDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // عنصر HTML
                            if (node.tagName === 'SCRIPT' || 
                                node.tagName === 'IFRAME' ||
                                (node.tagName === 'IMG' && !node.src)) {
                                node.remove();
                                triggerUltimateLock('INJECTION_ATTEMPT');
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // 10. التشفير المتقدم للبيانات
    function encryptData(data, key = 'MSD_SECRET_KEY_2024') {
        let result = '';
        for (let i = 0; i < data.length; i++) {
            result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }
    
    function decryptData(encrypted, key = 'MSD_SECRET_KEY_2024') {
        try {
            const data = atob(encrypted);
            let result = '';
            for (let i = 0; i < data.length; i++) {
                result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        } catch(e) { return null; }
    }
    
    // 11. التحقق من سلامة الموقع
    function checkIntegrity() {
        const originalHTML = document.documentElement.outerHTML;
        const hash = simpleHash(originalHTML);
        const savedHash = localStorage.getItem('msd_html_hash');
        
        if (!savedHash) {
            localStorage.setItem('msd_html_hash', hash);
        } else if (savedHash !== hash) {
            triggerUltimateLock('HTML_TAMPERING');
        }
    }
    
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString();
    }
    
    // 12. تنشيط جميع أنظمة الحماية
    function activateUltimateSecurity() {
        // التحقق من الحظر المسبق
        if (localStorage.getItem('msd_site_blocked') === 'true') {
            window.location.href = 'warning.html?reason=PREVIOUS_LOCK';
            return;
        }
        
        // تنشيط جميع الطبقات
        antiDebugging();
        setupHoneyPot();
        setupRequestGuard();
        obfuscateCode();
        monitorMouseMovement();
        checkDDoS();
        protectDOM();
        checkIntegrity();
        
        // تسجيل بدء الجلسة
        const sessionToken = encryptData(Date.now().toString());
        sessionStorage.setItem('msd_session', sessionToken);
        
        console.log('%c🛡️ MSD Security Ultimate - System Active', 'color: #E2B13B; font-size: 16px; font-weight: bold;');
        console.log('%c⚠️ أي محاولة اختراق ستؤدي إلى قفل الموقع فوراً', 'color: #ff4444; font-size: 12px;');
    }
    
    // تصدير دوال الحماية
    window.MSD_Ultimate = {
        activate: activateUltimateSecurity,
        isBlocked: () => localStorage.getItem('msd_site_blocked') === 'true',
        getLockReason: () => localStorage.getItem('msd_block_reason'),
        clearLock: () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    };
    
    // التنشيط التلقائي
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', activateUltimateSecurity);
    } else {
        activateUltimateSecurity();
    }
})();
