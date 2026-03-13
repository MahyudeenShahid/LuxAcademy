import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, ChevronDown, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_COURSES = [
  {
    id: 1,
    title: "User Experience Design Fundamentals",
    category: "UI/UX DESIGN",
    instructor: "Sarah Mitchell",
    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    sessions: "16 Sessions",
    duration: "4 Weeks",
    level: "Beginner",
    price: "$19.00",
    oldPrice: "$25.00"
  },
  {
    id: 2,
    title: "Introduction to Graphic Design",
    category: "GRAPHIC DESIGN",
    instructor: "Liam Garcia",
    instructorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    sessions: "12 Sessions",
    duration: "3 Weeks",
    level: "Beginner",
    price: "$30.00",
    oldPrice: "$35.00"
  },
  {
    id: 3,
    title: "Frontend Web Development Bootcamp",
    category: "WEB DEVELOPMENT",
    instructor: "Emma Wilson",
    instructorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    sessions: "28 Sessions",
    duration: "12 Weeks",
    level: "Intermediate",
    price: "$30.00",
    oldPrice: "$85.00"
  },
  {
    id: 4,
    title: "Beginner's Guide to Data Analysis",
    category: "DATA SCIENCE",
    instructor: "Noah Robinson",
    instructorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    sessions: "20 Sessions",
    duration: "8 Weeks",
    level: "Beginner",
    price: "$50.00",
    oldPrice: "$85.00"
  },
  {
    id: 5,
    title: "Apple App Development Basics",
    category: "MOBILE DEVELOPMENT",
    instructor: "Olivia Martinez",
    instructorImage: "https://i.pravatar.cc/150?u=5",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    sessions: "20 Sessions",
    duration: "6 Weeks",
    level: "Beginner",
    price: "$40.00",
    oldPrice: "$65.00"
  },
  {
    id: 6,
    title: "Graphic Design Essentials",
    category: "GRAPHIC DESIGN",
    instructor: "Daniel Rivera",
    instructorImage: "https://i.pravatar.cc/150?u=6",
    image: "https://images.unsplash.com/photo-1563240619-44ec0047592c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    sessions: "28 Sessions",
    duration: "10 Weeks",
    level: "Intermediate",
    price: "$20.00",
    oldPrice: "$45.00"
  }
];

const CATEGORIES = ["All", "UI/UX DESIGN", "GRAPHIC DESIGN", "WEB DEVELOPMENT", "DATA SCIENCE", "MOBILE DEVELOPMENT"];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = ALL_COURSES.filter(course => 
    (activeCategory === "All" || course.category === activeCategory) &&
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans selection:bg-violet-600/30 overflow-hidden relative">
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <div className="pt-40 lg:pt-48 pb-16 relative z-10 border-b border-white/5 bg-[#0A051A]/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-violet-500/30 bg-[#120B24] mb-8">
            <span className="text-[9px] font-semibold text-violet-300 tracking-wider uppercase">Course Catalog</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-sm">
            Empower Your Future with <br/><span className="text-violet-500">World-Class Courses</span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed mb-12">
            Join thousands of learners worldwide. High-quality video tutorials, lifetime access, and expert instructors in a single platform.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="What do you want to learn today?"
                className="w-full pl-14 pr-6 py-4 bg-[#120B24] border border-[#2A1B4E] rounded-full focus:border-violet-500 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] outline-none transition-all text-sm font-medium text-white placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button className="flex items-center space-x-2 px-6 py-4 bg-[#120B24] border border-[#2A1B4E] rounded-full text-white text-sm font-semibold hover:border-violet-500 transition-colors">
                <Filter className="h-4 w-4 text-violet-400" />
                <span>Filters</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-4 bg-[#120B24] border border-[#2A1B4E] rounded-full text-white text-sm font-semibold hover:border-violet-500 transition-colors">
                <span>Popularity</span>
                <ChevronDown className="h-4 w-4 text-violet-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 relative z-10 flex flex-col md:flex-row gap-12">
        {/* Sidebar Categories (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-32">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <div className="w-1.5 h-4 bg-violet-600 rounded-full" />
              <span>Categories</span>
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                      activeCategory === category
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                        : "text-slate-400 hover:bg-[#120B24] hover:text-white"
                    }`}
                  >
                    <span>{category}</span>
                    {activeCategory === category && <CheckCircle className="w-4 h-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Categories Mobile Scroll */}
        <div className="md:hidden flex overflow-x-auto pb-4 gap-2 scrollbar-hide -mx-6 px-6">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === category
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : "bg-[#120B24] border border-[#2A1B4E] text-slate-300 hover:border-violet-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="flex-grow pb-32">
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCourses.map((course, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={course.id}
                  className="bg-[#120B24] border border-[#2A1B4E] rounded-[1.5rem] p-4 hover:border-violet-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-600/10 flex flex-col"
                >
                  <div className="relative h-[200px] rounded-[1.3rem] overflow-hidden mb-5">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute top-4 left-4 bg-[#0A051A]/80 backdrop-blur-md text-[9px] font-bold px-3 py-1.5 rounded-lg tracking-widest uppercase border border-white/10 text-slate-200">
                      {course.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#0A051A]/80 backdrop-blur-md text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center space-x-1">
                      <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="px-2 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-4 line-clamp-2 leading-snug group-hover:text-violet-300 transition-colors">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mb-5 text-xs font-medium text-slate-400 bg-white/5 rounded-xl p-3">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-violet-400" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-600" />
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
                        <span>{course.level}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pb-4 border-b border-white/5 mb-4">
                      <div className="flex items-center space-x-3">
                        <img src={course.instructorImage} alt={course.instructor} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                        <span className="text-xs font-medium text-slate-300">{course.instructor}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-1 rounded-lg">
                        {course.sessions}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-white">{course.price}</span>
                        <span className="text-xs text-slate-500 line-through font-medium">{course.oldPrice}</span>
                      </div>
                      <Link to={`/courses/${course.id}`} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors inline-flex cursor-pointer shadow-lg shadow-violet-600/20">
                        View Course
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
