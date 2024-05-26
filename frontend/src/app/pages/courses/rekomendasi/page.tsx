"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <ul>
        {topPaths.map((path, index) => (
          <li key={index}>
            <button onClick={() => handlePathClick(path)}>{path}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rekomendasi;