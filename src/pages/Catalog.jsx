import React, { useEffect, useState }  from 'react'
import { Footer } from '../components/common/Footer'
import { CourseSlider } from '../components/core/Catalog/CourseSlider'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { getCatalogPageData } from '../services/operation/catalogPageData'
import { useSelector } from 'react-redux'
import {Error} from "./Error"
import { SellCourseCard } from '../components/core/Catalog/SellCourseCard'

export const Catalog = () => {
    const { loading } = useSelector((state) => state.profile)
    const {catalogName}=useParams();
    const [catalogPageData, setCatalogPageData]= useState(null)
    const [categoryId,setCategoryId] = useState('')
    const [active,setActive] = useState(1);
  

    useEffect(()=>{
        const getCategory= async() => {
            const res = await apiConnector("GET",categories.CATEGORIES_API);
           // console.log("res",res)

            const category_id = res.data.data.filter((ct)=>ct.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id;
           // console.log("category_id",category_id)
            setCategoryId(category_id);
        }
        getCategory()
    },[catalogName])
   // console.log("catalogName",catalogName)

   // console.log("categoryId",categoryId)

    useEffect(()=>{
       // console.log("categoryId",categoryId)
            const getCategoryDetails = async()=>{
                //console.log("categoryId",categoryId)
                try{
                    const res = await getCatalogPageData(categoryId);
                   // console.log("resof catalog",res)
                    setCatalogPageData(res)

                }
                catch(error){
                    console.log("error",error)
                }
            }
            if(categoryId) {
                getCategoryDetails();
            }

    },[categoryId])

    // console.log("catalogPageData",catalogPageData)
    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="loader"></div>
          </div>
        )
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }



  return (
    <div className='w-full'>

        {/* hero section */}
        <div  className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                 <p className="text-sm text-richblack-300">{`Home/ Catalog/ `}
                    <span className="text-yellow-25">
                        {catalogPageData.data.selectedCategory.name}
                    </span>

                 </p>
                 <p className="text-3xl text-richblack-5">
                    {catalogPageData.data.selectedCategory.name}
                 </p>
                 <p className="max-w-[870px] text-richblack-200">
                 {catalogPageData.data.selectedCategory.description}
                 </p>
            </div>

        </div>


            {/* section1 */}
            <div className=" mx-auto box-content  max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div  className="section_heading" > Courses to get you started</div>
                <div  className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p  className={`px-4 py-2 ${
                        active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                        } cursor-pointer transition-all duration-100 `}
                        onClick={() => setActive(1)}>
                            Most Popular
                    </p>
                    <p
                         className={`px-4 py-2 ${
                            active === 2
                              ? "border-b border-b-yellow-25 text-yellow-25"
                              : "text-richblack-50"
                          } cursor-pointer transition-all duration-100 `}
                          onClick={() => setActive(2)}
                    >New</p>
                </div>
                <div>
                  <CourseSlider Courses = {catalogPageData.data.selectedCategory.course}/>

                </div>
               
            </div>

            {/* section2 */}
            <div className=" mx-auto box-content max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">

                <p className="section_heading">Top Courses in {catalogPageData.data.differentCategory.name} </p>
                <div className="py-8">
                    <CourseSlider Courses = {catalogPageData.data.differentCategory.course}/>
                </div>
            </div>

            {/* section 3 */}
            <div  className=" mx-auto box-content  max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Frequently Bought</div>
                <div className='py-8'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                          {
                            catalogPageData.data.mostSellingCourses.slice(0,4).map((course,index)=>(
                                <SellCourseCard  course={course} key={index} height = {'h-[250px] lg:h-[400px]'} />
                            ))
                          }
                    </div>
                </div>
            </div>

        <Footer/>
    </div>
  )
}
