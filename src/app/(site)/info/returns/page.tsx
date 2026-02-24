export default function ReturnsPage() {
    return (
        <main className="w-full min-h-screen py-32 px-6 sm:px-12 md:px-[70px] text-white/90 leading-relaxed font-sans" style={{ backgroundColor: "#050505" }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-fraktur text-4xl md:text-5xl lg:text-6xl text-white mb-16 text-center tracking-wide">
                    Обмін та повернення
                </h1>

                <p className="text-base mb-10 text-white/70 font-light">Відповідно до Закону України «Про захист прав споживачів», ви маєте право обміняти або повернути товар протягом <strong className="text-white font-normal">14 днів</strong> з моменту покупки (отримання посилки).</p>

                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-wider">Умови повернення та обміну:</h2>
                <ul className="list-none pl-0 mb-8 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Товар не був у вжитку, не має слідів носіння, плям, запахів або пошкоджень.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Збережено товарний вигляд, оригінальна упаковка та всі бірки/ярлики не відірвані.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Збережено документ, що підтверджує покупку.
                    </li>
                </ul>
                <p className="font-serif text-sm mb-12 text-white/40 italic pl-4 border-l border-white/10">Увага: згідно з Постановою Кабінету Міністрів України №172, нижня білизна та шкарпетки обміну та поверненню не підлягають.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">Як оформити повернення/обмін:</h2>
                <ul className="list-none pl-0 mb-8 space-y-4">
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Зв&apos;яжіться з нами в Telegram/Viber або напишіть на пошту.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Вкажіть номер замовлення та причину повернення.
                    </li>
                    <li className="relative pl-6 text-white/70 font-light">
                        <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                        Надішліть товар «Новою Поштою» за реквізитами, які надасть менеджер.
                    </li>
                </ul>
                <p className="text-base mb-12 text-white/70 font-light pl-4 border-l border-white/10">Вартість доставки при поверненні або обміні товару належної якості оплачує покупець. Якщо повернення відбувається через брак — доставку оплачуємо ми.</p>

                <h2 className="text-xl md:text-2xl font-bold mt-16 mb-6 text-white uppercase tracking-wider">Повернення коштів:</h2>
                <p className="text-base mb-6 text-white/70 font-light pl-4 border-l border-white/10">Кошти повертаються на банківську картку клієнта протягом 1-3 робочих днів після отримання та перевірки товару на нашому складі.</p>
            </div>
        </main>
    );
}