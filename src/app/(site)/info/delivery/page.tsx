export default function DeliveryPage() {
    return (
        <main className="w-full min-h-screen py-32 px-6 sm:px-12 md:px-[70px] text-white/90 leading-relaxed font-sans" style={{ backgroundColor: "#050505" }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-fraktur text-4xl md:text-5xl lg:text-6xl text-white mb-16 text-center tracking-wide">
                    Оплата та доставка
                </h1>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">Доставка:</h2>
                <p className="text-base mb-6 text-white/70 font-light">Ми відправляємо замовлення по всій території України за допомогою логістичної компанії «Нова Пошта».</p>
                <ul className="list-none pl-0 mb-10 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Способи доставки:</strong> На відділення, у поштомат або кур'єром за вашою адресою.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Терміни відправки:</strong> Замовлення обробляються та відправляються протягом 1-3 робочих днів після підтвердження.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Вартість доставки:</strong> Оплачується покупцем за тарифами «Нової Пошти» при отриманні.
                    </li>
                </ul>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">Оплата:</h2>
                <p className="text-base mb-6 text-white/70 font-light">Ви можете обрати найбільш зручний для вас спосіб оплати:</p>
                <ul className="list-none pl-0 mb-10 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Онлайн-оплата на сайті:</strong> Безпечна оплата через платіжну систему без комісій (Visa/Mastercard, Apple Pay, Google Pay).
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Накладений платіж:</strong> Відправляємо післяплатою з мінімальною передоплатою 200 грн (гарантія того, що ви заберете посилку). Комісію за переказ коштів (20 грн + 2%) оплачує покупець.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Оплата за реквізитами:</strong> Після оформлення замовлення менеджер надішле вам реквізити ФОП (IBAN) для оплати.
                    </li>
                </ul>
            </div>
        </main>
    );
}