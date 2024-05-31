"use client";

import React, { useEffect, useState } from 'react';
import { Star, Clock, BarChart, Ghost } from 'lucide-react';
import Link from 'next/link';
import { courses } from '@/app/courseList';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
interface Course {
  id: number;
  name: string;
  technology: string;
  hours_to_study: number;
  rating: string;
  level: string;
  learning_path: string;
  total_modules: number;
  registered_students: number | string;
}

const CoursePage = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const path = localStorage.getItem("selectedPath");
    setSelectedPath(path);
    if (path) {
      const recommended = courses.courses.filter(course =>
        course.learning_path.includes(path)
      ).slice(0, 3);
      setRecommendedCourses(recommended);
    }
  }, []);

  return (
    <main>
      <div className='text-3xl h-2/6 mb-3'>
        {!selectedPath && (
          <button>
            <a href="/pages/courses/preferensi">Isi quiz dulu yuk untuk dapat rekomendasi!</a>
          </button>
        )}
        {selectedPath && (
          <div className='recommended-courses p-5'>
            <h2 className='title pri-c mb-3'>Rekomendasi Courses:</h2>
            <div className='grid grid-flow-col auto-cols-max'>
              {recommendedCourses.map(course => (
                <div key={course.id} className='course course-card mr-5 p-4 w-80 bg-white'>
                  <div className='min-h-[70px]'>
                    <h3 className='title'>
                      {course.name}
                    </h3>
                    <p className='card-path'>{course.learning_path}</p>
                  </div>
                  <ul className='course-stat'>
                    <li>
                      <div className='flex items-center text-xs mr-3'>
                        <Clock size={20} className='mr-[0.5rem]' /> {course.hours_to_study} Jam
                      </div>
                    </li>
                    <li>
                      <div className='flex items-center text-xs mr-3'>
                        <Star size={20} className='mr-[0.5rem]' /> {course.rating}
                      </div>
                    </li>
                    <li>
                      <div className='flex items-center text-xs mr-3'>
                        <BarChart size={20} className='mr-[0.5rem]'/> {course.level}
                      </div>
                    </li>
                  </ul>
                  <div className='flex'>
                  {course.technology.split(",").map(itemTech => (
                    <div className='bg-[#E1F4E8] border-[#52B788] border-2 p-1 mr-2 mt-2 rounded'>
                      <p className='leading-3 text-[#2D6A4F] font-medium'>{itemTech}</p>
                    </div>
                  ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='w-full pl-12'>
        <Carousel className='w-11/12'>
          <CarouselContent>
            <CarouselItem className="basis-1/5 flex justify-center">
              <Link href='/pages/courses'><Button className='w-5/6' variant="ghost">All</Button></Link>
            </CarouselItem>
            <CarouselItem className="basis-1/5 flex justify-center">
              <Link href='/pages/courses/1'><Button className='w-5/6' variant="ghost">Machine Learning</Button></Link>
            </CarouselItem>
            <CarouselItem className="basis-1/5 flex justify-center">
              <Link href='/pages/courses/2'><Button className='w-5/6' variant="ghost">Android</Button></Link>
            </CarouselItem>
            <CarouselItem className="basis-1/5 flex justify-center">
              <Link href='/pages/courses/3'><Button className='w-5/6' variant="ghost">IOS</Button></Link>
            </CarouselItem>
            <CarouselItem className="basis-1/5 flex justify-center">
              <Link href='/pages/courses/4'><Button className='w-5/6' variant="ghost">Multi-Platform App</Button></Link>
            </CarouselItem>
            <CarouselItem className="basis-1/5 flex justify-center">
              <Link href='/pages/courses/5'><Button className='w-5/6' variant="ghost">Data Science</Button></Link>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className='courses min-h-[80vh] shadow-inner rounded-[0.6rem]'>
        <div className='course-wrapper grid grid-cols-3 gap-x-0 gap-y-8 justify-items-center'>
          {courses.courses.map(course => (
            <div key={course.id} className='course course-card mr-5 p-4 w-80 bg-white'>
              <div className='min-h-[70px]'>
                <h3 className='title'>
                  {course.name}
                </h3>
                <p className='card-path'>{course.learning_path}</p>
              </div>
              <ul className='course-stat'>
                <li>
                  <div className='flex items-center text-xs mr-3'>
                    <Clock size={20} className='mr-[0.5rem]' /> {course.hours_to_study} Jam
                  </div>
                </li>
                <li>
                  <div className='flex items-center text-xs mr-3'>
                    <Star size={20} className='mr-[0.5rem]' /> {course.rating}
                  </div>
                </li>
                <li>
                  <div className='flex items-center text-xs mr-3'>
                    <BarChart size={20} className='mr-[0.5rem]'/> {course.level}
                  </div>
                </li>
              </ul>
              <div className='flex'>
              {course.technology.split(",").map(itemTech => (
                <div className='bg-[#E1F4E8] border-[#52B788] border-2 p-1 mr-2 mt-2 rounded'>
                  <p className='leading-3 text-[#2D6A4F] font-medium'>{itemTech}</p>
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CoursePage;