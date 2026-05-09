// ============================================
// MSD Security Config - إعدادات الحماية
// لا تقم بتعديل هذا الملف
// ============================================

const MSD_CONFIG = {
    version: '5.0',
    securityLevel: 'ULTIMATE',
    blockDuration: 86400000, // 24 ساعة بالمللي ثانية
    maxAttempts: 3,
    enableLogging: true,
    
    // كلمات المرور المسموحة (للوصول الآمن)
    allowedPasswords: [
        'MSD2024Secure',
        'SimpleWiki2024',
        'Yahya2024'
    ],
    
    // النطاقات المسموحة
    allowedDomains: [
        'localhost',
        '127.0.0.1',
        'YOUR-USERNAME.github.io'
    ],
    
    // رسائل الحماية
    messages: {
        devTools: '⚠️ تم اكتشاف أدوات المطور - تم قفل الموقع',
        copy: '⚠️ النسخ غير مسموح به',
        rightClick: '⚠️ النقر الأيمن غير مسموح به',
        unauthorized: '⚠️ وصول غير مصرح به'
    }
};

// منع تعديل الإعدادات
Object.freeze(MSD_CONFIG);
Object.freeze(MSD_CONFIG.messages);

console.log('%c⚙️ MSD Security Config Loaded', 'color: #E2B13B; font-size: 12px;');
