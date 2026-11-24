import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Short Films", "Music Videos", "Advertisements", "Motion Graphics"];

const projects = [
  {
    id: 1,
    title: "Neon Nights",
    category: "Music Videos",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "A high-energy music video."
  },
  {
    id: 2,
    title: "Urban Flow",
    category: "Advertisements",
    video: "https://www.w3schools.com/html/movie.mp4",
    description: "Dynamic commercial edit."
  },
  {
    id: 3,
    title: "The Journey",
    category: "Short Films",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Landscape documentary."
  },
  {
    id: 4,
    title: "Tech Review",
    category: "Motion Graphics",
    video: "https://www.w3schools.com/html/movie.mp4",
    description: "Fast paced tech review."
  }
];

export default function FeaturedWork() {

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const visibleCount = 3;
  const maxIndex = Math.max(0, filteredProjects.length - visibleCount);

  const visibleProjects = filteredProjects.slice(
    carouselIndex,
    carouselIndex + visibleCount
  );

  return (
    <section className="py-32 px-6 bg-background" id="work">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold mb-10">
          Featured <span className="text-gradient">Work</span>
        </h2>

        {/* categories */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCarouselIndex(0);
              }}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-secondary-bg text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">

          <button
            onClick={() => setCarouselIndex((i) => Math.max(i - 1, 0))}
            disabled={carouselIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {visibleProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.05 }}
                className="bg-secondary-bg rounded-xl overflow-hidden"
              >

                <video
                  src={project.video}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-gray-400 text-sm mt-2">
                    {project.description}
                  </p>
                </div>

              </motion.div>
            ))}

          </div>

          <button
            onClick={() => setCarouselIndex((i) => Math.min(i + 1, maxIndex))}
            disabled={carouselIndex === maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <ChevronRight size={32} />
          </button>

        </div>
      </div>
    </section>
  );
}