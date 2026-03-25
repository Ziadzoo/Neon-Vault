// بيانات تجريبية لعملية التسجيل (في الحقيقي تأتي من السيرفر)
const registrationOptions = {
    publicKey: {
        challenge: Uint8Array.from("random-string-123", c => c.charCodeAt(0)),
        rp: { name: "موقعي الخاص", id: window.location.hostname },
        user: {
            id: Uint8Array.from("user123", c => c.charCodeAt(0)),
            name: "ziyad@example.com",
            displayName: "Ziyad Ahmed"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }], // تدعم FaceID/TouchID
        timeout: 60000,
        attestation: "direct"
    }
};

async function startScan() {
    const status = document.getElementById('status');
    
    try {
        // محاولة تسجيل البصمة إذا لم تكن مسجلة (للمرة الأولى فقط)
        // ملاحظة: navigator.credentials.create هي التي تفتح نافذة "إعداد البصمة"
        const credential = await navigator.credentials.create(registrationOptions);
        
        if (credential) {
            status.innerText = "✅ تم ربط البصمة بنجاح!";
            setTimeout(showProfile, 1000);
        }
    } catch (err) {
        // إذا كانت مسجلة مسبقاً، سنكتفي بالتحقق العادي
        console.log("نحاول التحقق العادي...");
        verifyExisting();
    }
}

async function verifyExisting() {
    try {
        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge: Uint8Array.from("random-string-456", c => c.charCodeAt(0)),
                timeout: 60000,
                userVerification: "required"
            }
        });
        if (assertion) showProfile();
    } catch (e) {
        document.getElementById('status').innerText = "فشل التعرف على الوجه.";
    }
}

function showProfile() {
    // كود عرض البيانات (الذي استخدمناه سابقاً)
    const card = document.querySelector('.glass-card');
    card.innerHTML = `
        <div class="profile-info">
            <h2 style="color: #00ff88;">مرحباً بك يا زياد</h2>
            <p>تم فتح القفل ببصمتك الخاصة.</p>
            <p><b>الاسم:</b> زياد أحمد محمد منصور</p>
            <button onclick="location.reload()">خروج</button>
        </div>
    `;
}
