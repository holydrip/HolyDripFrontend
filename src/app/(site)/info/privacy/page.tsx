export default function PrivacyPage() {
    return (
        <main className="w-full min-h-screen py-32 px-6 sm:px-12 md:px-[70px] text-white/90 leading-relaxed font-sans" style={{ backgroundColor: "transparent" }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-fraktur text-4xl md:text-5xl lg:text-6xl text-white mb-16 text-center tracking-wide">
                    Політика конфіденційності
                </h1>

                <p className="text-base mb-10 text-white/70 font-light">Інтернет-магазин <strong className="text-white font-normal">Holy Drip</strong> з повагою ставиться до конфіденційної інформації будь-якої особи, яка відвідує наш сайт.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">1. Збір даних</h2>
                <p className="text-base mb-6 text-white/70 font-light">Ми збираємо лише ті персональні дані, які ви добровільно надаєте під час оформлення замовлення: ПІБ, номер телефону, адресу електронної пошти та адресу доставки.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">2. Використання даних</h2>
                <p className="text-base mb-6 text-white/70 font-light">Ваші дані використовуються виключно для:</p>
                <ul className="list-none pl-0 mb-10 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Обробки та відправки ваших замовлень.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Зв&apos;язку з вами щодо деталей замовлення.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Надання клієнтської підтримки.
                    </li>
                </ul>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">3. Передача даних третім особам</h2>
                <p className="text-base mb-6 text-white/70 font-light">Ми не передаємо ваші персональні дані третім особам, за винятком логістичних компаній (наприклад, «Нова Пошта») виключно для здійснення доставки вашого замовлення.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">4. Захист даних</h2>
                <p className="text-base mb-6 text-white/70 font-light">Ми вживаємо всіх необхідних заходів для захисту ваших даних від несанкціонованого доступу, зміни або знищення. Використовуючи цей сайт, ви погоджуєтесь із цією політикою конфіденційності.</p>
            </div>
        </main>
    );
}
