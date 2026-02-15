import Styles from "./about.module.css"
import Image from 'next/image';

export default function Page() {
  return (
    <div className={Styles.aboutPage}>
      <div className={Styles.description}>
        <div className={Styles.descriptionText}>
          <h1>
            Holy Drip - твій ідеальний вибір у світі вуличної моди.
          </h1>
          <p>
            Holy Drip - Це стиль, що говорить за тебе. Сміливі дизайни,комфорт і якість для твого
            унікального вайбу.
          </p>
        </div>
      </div>
      <div className={Styles.about}>
        <h1 className={Styles.heading}>
          Про нас
        </h1>
        <div className={Styles.aboutContent}>
          <Image width={800} height={400} className={Styles.aboutImage} src="/images/logo-full.jpg" alt="logo"/>
          <span className={Styles.aboutText}>
            Holy Drip - це бренд, створений для тих, хто не боїться бути собою.
            Ми об&#39;єднуємо стиль, якість та комфорт, щоб кожна річ відображала твою
            індивідуальність. Наш одяг це не просто речі,це спосіб виразити себе,
            заявити про свою унікальність і йти за власними правилами. Ми віримо,
            що мода це мистецтво, а ти - її натхнення.
            Обирай Holy Drip - і створюй свій власний тренд.
          </span>
        </div>
      </div>
      <div className={Styles.services}>
        <h1 className={Styles.heading}>Наші послуги</h1>
        <div className={Styles.servicesBlock}>
          <h2 className={Styles.servicesText}>Викуп і доставка товарів з Китаю</h2>
          <span className={Styles.servicesText}>Ми допоможемо придбати бажані речі з Китаю, організуємо їх доставку та забезпечимо безпечну та надійну угоду.</span>
        </div>
        <div className={Styles.servicesBlock}>
          <h2 className={Styles.servicesText}>Пошук товарів за фото</h2>
          <span className={Styles.servicesText}>Знайдемо потрібний товар за наданим фото, підберемо оптимальний варіант та проконсультуємо щодо умов покупки.</span>
        </div>
        <div className={Styles.servicesBlock}>
          <h2 className={Styles.servicesText}>Допомога з викупом</h2>
          <span className={Styles.servicesText}>Надаємо підтримку у процесі викупу товарів, яка залежіть від складності та обсягу замовлення.</span>
        </div>
        <div className={Styles.servicesBlock}>
          <h2 className={Styles.servicesText}>Перевірка оригінальності товарів</h2>
          <span className={Styles.servicesText}>Ми допоможемо перевірити, чи відповідає товар заявленій якості та бренду. Вартість полсуги - залежіть від складності.</span>
        </div>
      </div>
      <div className={Styles.reviews}>
        <h1 className={Styles.heading}>Відгуки</h1>
        <div className={Styles.reviewsBlock}>
          <div className={Styles.review}>
            <div className={Styles.reviewsImage}></div>
            <h1>Компанія</h1>
            <span>Замовляв через вас декілька разів, і кожного разу все проходило ідеально! Допомогли знайти товар за фото, швидко викупили й організували доставку. Особливо порадувала перевірка оригінальності тепер впевнений, що отримую якісний продукт. Дякую за професійний сервіс!</span>
          </div>
          <div className={Styles.review}>
            <div className={Styles.reviewsImage}></div>
            <h1>Компанія</h1>
            <span>Дуже задоволена роботою! Сподобалося, як оперативно відповідають і консультують. Товар з Китаю прийшов у відмінному стані, навіть швидше, ніж очікувала. Відчувається, що команда знається на своїй справі. Рекомендую всім!</span>
          </div>
          <div className={Styles.review}>
            <div className={Styles.reviewsImage}></div>
            <h1>Компанія</h1>
            <span>Звертався для викупу товару, але процес затягнувся довше, ніж обіцяли. Комунікація була не завжди оперативною, і довелося кілька разів уточнювати статус замовлення. Хотілося б більш чіткої організації та швидшого реагування</span>
          </div>
        </div>
      </div>
      <div className={Styles.contacts}>
        <h1 className={Styles.heading}>Контакти</h1>
        <h2 className={Styles.contact}>Телефон</h2>
        <h2 className={Styles.contact}>Instagram</h2>
        <h2 className={Styles.contact}>Telegram</h2>
      </div>
    </div>
  )
}