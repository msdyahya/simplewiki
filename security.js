// ============================================
// MSD Security System v3.0
// نظام أمان ذكي ومتطور
// ============================================

(function() {
    'use strict';
    
    // ========== المتغيرات السرية ==========
    const SECRET_KEY = 'MSD_TEAM_2024_SECURE_' + btoa('SimpleWiki');
    const SITE_FINGERPRINT = generateFingerprint();
    
    // ========== توليد بصمة الموقع ==========
    function generateFingerprint() {
        let fingerprint = '';
        
        // 1. بصمة HTML
        const htmlContent = document.documentElement.outerHTML;
        fingerprint += simpleHash(htmlContent);
        
        // 2. بصمة CSS
        const styles = Array.from(document.styleSheets).map(sheet => {
            try {
                return sheet.ownerNode?.innerHTML || '';
            } catch(e) { return ''; }
        }).join('');
        fingerprint += simpleHash(styles);
        
        // 3. بصمة JavaScript
        const scripts = Array.from(document.scripts).map(s => s.innerHTML).join('');
        fingerprint += simpleHash(scripts);
        
        return simpleHash(fingerprint);
    }
    
    // ========== دالة تجزئة بسيطة ==========
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    // ========== التحقق من سلامة الموقع ==========
    function verifyIntegrity() {
        const currentFingerprint = generateFingerprint();
        const savedFingerprint = localStorage.getItem('msd_site_fingerprint');
        
        if (!savedFingerprint) {
            // أول زيارة - نحفظ البصمة
            localStorage.setItem('msd_site_fingerprint', currentFingerprint);
            localStorage.setItem('msd_first_visit', new Date().toISOString());
            return true;
        }
        
        if (savedFingerprint !== currentFingerprint) {
            // تم تغيير الكود - تفعيل الحماية
            triggerSecurityLock('CODE_MODIFICATION_DETECTED');
            return false;
        }
        
        return true;
    }
    
    // ========== تفعيل قفل الأمان ==========
    function triggerSecurityLock(reason) {
        // تسجيل المحاولة
        let attempts = JSON.parse(localStorage.getItem('msd_security_attempts') || '[]');
        attempts.push({
            timestamp: Date.now(),
            reason: reason,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        localStorage.setItem('msd_security_attempts', JSON.stringify(attempts));
        
        // حظر الموقع
        localStorage.setItem('msd_site_blocked', 'true');
        localStorage.setItem('msd_block_reason', reason);
        localStorage.setItem('msd_block_time', Date.now());
        
        // إعادة التوجيه إلى صفحة التحذير
        window.location.href = 'warning.html?reason=' + encodeURIComponent(reason);
    }
    
    // ========== التحقق من عدم الحظر ==========
    function isSiteBlocked() {
        const isBlocked = localStorage.getItem('msd_site_blocked') === 'true';
        const blockTime = parseInt(localStorage.getItem('msd_block_time') || '0');
        const blockDuration = 24 * 60 * 60 * 1000; // 24 ساعة
        
        if (isBlocked && (Date.now() - blockTime) < blockDuration) {
            // لا نزال في فترة الحظر
            if (window.location.pathname !== '/warning.html') {
                window.location.href = 'warning.html?reason=STILL_BLOCKED';
            }
            return true;
        } else if (isBlocked) {
            // انتهت فترة الحظر - نعيد التنشيط
            localStorage.removeItem('msd_site_blocked');
            localStorage.removeItem('msd_block_reason');
            localStorage.removeItem('msd_block_time');
        }
        return false;
    }
    
    // ========== مراقبة تغييرات DOM ==========
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            let significantChange = false;
            
            mutations.forEach(function(mutation) {
                // إذا تم إضافة نصوص أو عناصر جديدة بشكل غير متوقع
                if (mutation.type === 'childList' && mutation.addedNodes.length > 10) {
                    significantChange = true;
                }
                // إذا تم تغيير السمات المهمة
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'onclick' || 
                     mutation.attributeName === 'onload' ||
                     mutation.attributeName === 'src')) {
                    significantChange = true;
                }
            });
            
            if (significantChange) {
                triggerSecurityLock('DOM_MANIPULATION_DETECTED');
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['onclick', 'onload', 'src', 'href']
        });
    }
    
    // ========== مراقبة Console ==========
    function monitorConsole() {
        const originalError = console.error;
        const originalWarn = console.warn;
        
        let errorCount = 0;
        
        console.error = function() {
            errorCount++;
            if (errorCount > 10) {
                triggerSecurityLock('CONSOLE_ABUSE_DETECTED');
            }
            originalError.apply(console, arguments);
        };
        
        console.warn = function() {
            errorCount++;
            if (errorCount > 20) {
                triggerSecurityLock('CONSOLE_ABUSE_DETECTED');
            }
            originalWarn.apply(console, arguments);
        };
    }
    
    // ========== مراقبة أدوات المطور ==========
    function detectDevTools() {
        let devToolsOpen = false;
        const threshold = 160;
        
        setInterval(function() {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    triggerSecurityLock('DEV_TOOLS_DETECTED');
                }
            } else {
                devToolsOpen = false;
            }
        }, 1000);
    }
    
    // ========== مراقبة الشبكة ==========
    function monitorNetwork() {
        const originalFetch = window.fetch;
        window.fetch = function() {
            const url = arguments[0];
            // منع الوصول إلى ملفات敏感ة
            if (typeof url === 'string' && 
                (url.includes('config.js') || 
                 url.includes('security.js') ||
                 url.includes('.env') ||
                 url.includes('private'))) {
                triggerSecurityLock('UNAUTHORIZED_ACCESS_ATTEMPT');
                return Promise.reject(new Error('Access Denied'));
            }
            return originalFetch.apply(this, arguments);
        };
    }
    
    // ========== حماية localStorage ==========
    function protectLocalStorage() {
        const originalSetItem = localStorage.setItem;
        const originalRemoveItem = localStorage.removeItem;
        const originalClear = localStorage.clear;
        
        localStorage.setItem = function(key, value) {
            if (key.startsWith('msd_') && key !== 'msd_site_fingerprint') {
                // لا نسمح بتعديل مفاتيح الأمان
                return;
            }
            return originalSetItem.apply(this, arguments);
        };
        
        localStorage.removeItem = function(key) {
            if (key.startsWith('msd_')) {
                triggerSecurityLock('SECURITY_KEY_MODIFICATION_ATTEMPT');
                return;
            }
            return originalRemoveItem.apply(this, arguments);
        };
        
        localStorage.clear = function() {
            triggerSecurityLock('CLEAR_STORAGE_ATTEMPT');
        };
    }
    
    // ========== توليد توقيع رقمي ==========
    function generateDigitalSignature() {
        const data = {
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        const signature = btoa(JSON.stringify(data) + SECRET_KEY);
        localStorage.setItem('msd_signature', signature);
        return signature;
    }
    
    // ========== التحقق من التوقيع ==========
    function verifyDigitalSignature() {
        const savedSignature = localStorage.getItem('msd_signature');
        if (!savedSignature) {
            generateDigitalSignature();
            return true;
        }
        
        try {
            const data = {
                url: window.location.href,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                screenSize: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            const expectedSignature = btoa(JSON.stringify(data) + SECRET_KEY);
            
            if (savedSignature !== expectedSignature) {
                triggerSecurityLock('SIGNATURE_MISMATCH');
                return false;
            }
        } catch(e) {
            triggerSecurityLock('SIGNATURE_VERIFICATION_FAILED');
            return false;
        }
        return true;
    }
    
    // ========== تنشيط جميع أنظمة الحماية ==========
    function activateSecuritySystems() {
        // 1. التحقق من الحظر
        if (isSiteBlocked()) return;
        
        // 2. التحقق من سلامة الكود
        if (!verifyIntegrity()) return;
        
        // 3. التحقق من التوقيع الرقمي
        if (!verifyDigitalSignature()) return;
        
        // 4. تنشيط المراقبات
        if (document.body) {
            observeDOMChanges();
        } else {
            document.addEventListener('DOMContentLoaded', observeDOMChanges);
        }
        
        // 5. مراقبة الكونسول
        monitorConsole();
        
        // 6. مراقبة أدوات المطور
        detectDevTools();
        
        // 7. مراقبة الشبكة
        monitorNetwork();
        
        // 8. حماية التخزين المحلي
        protectLocalStorage();
        
        // 9. توليد توقيع جديد كل ساعة
        setInterval(generateDigitalSignature, 3600000);
        
        // 10. إضافة علامة مائية خفية
        addWatermark();
    }
    
    // ========== إضافة علامة مائية خفية ==========
    function addWatermark() {
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            bottom: 5px;
            right: 5px;
            font-size: 8px;
            opacity: 0.1;
            color: #E2B13B;
            z-index: 9999;
            pointer-events: none;
        `;
        watermark.innerHTML = `🔒 MSD Secure ${new Date().getFullYear()}`;
        document.body.appendChild(watermark);
    }
    
    // ========== تصدير دوال الحماية ==========
    window.MSD_Security = {
        activate: activateSecuritySystems,
        isBlocked: isSiteBlocked,
        getAttempts: () => JSON.parse(localStorage.getItem('msd_security_attempts') || '[]'),
        clearBlock: () => {
            localStorage.removeItem('msd_site_blocked');
            localStorage.removeItem('msd_block_reason');
            localStorage.removeItem('msd_block_time');
            window.location.reload();
        }
    };
    
    // التنشيط التلقائي
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', activateSecuritySystems);
    } else {
        activateSecuritySystems();
    }
})();
