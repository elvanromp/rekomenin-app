"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const id_user = 255;

const Rekomendasi: React.FC = () => {
  const [topPaths, setTopPaths] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPaths = async () => {
      try {
        const response = await axios.get(`/api/score?id_user=${id_user}`);
        const userPaths = response.data;
        setTopPaths(userPaths.map((path: { learning_path: string }) => path.learning_path));
      } catch (error) {
        console.error("Error fetching user learning paths:", error);
      }
    };

    fetchUserPaths();
  }, []);

  const handlePathClick = (path: string) => {
    router.push("/pages/courses/skill-assessment");
  };

  return (
    <div className="space-y-6">
      <h1>Rekomendasi Learning Path</h1>
      <div className="grid grid-flow-col auto-cols-max">
        {topPaths.map((path, index) => (
          <button onClick={() => handlePathClick(path)} className="flex bg-[#FAC19E] p-3 mr-4 w-72 items-center justify-between rounded-lg" key={index}>
            <p className="m-0">{path}</p>
            <ArrowRight/>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Rekomendasi;