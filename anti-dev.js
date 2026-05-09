// ============================================
// MSD Anti-DevTools - تعطيل أدوات المطور بالكامل
// ============================================

(function() {
    'use strict';
    
    // منع جميع مفاتيح الاختصار
    const forbiddenKeys = [
        'F12', 'F11', 'F10', 'F9', 'F8', 'F7', 'F6', 'F5',
        'I', 'i', 'J', 'j', 'C', 'c', 'U', 'u', 'K', 'k',
        'S', 's', 'P', 'p', 'R', 'r', 'E', 'e'
    ];
    
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        // منع F-keys
        if (key.startsWith('F')) {
            e.preventDefault();
            showBlockMessage();
            return false;
        }
        
        // منع Ctrl+Shift+...
        if (e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            showBlockMessage();
            return false;
        }
        
        // منع Ctrl+U, Ctrl+S, Ctrl+P
        if (e.ctrlKey && (key === 'u' || key === 'U' || key === 's' || key === 'S' || key === 'p' || key === 'P')) {
            e.preventDefault();
            showBlockMessage();
            return false;
        }
        
        // منع Alt+...
        if (e.altKey) {
            e.preventDefault();
            showBlockMessage();
            return false;
        }
    });
    
    // منع النقر الأيمن
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showBlockMessage();
        return false;
    });
    
    // منع السحب والإفلات
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // منع النسخ والقص
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showBlockMessage();
        return false;
    });
    
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        showBlockMessage();
        return false;
    });
    
    // كشف أدوات المطور
    function checkDevTools() {
        const before = Date.now();
        debugger;
        const after = Date.now();
        
        if (after - before > 100) {
            document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#f00;display:flex;justify-content:center;align-items:center;z-index:99999;"><h1>🔒 تم اكتشاف أدوات المطور - تم قفل الموقع</h1></div>';
        }
    }
    
    setInterval(checkDevTools, 1000);
    
    function showBlockMessage() {
        const msg = document.createElement('div');
        msg.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ff4444;color:white;padding:10px20px;border-radius:10px;z-index:99999;font-size:12px;';
        msg.innerHTML = '⚠️ هذا الإجراء غير مسموح به';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }
    
    // حماية console
    console.log = console.warn = console.error = console.info = console.debug = function() {};
    
    // منع eval
    window.eval = function() { return null; };
    
    // حماية السجلات
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('%c🛡️ MSD Anti-DevTools Active', 'color: #E2B13B; font-size: 14px;');
})();
