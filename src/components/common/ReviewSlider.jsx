import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay,FreeMode,Navigation}  from 'swiper/modules'
import RatingStars from './RatingStars'

import { Pagination } from 'swiper/modules';
import ReactStars from "react-rating-stars-component"
import { apiConnector } from '../../services/apiconnector';
import { ratingsEndpoints } from '../../services/apis';
import { FaStar } from 'react-icons/fa';

export const ReviewSlider = () => {
    const [reviews,setReviews] = useState([])
    const truncateWords = 15;

    useEffect(()=>{
        const fetchAllReviews = async()=>{
            try{
                const response = await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API)
                console.log("print response",response)
                if(!response.data.success){
                    throw new Error("Could not Fetch Reviews")
                }
                
                setReviews(response.data.data)

                console.log("print reviews",reviews)


            }
            catch(error){
                console.log("data not found",error)

            }
           
        }
        fetchAllReviews()
    },[])

  return (
    <div className="text-white lg:max-w-maxContent max-w-maxContentTab mx-auto">
        <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
            <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
                1024:{slidesPerView:4}

              }}
            modules={[FreeMode, Pagination, Autoplay]}
            className="w-full  " >

                {
                    reviews.map((review,index)=>{
                        return(
                            <SwiperSlide key={index}>
                                <div  className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 h-[180px]">
                                    <div  className="flex items-center gap-4">
                                        <img src={
                                            review?.user?.image
                                            ? review?.user?.image
                                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                                        } alt=""
                                        className="h-9 w-9 rounded-full object-cover"/>

                                        <div className="flex flex-col">
                                            <h1 className="font-semibold text-richblack-5">{review.user.firstName} { review.user.lastName}</h1>
                                            <h2 className="text-[12px] font-medium text-richblack-500">
                                                {review.course.courseName}
                                            </h2>

                                        </div>
                                    </div>
                                    <div className='flex flex-col '>
                                        <p className="font-medium text-richblack-25 h-20">
                                            {review?.review.split(" ").length > truncateWords
                                            ? `${review?.review
                                                .split(" ")
                                                .slice(0, truncateWords)
                                                .join(" ")} ...`
                                            : `${review?.review}`}
                                        </p>
                                        <div className="flex  gap-2  ">
                                            <h3 className="font-semibold text-yellow-100">
                                            {review.rating.toFixed(1)}
                                            </h3> 
                                            {/* <ReactStars
                                            count={5}
                                            value={review.rating}
                                            size={20}
                                            edit={false}
                                            activeColor="#ffd700"
                                            emptyIcon={<FaStar />}
                                            fullIcon={<FaStar />}
                                            /> */}
                                            <RatingStars Review_Count={review.rating}/>
                                        </div>

                                    </div>
                                   
                                    


                                </div>
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>
        </div>


    </div>
  )
}
