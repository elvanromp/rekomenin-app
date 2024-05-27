"use client";

import React, { useEffect, useState } from 'react';
import { Star, Clock, BarChart } from 'lucide-react';
import { courses } from '@/app/courseList';

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
      <div className='course-header text-3xl h-2/6 mb-3 shadow-inner rounded-[0.6rem]'>
        {!selectedPath && (
          <button>
            <a href="/pages/courses/preferensi">Isi quiz dulu yuk untuk dapat rekomendasi!</a>
          </button>
        )}
        {selectedPath && (
          <div className='recommended-courses p-5'>
            <h2 className='mb-3'>Rekomendasi Courses:</h2>
            <div className='grid grid-flow-col auto-cols-max'>
              {recommendedCourses.map(course => (
                <div key={course.id} className='course course-card mr-5'>
                  <h2 className='title'>
                    {course.name}
                  </h2>
                  <ul className='course-stat'>
                    <li><Clock size={20} className='mr-[0.5rem]' /> {course.hours_to_study} Jam</li>
                    <li><Star size={20} className='mr-[0.5rem]' /> {course.rating}</li>
                    <li><BarChart size={20} className='mr-[0.5rem]'/> {course.level}</li>
                  </ul>
                  <p>{course.learning_path}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='course-path h-[3rem] mb-3 shadow-inner rounded-[0.6rem] w-full inline-flex flex-nowrap'>
        <ul className='flex items-center justify-center md:justify-start [&_img]:max-w-none animate-infinite-scroll'>
          <li><a href="/pages/courses" className='active-path'>All</a></li>
          <li><a href="/pages/courses/1">Machine Learning</a></li>
          <li><a href="/pages/courses/2">Android</a></li>
          <li><a href="/pages/courses/3">iOS</a></li>
          <li><a href="/pages/courses/4">Multi-Platform App</a></li>
          <li><a href="/pages/courses/5">Data Scientist</a></li>
        </ul>
      </div>
      <div className='courses min-h-[80vh] shadow-inner rounded-[0.6rem]'>
        <div className='course-wrapper grid grid-cols-3 gap-x-0 gap-y-8 justify-items-center'>
          {courses.courses.map(course => (
            <div key={course.id} className='course course-card w-[90%]'>
              <h2 className='title'>
                {course.name}
              </h2>
              <ul className='course-stat'>
                <li><Clock size={20} className='mr-[0.5rem]' /> {course.hours_to_study} Jam</li>
                <li><Star size={20} className='mr-[0.5rem]' /> {course.rating}</li>
                <li><BarChart size={20} className='mr-[0.5rem]'/> {course.level}</li>
              </ul>
              <p>{course.learning_path}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CoursePage;