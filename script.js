        // TAOMLAR MA'LUMOTLAR OMBORI (Mavjud massiv)
        let mainProductsData = [
            { id: 101, name: "Premium Tenderloin Steyk", desc: "Maxsus o'tlar bilan marinadlangan va olovda pishirilgan oliy nav go'sht.", price: 245000, category: "meat", img: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3" },
            { id: 102, name: "Oltin Salmon fleytasi", desc: "Dengiz tuzi va laym nuri ostida tayyorlangan nozik qizil baliq go'shti.", price: 185000, category: "fish", img: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3" },
            { id: 103, name: "Tiramisu de Milano", desc: "Original Maskarpone kremi hamda espresso tomchilari qo'shilgan klassika.", price: 75000, category: "dessert", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3" }
        ];

        let userCartArray = [];

        // Elementlarni chaqirib olish
        const mainMenuGrid = document.getElementById('main-menu-grid');
        const adminLiveTableRows = document.getElementById('admin-live-table-rows');
        const cartSidebarWrapper = document.getElementById('cart-sidebar-wrapper');
        const cartItemsWrapper = document.getElementById('cart-items-wrapper');
        const cartCountBadge = document.getElementById('cart-count');
        const cartTotalSumSpan = document.getElementById('cart-total-sum');

        // A. FOYDALANUVChI MENYUSINI CHIZISH
        function drawUserMenu(filterValue = "all") {
            mainMenuGrid.innerHTML = "";
            mainProductsData.forEach(product => {
                if (filterValue === "all" || product.category === filterValue) {
                    const card = document.createElement('div');
                    card.className = "menu-card";
                    card.innerHTML = `
                        <div class="menu-img-wrapper">
                            <img src="${product.img}" alt="${product.name}">
                        </div>
                        <div class="menu-info">
                            <h3>${product.name}</h3>
                            <p>${product.desc}</p>
                            <div class="menu-footer">
                                <span class="price">${product.price.toLocaleString()} UZS</span>
                                <button class="btn-add-cart" onclick="addProductToCart(${product.id})">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    mainMenuGrid.appendChild(card);
                }
            });
        }

        // B. ADMIN JADVALINI YANGILASH
        function drawAdminTable() {
            adminLiveTableRows.innerHTML = "";
            mainProductsData.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${product.img}" class="adm-table-img"></td>
                    <td><b>${product.name}</b></td>
                    <td><span class="welcome-badge" style="margin:0; padding:4px 10px; font-size:10px;">${product.category}</span></td>
                    <td>${product.price.toLocaleString()} UZS</td>
                    <td><button class="btn-delete-food" onclick="removeProductFromSystem(${product.id})"><i class="fa-solid fa-trash-can"></i></button></td>
                `;
                adminLiveTableRows.appendChild(tr);
            });
        }

        // Kategoriya boyicha saralash
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                e.target.classList.add('active');
                drawUserMenu(e.target.getAttribute('data-filter'));
            });
        });

        // C. SAVAT LOGIKASI (ADD, RE-CALCULATE, REMOVE)
        function addProductToCart(id) {
            const targetProd = mainProductsData.find(item => item.id === id);
            const existInCart = userCartArray.find(item => item.id === id);

            if (existInCart) {
                existInCart.qty++;
            } else {
                userCartArray.push({ ...targetProd, qty: 1 });
            }
            refreshCartUi();
        }

        function refreshCartUi() {
            cartItemsWrapper.innerHTML = "";
            let calculatedSum = 0;
            let badgeCounter = 0;

            userCartArray.forEach(item => {
                calculatedSum += item.price * item.qty;
                badgeCounter += item.qty;

                const rowDiv = document.createElement('div');
                rowDiv.className = "cart-item";
                rowDiv.innerHTML = `
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <span>${item.price.toLocaleString()} UZS</span>
                        <div class="cart-item-qty">
                            <button onclick="modifyQty(${item.id}, -1)">-</button>
                            <span>${item.qty}</span>
                            <button onclick="modifyQty(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        <div><b>${(item.price * item.qty).toLocaleString()} UZS</b></div>
                        <button class="btn-remove-item" onclick="deleteDirectlyFromCart(${item.id})">O'chirish</button>
                    </div>
                `;
                cartItemsWrapper.appendChild(rowDiv);
            });

            cartCountBadge.innerText = badgeCounter;
            cartTotalSumSpan.innerText = calculatedSum.toLocaleString() + " UZS";
        }

function modifyQty(id, value) {
    const currentItem = userCartArray.find(i => i.id === id);
    if (currentItem) {
        currentItem.qty += value;
        // Agar soni 1 dan kamayib ketsa, massivdan olib tashlaymiz
        if (currentItem.qty <= 0) {
            userCartArray = userCartArray.filter(i => i.id !== id);
        }
    }
    refreshCartUi(); // Har doim oxirida bir marta chaqiramiz
}

        function deleteDirectlyFromCart(id) {
            userCartArray = userCartArray.filter(i => i.id !== id);
            refreshCartUi();
        }

        // Savat interaktiv hodisalari
        document.getElementById('cart-trigger').addEventListener('click', () => cartSidebarWrapper.classList.add('open'));
        document.getElementById('cart-close-trigger').addEventListener('click', () => cartSidebarWrapper.classList.remove('open'));

        // D. SOMELYE FUNKSIYASI
        document.getElementById('sommelier-food-type').addEventListener('change', (e) => {
            const choice = e.target.value;
            const adviceText = document.getElementById('sommelier-advice');
            if (choice === "meat") adviceText.innerText = "Qizil Premium Vino (Cabernet Sauvignon)";
            else if (choice === "fish") adviceText.innerText = "Muzdek Oq Vino (Chardonnay)";
            else if (choice === "dessert") adviceText.innerText = "Shirin desert ko'pikli vinosi (Moscato d'Asti)";
            else if (choice === "pasta") adviceText.innerText = "Yengil Klassik Pushti Vino (Chianti Classico)";
        });

        // E. ADMIN TIZIMI AVTORIZATSIYASI (Parol: 7777)
        const adminGateLink = document.getElementById('admin-gate-link');
        const adminAuthOverlay = document.getElementById('admin-auth-overlay');
        const adminAuthCloseBtn = document.getElementById('admin-auth-close-btn');
        const adminLoginSubmitBtn = document.getElementById('admin-login-submit-btn');
        const liveAdminPanel = document.getElementById('live-admin-panel');
        const cryptoPassInput = document.getElementById('crypto-pass-input');
        const authErrorMsg = document.getElementById('auth-error-msg');

        adminGateLink.addEventListener('click', (e) => { e.preventDefault(); adminAuthOverlay.classList.add('show'); });
        adminAuthCloseBtn.addEventListener('click', () => { adminAuthOverlay.classList.remove('show'); authErrorMsg.style.display="none"; cryptoPassInput.value=""; });
        
        adminLoginSubmitBtn.addEventListener('click', () => {
            if (cryptoPassInput.value === "2012") {
                adminAuthOverlay.classList.remove('show');
                liveAdminPanel.classList.remove('hidden');
                window.scrollTo({ top: liveAdminPanel.offsetTop - 80, behavior: 'smooth' });
                cryptoPassInput.value = "";
                authErrorMsg.style.display = "none";
            } else {
                authErrorMsg.style.display = "block";
            }
        });

        document.getElementById('admin-logout-btn').addEventListener('click', () => {
            liveAdminPanel.classList.add('hidden');
        });

        // F. ADMIN: TAOM QO'SHISH VA O'CHIRISH FUNKSIYASI
        document.getElementById('add-food-to-menu-btn').addEventListener('click', () => {
            const name = document.getElementById('add-food-name').value;
            const desc = document.getElementById('add-food-desc').value;
            const price = parseInt(document.getElementById('add-food-price').value);
            const category = document.getElementById('add-food-cat').value;
            let img = document.getElementById('add-food-img').value;

            if(!name || !desc || !price) { alert("Iltimos, barcha asosiy kataklarni to'ldiring!"); return; }
            if(!img) img = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3"; // standart rasm

            const addedObj = { id: Date.now(), name, desc, price, category, img };
            mainProductsData.push(addedObj);

            // Tozalash
            document.getElementById('add-food-name').value = "";
            document.getElementById('add-food-desc').value = "";
            document.getElementById('add-food-price').value = "";
            document.getElementById('add-food-img').value = "";

            drawUserMenu();
            drawAdminTable();
            alert("Yangi mahsulot premium menyuga muvaffaqiyatli integratsiya qilindi!");
        });

        function removeProductFromSystem(id) {
            if (confirm("Ushbu taomni tizim va menyudan butunlay o'chirmoqchimisiz?")) {
                mainProductsData = mainProductsData.filter(item => item.id !== id);
                drawUserMenu();
                drawAdminTable();
            }
        }

async function sendOrderToTelegram() {
    const BOT_TOKEN = '8621593307:AAFKglIqOOdWJ9Vkp-MnqyfVetO4Pbq7Be4';
    const CHAT_ID = '7535256198'; 
    
    // 1. Savatcha bo'shligini tekshirish
    if (userCartArray.length === 0) {
        alert("Savatchangiz bo'sh!");
        return;
    }

    // 2. Alert (Prompt) orqali telefon raqamini so'rash
    let phoneInput = prompt("Buyurtmani tasdiqlash uchun telefon raqamingizni kiriting:", "+998");

    // Agar foydalanuvchi "Otmena" bossa yoki bo'sh qoldirsa
    if (phoneInput === null || phoneInput.trim() === "" || phoneInput === "+998") {
        alert("Telefon raqami kiritilmadi. Buyurtma bekor qilindi.");
        return;
    }

    // 3. Xabar matnini tayyorlash
    let message = `<b>🛎 YANGI BUYURTMA</b>\n`;
    message += `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n`;

    let total = 0;
    userCartArray.forEach((item, index) => {
        const itemSum = item.price * item.qty;
        message += `${index + 1}. <b>${item.name}</b>\n`;
        message += `   └─ ${item.qty} dona = <b>${itemSum.toLocaleString()} UZS</b>\n\n`;
        total += itemSum;
    });

    message += `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`;
    message += `<b>💰 JAMI: ${total.toLocaleString()} UZS</b>\n`;
    message += `<b>📞 TEL: ${phoneInput}</b>\n`;
    message += `<b>📅 VAQT:</b> ${new Date().toLocaleString('uz-UZ')}\n`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            // Muvaffaqiyatli yakunlanganda oddiy alert
            alert("✅ Buyurtmangiz qabul qilindi!\nTez orada bog'lanamiz.");
            
            userCartArray = []; 
            refreshCartUi();
            document.getElementById('cart-sidebar-wrapper').classList.remove('open');
        } else {
            alert("❌ Xatolik! Bot bilan bog'lanib bo'lmadi.");
        }
    } catch (error) {
        alert("🌐 Internet aloqasi yo'q!");
    }
}

// 1. Fokus bo'lganda (bosilganda) +998 ni chiqarish
function setInitialValue(input) {
    if (input.value === "") {
        input.value = "+998 ";
    }
}

// 2. Fokus yo'qolganda, agar raqam yozilmagan bo'lsa, placeholderga qaytarish
function checkEmptyValue(input) {
    if (input.value === "+998 " || input.value === "+998") {
        input.value = "";
    }
}

// 3. +998 qismini o'chirishni taqiqlash
function preventDeleteCountryCode(e, input) {
    // Agar kursor boshida bo'lsa yoki Backspace/Delete bosilsa va +998 xavf ostida bo'lsa
    if (input.selectionStart < 5 && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
    }
}

// 4. Raqamni 90-123-45-67 formatiga keltirish
function formatPhone(input) {
    let val = input.value.replace(/\D/g, ""); // Faqat raqamlar
    
    // 998 har doim boshida turishi shart
    if (!val.startsWith("998")) {
        val = "998" + val;
    }

    let formatted = "+998 ";
    if (val.length > 3) {
        formatted += val.substring(3, 5); // Kod (masalan: 90)
    }
    if (val.length > 5) {
        formatted += "-" + val.substring(5, 8); // 123
    }
    if (val.length > 8) {
        formatted += "-" + val.substring(8, 10); // 45
    }
    if (val.length > 10) {
        formatted += "-" + val.substring(10, 12); // 67
    }
    
    input.value = formatted.substring(0, 18);
}

// 3. Telegramga yuborish (Bosilsa qo'ng'iroq bo'ladigan formatda)
async function sendBookingToTelegram() {
    const BOT_TOKEN = '8621593307:AAFKglIqOOdWJ9Vkp-MnqyfVetO4Pbq7Be4';
    const CHAT_ID = '7535256198';

    const name = document.getElementById('book-name').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const guests = document.getElementById('book-guests').value;
    const date = document.getElementById('book-date').value;
    const comment = document.getElementById('book-comment').value;

    if (!name || phone.length < 17 || !date) {
        alert("Iltimos, ismingizni, to'liq telefon raqamingizni va vaqtni kiriting!");
        return;
    }

    // Telegramda raqam ustiga bosilsa tel ilovasiga o'tishi uchun tg://tel?tel= formatidan foydalanamiz
    // Yoki oddiygina raqamni toza holda link qilish ham mumkin
    const cleanPhone = phone.replace(/\D/g, ""); // Faqat raqamlar: 998901234567

    let message = `<b>📅 YANGI REZERVATSIYA</b>\n`;
    message += `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n`;
    message += `👤 <b>Mijoz:</b> ${name}\n`;
    
    // TELEGRAMDA BOSILSA QO'NG'IROQ QILADIGAN LINK:
    message += `📞 <b>Tel:</b> <a href="tel:+${cleanPhone}">${phone}</a>\n`;
    
    message += `👥 <b>Odam soni:</b> ${guests} kishi\n`;
    message += `⏰ <b>Vaqt:</b> ${date.replace('T', ' ')}\n`;
    if(comment) message += `📝 <b>Izoh:</b> ${comment}\n`;
    
    message += `\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`;
    message += `✅ #Booking`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            alert("✅ Joy muvaffaqiyatli band qilindi!");
            // Tozalash
            document.getElementById('book-name').value = "";
            document.getElementById('book-phone').value = "+998 ";
            document.getElementById('book-guests').value = "";
            document.getElementById('book-date').value = "";
            document.getElementById('book-comment').value = "";
        }
    } catch (e) {
        alert("Xatolik!");
    }
}
        // Ilk yuklanish nuqtasi
        drawUserMenu();
        drawAdminTable();