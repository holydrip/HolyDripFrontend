export default function OfferPage() {
    return (
        <main className="w-full min-h-screen py-32 px-6 sm:px-12 md:px-[70px] text-white/90 leading-relaxed font-sans" style={{ backgroundColor: "#050505" }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-fraktur text-4xl md:text-5xl lg:text-6xl text-white mb-16 text-center tracking-wide">
                    Договір публічної оферти
                </h1>

                <p className="text-base mb-10 text-white/70 font-light">Цей текст є публічною офертою інтернет-магазину <strong className="text-white font-normal">Holy Drip</strong> (далі — «Продавець»). Оформлюючи замовлення на сайті, Покупець повністю та беззаперечно приймає умови цього договору.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">1. Загальні положення</h2>
                <p className="text-base mb-6 text-white/70 font-light pl-4 border-l border-white/10">1.1. Продавець продає товари через інтернет-магазин, а Покупець приймає та оплачує товари відповідно до умов цього Договору.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">2. Оформлення замовлення</h2>
                <p className="text-base mb-4 text-white/70 font-light pl-4 border-l border-white/10">2.1. Покупець самостійно оформлює замовлення на сайті через кошик.</p>
                <p className="text-base mb-6 text-white/70 font-light pl-4 border-l border-white/10">2.2. Замовлення вважається прийнятим до виконання після підтвердження менеджером або отримання оплати/передоплати.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">3. Ціна та оплата</h2>
                <p className="text-base mb-4 text-white/70 font-light pl-4 border-l border-white/10">3.1. Ціни на товари вказані на сайті в національній валюті України (гривні).</p>
                <p className="text-base mb-6 text-white/70 font-light pl-4 border-l border-white/10">3.2. Продавець залишає за собою право змінювати ціни на товари в односторонньому порядку до моменту підтвердження замовлення Покупцем.</p>
            </div>
        </main>
    );
}