import React from 'react';
import { Star, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';

import { courses } from '@/app/courseList';

const CoursePage = () => {
  return (
    <main >
      <div className='course-header text-3xl h-2/6 mb-3 shadow-inner rounded-[0.6rem]'>
        <button>
          <a href="/pages/courses/preferensi">Isi quiz dulu yuk untuk dapat rekomendasi!</a>
        </button>
      </div>
      <div className='course-path h-[3rem] mb-3 shadow-inner rounded-[0.6rem] w-full inline-flex flex-nowrap'>
        <ul className='flex items-center justify-center md:justify-start [&_img]:max-w-none animate-infinite-scroll'>
          <li><a href="/pages/courses">All</a></li>
          <li><Link href="/pages/courses/1">Machine Learning</Link></li>
          <li><Link href="/pages/courses/2">Android</Link></li>
          <li><Link href="/pages/courses/3" className='active-path'>iOS</Link></li>
          <li><Link href="/pages/courses/4">Multi-Platform App</Link></li>
          <li><Link href="/pages/courses/5">Data Scientist</Link></li>
        </ul>
      </div>
      <div className='courses min-h-[80vh] shadow-inner rounded-[0.6rem]'>
        <div className='course-wrapper grid grid-cols-3 gap-x-0 gap-y-8 justify-items-center'>
          {courses.courses.filter(course => course.learning_path === "iOS Developer").map(course => (
            <div key={course.id} className='course course-card'>
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