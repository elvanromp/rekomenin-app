"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from 'lucide-react';

const Rekomendasi: React.FC = () => {
  const [topPaths, setTopPaths] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("scores") || "{}");
    const sortedPaths = Object.keys(scores).sort((a, b) => scores[b] - scores[a]).slice(0, 3);
    setTopPaths(sortedPaths);
  }, []);

  const handlePathClick = (path: string) => {
    localStorage.setItem("selectedPath", path);
    router.push("/pages/courses");
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