// ============================================
// MSD Anti-DevTools - تعطيل أدوات المطور بالكامل
// ============================================

(function() {
    'use strict';
    
    // منع جميع مفاتيح الاختصار
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        // منع F-keys
        if (key === 'F12' || key === 'F11' || key === 'F10' || key === 'F9' || 
            key === 'F8' || key === 'F7' || key === 'F6' || key === 'F5') {
            e.preventDefault();
            showBlockMessage('⚠️ هذا الإجراء غير مسموح به');
            return false;
        }
        
        // منع Ctrl+Shift+...
        if (e.ctrlKey && e.shiftKey && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || 
            key === 'C' || key === 'c' || key === 'K' || key === 'k')) {
            e.preventDefault();
            showBlockMessage('⚠️ تم منع فتح أدوات المطور');
            return false;
        }
        
        // منع Ctrl+U, Ctrl+S, Ctrl+P
        if (e.ctrlKey && (key === 'u' || key === 'U' || key === 's' || key === 'S' || 
            key === 'p' || key === 'P' || key === 'H' || key === 'h')) {
            e.preventDefault();
            showBlockMessage('⚠️ هذا الإجراء غير مسموح به');
            return false;
        }
        
        // منع Alt+...
        if (e.altKey && (key === 'Tab' || key === 'F4' || key === 'Space')) {
            e.preventDefault();
            return false;
        }
    });
    
    // منع النقر الأيمن
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showBlockMessage('⚠️ النقر الأيمن غير مسموح به');
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
        showBlockMessage('⚠️ النسخ غير مسموح به');
        return false;
    });
    
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        showBlockMessage('⚠️ القص غير مسموح به');
        return false;
    });
    
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
    });
    
    // كشف أدوات المطور المتقدم
    function detectDevTools() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        
        if (end - start > 100) {
            document.body.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#ff4444;display:flex;justify-content:center;align-items:center;flex-direction:column;z-index:99999;">
                    <div style="font-size:50px;">🔒</div>
                    <h1>تم اكتشاف أدوات المطور</h1>
                    <p>تم قفل الموقع حفاظاً على الأمان</p>
                    <button onclick="location.reload()" style="background:#E2B13B;border:none;padding:10px 20px;border-radius:20px;margin-top:20px;cursor:pointer;">إعادة المحاولة</button>
                </div>
            `;
        }
    }
    
    // كشف أدوات المطور عبر عرض النافذة
    function detectDevToolsBySize() {
        let devToolsOpen = false;
        const threshold = 160;
        
        setInterval(function() {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    document.body.innerHTML = `
                        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#ff4444;display:flex;justify-content:center;align-items:center;flex-direction:column;z-index:99999;">
                            <div style="font-size:50px;">⚠️</div>
                            <h1>تم اكتشاف أدوات المطور</h1>
                            <p>الرجاء إغلاق أدوات المطور والمحاولة مرة أخرى</p>
                            <button onclick="location.reload()" style="background:#E2B13B;border:none;padding:10px 20px;border-radius:20px;margin-top:20px;cursor:pointer;">إعادة المحاولة</button>
                        </div>
                    `;
                }
            } else {
                devToolsOpen = false;
            }
        }, 1000);
    }
    
    // إظهار رسالة منبثقة
    function showBlockMessage(msg) {
        let toast = document.getElementById('msd-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'msd-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 12px 24px;
                border-radius: 40px;
                z-index: 99999;
                font-size: 14px;
                font-family: 'Cairo', sans-serif;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                display: none;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }
    
    // تعطيل Console
    if (typeof console !== 'undefined') {
        const noop = function() {};
        console.log = noop;
        console.warn = noop;
        console.error = noop;
        console.info = noop;
        console.debug = noop;
        console.table = noop;
        console.group = noop;
        console.groupEnd = noop;
    }
    
    // منع eval و Function
    window.eval = function() { 
        showBlockMessage('⚠️ eval غير مسموح به');
        return null; 
    };
    
    // منع إنشاء دوال جديدة
    const originalFunction = window.Function;
    window.Function = function() {
        showBlockMessage('⚠️ Function غير مسموح به');
        return function() {};
    };
    
    // حماية localStorage من التعديل
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        if (key === 'msd_secure') return;
        return originalSetItem.call(this, key, value);
    };
    
    // التنشيط
    setTimeout(() => {
        detectDevTools();
        detectDevToolsBySize();
    }, 100);
    
    console.log('%c🛡️ MSD Anti-DevTools Active - تم تعطيل أدوات المطور', 'color: #E2B13B; font-size: 14px;');
})();
