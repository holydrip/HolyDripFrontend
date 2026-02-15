import useEmblaCarousel from "embla-carousel-react";
import {
  usePrevNextButtons,
  PrevButton,
  NextButton,
} from "./arrow-buttons/ArrowButtons";
import { DotButton, useDotButton } from "./dots/Dots";

import Styles from "./card-carousel.module.css";
import { Product } from "@/types/product";
import ProductCard from "../product-card/ProductCard";

interface IProps {
  slides: Product[];
}

export function CardCarousel(props: IProps) {
  const { slides } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div className={Styles.emblaViewport} ref={emblaRef}>
        <div className={Styles.emblaContainer}>
          {slides.map((product) => (
            <div className={Styles.emblaSlide} key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className={Styles.emblaControls}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <div className={Styles.emblaDots}>
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={
                  index === selectedIndex
                    ? `${Styles.emblaDot} ${Styles.emblaDotSelected}`
                    : Styles.emblaDot
                }
              />
            ))}
          </div>
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
}
