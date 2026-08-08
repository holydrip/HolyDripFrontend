export default function ReturnsPage() {
    return (
        <main className="w-full min-h-screen py-32 px-6 sm:px-12 md:px-[70px] text-white/90 leading-relaxed font-sans" style={{ backgroundColor: "transparent" }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-fraktur text-4xl md:text-5xl lg:text-6xl text-white mb-16 text-center tracking-wide">
                    Політика обміну та повернення
                </h1>

                <p className="text-base mb-10 text-white/70 font-light leading-relaxed">
                    Цей розділ регулює умови обміну та повернення товарів, замовлених через сервіс <strong className="text-white font-normal">Holy Drip</strong>, відповідно до чинного законодавства України та умов Публічної оферти.
                </p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">1. Товари під індивідуальне замовлення</h2>
                <div className="pl-4 border-l border-white/10 space-y-4 mb-8">
                    <p className="text-base text-white/70 font-light">
                        Сервіс надає послуги з індивідуального пошуку, викупу та міжнародної доставки товарів за дорученням Клієнта.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        Відповідно до специфіки агентських послуг, товари, доставлені з-за кордону під індивідуальний запит Клієнта, <strong className="text-white font-normal">поверненню та обміну не підлягають</strong>, якщо вони відповідають замовленим характеристикам (модель, колір, розмір, вказаний на бірці).
                    </p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">2. Товари з наявності (Склад в Україні)</h2>
                <p className="text-base mb-6 text-white/70 font-light">
                    Обмін та повернення товарів належної якості, придбаних із фактичної наявності на складі в Україні, здійснюється протягом <strong className="text-white font-normal">14 днів</strong> з моменту отримання посилки (відповідно до ст. 9 ЗУ «Про захист прав споживачів»), за умови дотримання наступних вимог:
                </p>
                <ul className="list-none pl-0 mb-8 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Товар не перебував у експлуатації, відсутні будь-які сліди носіння, прання, плями чи сторонні запахи.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Повністю збережено товарний вигляд, фабричне пакування, пломби та всі оригінальні ярлики (не відірвані).
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Збережено документ (або електронну квитанцію), що підтверджує оплату.
                    </li>
                </ul>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">3. Претензії щодо браку та пошкоджень</h2>
                <div className="pl-4 border-l border-[#ff3333]/30 space-y-4 mb-8">
                    <p className="text-base text-white/70 font-light">
                        <strong className="text-white font-normal">Обов&apos;язковою умовою</strong> вирішення спірних питань є огляд посилки безпосередньо у відділенні логістичної компанії («Нова Пошта»).
                    </p>
                    <p className="text-base text-white/70 font-light">
                        У разі виявлення виробничого браку, пошкодження або невідповідності замовленню, Клієнт зобов&apos;язаний скласти акт огляду/відмови разом зі співробітником пошти та негайно повідомити службу підтримки.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        Якщо посилка була забрана з відділення без складання акту огляду, претензії щодо візуальних дефектів, пошкоджень або некомплектності <strong className="text-white font-normal">не приймаються</strong>, а зобов&apos;язання Сервісу вважаються виконаними в повному обсязі.
                    </p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">4. Процедура повернення коштів та обміну</h2>
                <ul className="list-none pl-0 mb-8 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Для ініціації процедури Клієнт має звернутися до служби підтримки в Telegram із зазначенням номера замовлення та додаванням фото/відео доказів.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Транспортні витрати на повернення товару належної якості (з наявності) оплачує покупець. У випадку підтвердженого виробничого браку транспортні витрати компенсує Сервіс.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Повернення коштів здійснюється на банківські реквізити (IBAN/картку) Клієнта протягом 1–3 банківських днів після фактичного отримання та інспекції товару на нашому складі.
                    </li>
                </ul>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">5. Альтернативне вирішення (Послуга Resale)</h2>
                <div className="pl-4 border-l border-white/10 space-y-4 mb-8">
                    <p className="text-base text-white/70 font-light">
                        У випадку, якщо товар під індивідуальне замовлення не підійшов Клієнту за посадкою (фасоном), Сервіс залишає за собою право (але не зобов&apos;язання) надати безкоштовну послугу реалізації (Resale) даного товару через власні інформаційні канали.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        Кошти повертаються Клієнту після фактичного продажу товару третій особі.
                    </p>
                </div>
            </div>
        </main>
    );
}
