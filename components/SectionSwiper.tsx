import { FC } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, A11y } from 'swiper';
import 'swiper/css';
import "swiper/css/effect-fade";

export const SectionSwiper: FC = () => {
  return (
    <>
      <Swiper
        // install Swiper modules
        className="bg-red-100 w-[100%] h-[100%]"
        modules={[EffectFade]}
        // spaceBetween={50}
        effect={"fade"}
        slidesPerView={1}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        <SwiperSlide className="bg-blue-100">Slide 1</SwiperSlide>
        <SwiperSlide className="bg-yellow-100">Slide 22</SwiperSlide>
        <SwiperSlide className="bg-gree-100">Slide 34</SwiperSlide>
        <SwiperSlide className="bg-violet-100">Slide 4</SwiperSlide>
        ...
      </Swiper>
    </>
  )
}