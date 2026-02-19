"use client";
import Styles from "./page.module.css";
import Image from "next/image";
import bannerLogo from "../../public/images/logo-full.jpg";
import { motion } from "framer-motion";
import ProductCard from "@/components/product-card/ProductCard";
import { CardCarousel } from "@/components/card-carousel/CardCarousel";
import { Countdown } from "@/components/countdown/Countdown";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const mockSlides = [
  { id: "1", name: "Black Tee", price: 500 },
  { id: "2", name: "Black Tee", price: 500 },
  { id: "3", name: "Black Tee", price: 500 },
  { id: "4", name: "Black Tee", price: 500 },
  { id: "5", name: "Black Tee", price: 500 },
];

export default function Page() {
  const dropDate = new Date("2026-02-14T00:00:00");
  if (Date.now() < dropDate.getTime()) {
    return <Countdown date={dropDate} />;
  }

  return (
    <main className={Styles.wrapper}>
      <section className={`${Styles.banner}`}>
        <motion.div 
          className={Styles.bannerText}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          Holy Drip, <br /> Clothes for you
        </motion.div>
        
        <motion.div 
          className={Styles.bannerImageContainer}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          <Image
            className={Styles.bannerImage}
            src={bannerLogo}
            alt="Holy Drip Main Logo"
            priority
          />
        </motion.div>
      </section>

      <motion.section 
        className={`${Styles.section}`}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1 variants={fadeInUp} className={Styles.sectionTitle}>
          Welcome List
        </motion.h1>
        <div className={Styles.welcomeListProducts}>
          {[1, 2, 3].map((item) => (
              <motion.div key={item} variants={fadeInUp}>
                <ProductCard product={{ id: String(item), name: "Black Tee", price: 500 }} />
              </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className={`${Styles.section}`}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className={Styles.sectionTitle}>About Us</h1>
        <p className={Styles.aboutText}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae
          animi quos culpa obcaecati perspiciatis dicta illum, voluptatum quam.
          Magnam hic aut labore commodi dolore accusamus eveniet omnis illum vero?
        </p>
      </motion.section>

      <motion.section 
        className={`${Styles.section}`}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h1 className={Styles.sectionTitle}>What We Offer</h1>
        <CardCarousel slides={mockSlides} />
      </motion.section>

      <motion.section 
        className={`${Styles.section}`}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h1 className={Styles.sectionTitle}>New Collection</h1>
        <CardCarousel slides={mockSlides} />
      </motion.section>

      <motion.section 
        className={`${Styles.section}`}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h1 className={Styles.sectionTitle}>Sales</h1>
        <CardCarousel slides={mockSlides} />
      </motion.section>
    </main>
  );
}