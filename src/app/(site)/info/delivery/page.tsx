export default function DeliveryPage() {
    return (
        <main className="w-full min-h-screen py-32 px-6 sm:px-12 md:px-[70px] text-white/90 leading-relaxed font-sans" style={{ backgroundColor: "transparent" }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-fraktur text-4xl md:text-5xl lg:text-6xl text-white mb-16 text-center tracking-wide">
                    Оплата та доставка
                </h1>

                <p className="text-base mb-10 text-white/70 font-light leading-relaxed">
                    <strong className="text-white font-normal">Holy Drip</strong> функціонує як закритий сервіс індивідуального пошуку та викупу товарів (High-End Replicas / Archive Fashion) від іноземних постачальників. Оформлюючи замовлення, клієнт погоджується з наведеними нижче умовами.
                </p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">1. Доставка та терміни</h2>
                <p className="text-base mb-6 text-white/70 font-light pl-4 border-l border-white/10">
                    Доставка замовлень здійснюється у два етапи: міжнародна логістика та локальна доставка по Україні.
                </p>

                <ul className="list-none pl-0 mb-8 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Терміни виконання (Custom Sourcing):</strong> Орієнтовний час доставки товарів під індивідуальне замовлення з Азії або Європи становить 14–18 робочих днів з моменту оплати товару. У разі митних затримок або форс-мажорних обставин терміни можуть бути подовжені, про що клієнт інформується додатково.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Товари в наявності (Kyiv Instock):</strong> Відправка товарів, що знаходяться на складі в Україні, здійснюється протягом 1–2 робочих днів.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Способи локальної доставки:</strong> Відправка по території України здійснюється виключно логістичною компанією «Нова Пошта» (на відділення, поштомат або кур&apos;єром).
                    </li>
                </ul>

                <p className="text-base mt-8 mb-4 text-white/70 font-light">
                    <strong className="text-white font-normal">Вартість логістики:</strong>
                </p>
                <div className="pl-4 border-l border-white/10 space-y-4 mb-8">
                    <p className="text-base text-white/70 font-light">
                        Міжнародна доставка (вага вантажу) розраховується та сплачується клієнтом після прибуття товару на склад.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        Доставка по Україні оплачується клієнтом за тарифами перевізника під час отримання посилки.
                    </p>
                </div>


                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">2. Оплата та фінансові зобов&apos;язання</h2>
                <p className="text-base mb-6 text-white/70 font-light pl-4 border-l border-white/10">
                    Система оплати розділена для забезпечення прозорості угоди між сервісом та клієнтом.
                </p>

                <ul className="list-none pl-0 mb-8 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Викуп товару (Передоплата):</strong> Для ініціації процесу викупу індивідуального замовлення у закордонного постачальника клієнт здійснює 100% передоплату вартості товару.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Способи оплати:</strong> Оплата здійснюється шляхом переказу коштів за офіційними реквізитами (IBAN) або іншим узгодженим із менеджером способом (наприклад, криптовалютний переказ).
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        <strong className="text-white font-normal mr-2">Відсутність післяплати (Накладеного платежу):</strong> З огляду на специфіку індивідуального викупу (товари замовляються персонально під параметри клієнта), сервіс не працює за системою часткової передоплати або накладеного платежу (COD).
                    </li>
                </ul>

                <div className="pl-4 border-l border-[#ff3333]/30 space-y-4 mt-10">
                    <p className="text-base text-white/70 font-light italic">
                        Здійснюючи оплату, клієнт підтверджує свою згоду з умовами логістики та відмовою від повернення коштів у разі зміни рішення після викупу товару у постачальника.
                    </p>
                </div>
            </div>
        </main>
    );
}
