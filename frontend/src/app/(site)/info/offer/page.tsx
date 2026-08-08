export default function OfferPage() {
    return (
        <main className="w-full min-h-screen py-32 px-6 sm:px-12 md:px-[70px] text-white/90 leading-relaxed font-sans" style={{ backgroundColor: "transparent" }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-fraktur text-4xl md:text-5xl lg:text-6xl text-white mb-16 text-center tracking-wide">
                    Договір публічної оферти (Угода користувача)
                </h1>

                <p className="text-base mb-10 text-white/70 font-light leading-relaxed">
                    Цей документ є офіційною публічною пропозицією (офертою) сервісу <strong className="text-white font-normal">Holy Drip</strong> (далі — «Агент» / «Сервіс») укласти договір надання послуг з пошуку, викупу та організації доставки товарів з-за кордону, а також продажу товарів із фактичної наявності (далі — «Договір»). Оформлюючи замовлення на сайті, Користувач (далі — «Клієнт») беззаперечно приймає умови цього Договору.
                </p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">1. Предмет договору</h2>
                <div className="pl-4 border-l border-white/10 space-y-4">
                    <p className="text-base text-white/70 font-light">
                        1.1. Агент зобов&apos;язується за дорученням, від імені та за рахунок Клієнта здійснити дії з пошуку, викупу у третіх осіб (іноземних постачальників) та організації доставки обраних Клієнтом Товарів (послуга «Custom Sourcing»).
                    </p>
                    <p className="text-base text-white/70 font-light">
                        1.2. У випадку оформлення замовлення на Товар із категорії «В наявності» (Kyiv Instock), Сервіс виступає безпосереднім Продавцем Товару.
                    </p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">2. Порядок оформлення замовлення</h2>
                <div className="pl-4 border-l border-white/10 space-y-4">
                    <p className="text-base text-white/70 font-light">
                        2.1. Клієнт самостійно формує замовлення через інтерфейс сайту (кошик) або через офіційні канали зв&apos;язку (Telegram).
                    </p>
                    <p className="text-base text-white/70 font-light">
                        2.2. Замовлення на послугу викупу (Custom Sourcing) вважається прийнятим до виконання Агентом виключно після надходження 100% передоплати вартості Товару на рахунок Агента.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        2.3. Підтверджуючи замовлення, Клієнт гарантує правильність вказаних характеристик Товару (розмір, колір, модель) та бере на себе повну відповідальність за свій вибір.
                    </p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">3. Ціна та порядок розрахунків</h2>
                <div className="pl-4 border-l border-white/10 space-y-4">
                    <p className="text-base text-white/70 font-light">
                        3.1. Усі ціни на сайті вказані у національній валюті (Гривня) і можуть включати комісійну винагороду Агента за послуги викупу.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        3.2. Агент залишає за собою право в односторонньому порядку коригувати ціни до моменту отримання повної оплати від Клієнта (через зміну валютних курсів або цінової політики закордонного постачальника).
                    </p>
                    <p className="text-base text-white/70 font-light">
                        3.3. Вартість міжнародної логістики розраховується окремо (залежно від фактичної ваги/об&apos;єму) після надходження Товару на транзитний склад та сплачується Клієнтом додатково.
                    </p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">4. Права та відповідальність сторін</h2>
                <div className="pl-4 border-l border-white/10 space-y-4">
                    <p className="text-base text-white/70 font-light">
                        4.1. Агент несе відповідальність за відповідність Товару замовленню Клієнта (згідно з артикулом/фото на етапі QC-перевірки).
                    </p>
                    <p className="text-base text-white/70 font-light">
                        4.2. Агент не несе відповідальності за затримки в доставці, що виникли з вини митних органів, міжнародних або локальних поштових служб, а також внаслідок форс-мажорних обставин.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        4.3. Відповідно до специфіки агентських послуг, Товар належної якості, викуплений та доставлений під індивідуальне замовлення Клієнта, обміну та поверненню не підлягає. Згідно з чинним законодавством України (Постанова КМУ №172), повернення можливе лише для товарів, що придбані з фактичної наявності на складі Агента.
                    </p>
                    <p className="text-base text-white/70 font-light">
                        4.4. Клієнт зобов'язаний оглянути посилку безпосередньо у відділенні служби доставки. Претензії щодо зовнішніх дефектів (браку) після прийняття посилки Клієнтом не розглядаються.
                    </p>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">5. Форс-мажор (обставини непереборної сили)</h2>
                <div className="pl-4 border-l border-white/10 space-y-4">
                    <p className="text-base text-white/70 font-light">
                        5.1. Сторони звільняються від відповідальності за невиконання зобов&apos;язань за цим Договором, якщо це сталося внаслідок дії обставин непереборної сили (військові дії, страйки, закриття кордонів, стихійні лиха тощо).
                    </p>
                </div>
            </div>
        </main>
    );
}
