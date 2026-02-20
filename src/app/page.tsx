"use client";
import { Geist } from "next/font/google";
import Styles from "./page.module.css";
import Image from "next/image";
import bannerLogo from "../../public/images/logo-full.jpg";
import { motion } from "framer-motion";
import ProductCard from "@/components/product-card/ProductCard";
import { CardCarousel } from "@/components/card-carousel/CardCarousel";
import { Countdown } from "@/components/countdown/Countdown";

const font = Geist({ subsets: ["latin-ext"] });

export default function Page() {
  const dropDate = new Date("2026-02-16T00:00:00")
  if (Date.now() < dropDate.getTime()) {
    return <Countdown date={dropDate}/>
  }

  return (
    <div className={Styles.wrapper}>
      <div className={`${Styles.banner} ${font.className}`}>
        <div className={`${Styles.bannerText}`}>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 200 }}
            transition={{ duration: 0.5 }}
          >
            Holy Drip, <br /> Clothes for you
          </motion.p>
        </div>
        <Image
          className={`${Styles.bannerImage}`}
          src={bannerLogo}
          alt="logo"
          width={undefined}
          height={undefined}
        />
      </div>
      <div className={`${Styles.welcomeList}`}>
        <h1>Welcome List</h1>
        <div className={`${Styles.welcomeListProducts}`}>
          <ProductCard
            product={{ id: "1", name: "Black Tee", price: 500 }}
          ></ProductCard>
          <ProductCard
            product={{ id: "1", name: "Black Tee", price: 500 }}
          ></ProductCard>
          <ProductCard
            product={{ id: "1", name: "Black Tee", price: 500 }}
          ></ProductCard>
        </div>
      </div>
      <div className={`${Styles.about}`}>
        <h1>About Us</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae
          animi quos culpa obcaecati perspiciatis dicta illum, voluptatum quam.
          Magnam hic aut labore commodi dolore accusamus eveniet omnis illum
          vero? Voluptatum? Mollitia, consectetur ea? Tempore repellat
          accusamus, cupiditate, corporis quam perspiciatis sint dignissimos
          impedit exercitationem sequi voluptate omnis dolorum iure optio
          dolores labore in facilis alias ipsam consequuntur eos itaque.
          Possimus. Totam harum dolorum minus officia provident cumque sequi
          commodi. Est, porro quam quas quidem ipsam beatae sint illo aperiam
          voluptates consequuntur mollitia iusto rem dolorum, amet suscipit
          error odit laborum!
        </p>
      </div>
      <div className={`${Styles.offers}`}>
        <h1>What We Offer</h1>
        <CardCarousel
          slides={[
            { id: "1", name: "Black Tee", price: 500 },
            { id: "2", name: "Black Tee", price: 500 },
            { id: "3", name: "Black Tee", price: 500 },
            { id: "4", name: "Black Tee", price: 500 },
            { id: "5", name: "Black Tee", price: 500 },
          ]}
        ></CardCarousel>
      </div>
      <div className={`${Styles.offers}`}>
        <h1>New Collection</h1>
        <CardCarousel
          slides={[
            { id: "1", name: "Black Tee", price: 500 },
            { id: "2", name: "Black Tee", price: 500 },
            { id: "3", name: "Black Tee", price: 500 },
            { id: "4", name: "Black Tee", price: 500 },
            { id: "5", name: "Black Tee", price: 500 },
          ]}
        ></CardCarousel>
      </div>
      <div className={`${Styles.offers}`}>
        <h1>Sales</h1>
        <CardCarousel
          slides={[
            { id: "1", name: "Black Tee", price: 500 },
            { id: "2", name: "Black Tee", price: 500 },
            { id: "3", name: "Black Tee", price: 500 },
            { id: "4", name: "Black Tee", price: 500 },
            { id: "5", name: "Black Tee", price: 500 },
          ]}
        ></CardCarousel>
      </div>
    </div>
  );
}
