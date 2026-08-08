import useEmblaCarousel from "embla-carousel-react";
import {
  usePrevNextButtons,
  PrevButton,
  NextButton,
} from "./arrow-buttons/ArrowButtons";
import { DotButton, useDotButton } from "./dots/Dots";
import { Product } from "@/lib/types";
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
    <section className="w-full mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((product) => (
            <div
              className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_25%] min-w-0 px-3"
              key={product.id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />

          <div className="flex items-center gap-1">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={[
                  "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-0 bg-transparent p-0 appearance-none",
                  "after:w-[14px] after:h-[14px] after:rounded-full after:flex after:content-['']",
                  index === selectedIndex
                    ? "after:bg-white after:shadow-[inset_0_0_0_3px_white]"
                    : "after:bg-[#7c7c7c] after:shadow-[inset_0_0_0_3px_#7c7c7c]",
                ].join(" ")}
              />
            ))}
          </div>

          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
}