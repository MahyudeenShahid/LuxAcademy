import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Clock, Award, PlayCircle, FileText, CheckCircle, ChevronRight, ChevronDown, ChevronUp, User, Share2, Heart, MonitorPlay, Lock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getCourseByIdApi } from "../services/courseService";
import { enrollInCourseApi, checkEnrollmentApi } from "../services/enrollmentService";

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function VideoPlayer({ url }) {
  if (!url) return null;
  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mt-4">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
          title="Lesson video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mt-4">
      <video src={url} controls className="w-full h-full" />
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    getCourseByIdApi(id).then((result) => {
      if (result.success) {
        setCourse(result.course);
        setLessons(result.lessons || []);
        setEnrollmentCount(result.enrollmentCount || 0);
      }
      setLoading(false);
    });
    if (user) {
      checkEnrollmentApi(id).then((result) => {
        if (result.success) setIsEnrolled(result.isEnrolled);
      });
    }
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    // Paid course → go to checkout
    if (course.price > 0) { navigate(`/checkout/${id}`); return; }
    // Free course → enroll directly
    setEnrolling(true);
    const result = await enrollInCourseApi(id);
    if (result.success) {
      setIsEnrolled(true);
      setEnrollMsg('Enrolled successfully!');
    } else {
      setEnrollMsg(result.message || 'Enrollment failed.');
    }
    setEnrolling(false);
  };

  if (loading) {
    return (
      <div className="bg-[#080410] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-[#080410] min-h-screen flex items-center justify-center text-slate-400">
        Course not found. <Link to="/courses" className="ml-2 text-violet-400">← Back to Courses</Link>
      </div>
    );
  }

  const formatPrice = (price) => price === 0 ? "Free" : `$${price.toFixed(2)}`;

  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans selection:bg-violet-600/30 overflow-hidden relative pb-24">
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="pt-32 lg:pt-40 pb-32 relative z-10 border-b border-white/5 bg-[#0A051A]/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/courses" className="hover:text-violet-400 transition-colors">Courses</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-slate-500">{course.category}</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-violet-300 truncate max-w-[200px]">{course.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-violet-500/30 bg-[#120B24]">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[9px] font-bold text-violet-300 tracking-wider uppercase">{course.category}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-sm">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">{course.description}</p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-medium text-slate-300">
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl">
                  <div className="flex text-amber-400 flex-shrink-0">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
                  </div>
                  <span className="text-white font-bold">4.9</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl">
                  <User className="h-4 w-4 text-violet-400" />
                  <span>{enrollmentCount.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl">
                  <Award className="h-4 w-4 text-fuchsia-400" />
                  <span className="capitalize">{course.level} Level</span>
                </div>
                {course.duration && (
                  <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>{course.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center space-x-4">
                  <img
                    src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
                    alt={course.instructor?.name}
                    className="w-14 h-14 rounded-full border-2 border-[#2A1B4E] object-cover ring-2 ring-violet-500/20"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Lead Instructor</p>
                    <p className="text-white font-bold text-lg hover:text-violet-400 transition-colors cursor-pointer">{course.instructor?.name}</p>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-3">
                  <button className="w-10 h-10 rounded-full bg-[#120B24] border border-[#2A1B4E] flex items-center justify-center text-slate-300 hover:text-pink-500 hover:border-pink-500/50 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#120B24] border border-[#2A1B4E] flex items-center justify-center text-slate-300 hover:text-white hover:border-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#120B24] rounded-3xl p-8 border border-[#2A1B4E] shadow-xl shadow-black/50">
              <h2 className="text-2xl font-bold text-white mb-6">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Practical, industry-relevant skills and techniques.",
                  "Build real projects from scratch.",
                  "Best practices used by professional developers.",
                  "How to debug and solve complex problems.",
                  "Deploy and share your work with the world.",
                  "Grow a professional portfolio.",
                ].map((item, i) => (
                  <div key={i} className="flex space-x-3">
                    <CheckCircle className="h-6 w-6 text-violet-500 shrink-0" />
                    <span className="text-slate-300 font-medium text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Curriculum */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#120B24] rounded-3xl p-8 border border-[#2A1B4E] shadow-xl shadow-black/50">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Course Curriculum</h2>
                  <p className="text-slate-400 text-sm font-medium">{lessons.length} Lessons</p>
                </div>
              </div>
              <div className="space-y-4">
                {lessons.length > 0 ? lessons.map((lesson, i) => {
                  const isOpen = selectedLesson === lesson._id;
                  const canWatch = lesson.isFree || isEnrolled;
                  return (
                    <div
                      key={lesson._id}
                      className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? 'border-violet-500/60 bg-[#1A103C]/70' : 'border-[#2A1B4E] bg-[#0A051A]/50 hover:border-violet-500/50 hover:bg-[#1A103C]/50'}`}
                    >
                      <button
                        onClick={() => setSelectedLesson(isOpen ? null : lesson._id)}
                        className="w-full flex justify-between items-center p-5 group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0">{i + 1}</span>
                          <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors text-sm">{lesson.title}</h3>
                          {lesson.isFree && <span className="text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded shrink-0">Free</span>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          {lesson.duration && <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration}</span>}
                          {canWatch
                            ? <PlayCircle className="h-4 w-4 text-violet-400" />
                            : <Lock className="h-4 w-4 text-slate-500" />
                          }
                          {isOpen ? <ChevronUp className="h-4 w-4 text-violet-400" /> : <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-violet-400 transition-colors" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5">
                              {canWatch ? (
                                <div className="space-y-4">
                                  {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}
                                  {lesson.content && (
                                    <div className="mt-3 p-4 rounded-xl bg-[#0A051A]/70 border border-[#2A1B4E]">
                                      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{lesson.content}</p>
                                    </div>
                                  )}
                                  {!lesson.videoUrl && !lesson.content && (
                                    <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-[#0A051A]/70 border border-[#2A1B4E] text-slate-400 text-sm">
                                      <FileText className="w-5 h-5 text-violet-400 shrink-0" />
                                      <span>No content added yet. Check back later.</span>
                                    </div>
                                  )}
                                  {isEnrolled && (
                                    <Link
                                      to={`/learn/${id}/lessons/${lesson._id}`}
                                      className="mt-2 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                                    >
                                      <ExternalLink className="w-4 h-4" /> Open Full Lesson
                                    </Link>
                                  )}
                                </div>
                              ) : (
                                <div className="mt-4 flex flex-col items-center gap-3 p-6 rounded-xl bg-[#0A051A]/70 border border-[#2A1B4E] text-center">
                                  <Lock className="w-8 h-8 text-slate-500" />
                                  <p className="text-slate-400 text-sm font-medium">Enroll in this course to unlock this lesson.</p>
                                  <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="mt-1 px-6 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-all"
                                  >
                                    {enrolling ? 'Processing…' : user ? (course.price > 0 ? `Enroll for $${course.price}` : 'Enroll Free') : 'Login to Enroll'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }) : (
                  // Fallback skeleton modules when no lessons from API
                  [
                    { title: "Module 1: Getting Started", duration: "2h 45m", lessons: 8 },
                    { title: "Module 2: Core Concepts", duration: "3h 15m", lessons: 10 },
                    { title: "Module 3: Advanced Techniques", duration: "2h 30m", lessons: 7 },
                    { title: "Module 4: Real-World Projects", duration: "4h 00m", lessons: 12 },
                  ].map((mod, i) => (
                    <div key={i} className="border border-[#2A1B4E] bg-[#0A051A]/50 rounded-2xl p-5 hover:border-violet-500/50 hover:bg-[#1A103C]/50 transition-all cursor-pointer group">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors text-base">{mod.title}</h3>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-violet-400" />
                        </div>
                      </div>
                      <div className="flex space-x-4 text-xs font-semibold text-slate-400 tracking-wide uppercase">
                        <span className="flex items-center space-x-1.5"><MonitorPlay className="h-4 w-4 text-violet-500" /><span>{mod.lessons} Lessons</span></span>
                        <span className="flex items-center space-x-1.5"><Clock className="h-4 w-4 text-violet-500" /><span>{mod.duration}</span></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Floating Action Card */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#120B24] rounded-3xl shadow-2xl border border-[#2A1B4E] overflow-hidden sticky top-32 z-50">
              <div className="relative h-56 bg-[#080410] flex items-center justify-center group cursor-pointer overflow-hidden p-2">
                <div className="w-full h-full rounded-[1.25rem] overflow-hidden relative">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'}
                    alt="Course Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-violet-600/90 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500 transition-all shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                      <PlayCircle className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                    <span className="text-white font-bold text-xs tracking-widest uppercase bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">Preview Course</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-end space-x-3 mb-6">
                  <div className="text-4xl font-bold text-white">{formatPrice(course.price)}</div>
                </div>

                {enrollMsg && (
                  <p className={`text-sm font-semibold mb-4 ${enrollMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{enrollMsg}</p>
                )}

                {isEnrolled ? (
                  <>
                    <div className="w-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-center mb-3">
                      ✓ Already Enrolled
                    </div>
                    {lessons.length > 0 && (
                      <Link
                        to={`/learn/${id}/lessons/${lessons[0]._id}`}
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all text-center block mb-4"
                      >
                        Continue Learning →
                      </Link>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] mb-4"
                  >
                    {enrolling ? 'Processing…'
                     : !user ? 'Login to Enroll'
                     : course.price > 0 ? `Enroll for $${course.price.toFixed(2)}`
                     : 'Enroll Free'}
                  </button>
                )}
                <button className="w-full bg-transparent hover:bg-[#1A103C] text-white border border-[#2A1B4E] py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-colors">
                  Add to Wishlist
                </button>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">This course includes:</h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-400">
                    <li className="flex items-center space-x-4"><MonitorPlay className="h-5 w-5 text-violet-400" /><span>{lessons.length || '20+'} on-demand lessons</span></li>
                    <li className="flex items-center space-x-4"><FileText className="h-5 w-5 text-violet-400" /><span>Downloadable resources</span></li>
                    <li className="flex items-center space-x-4"><Award className="h-5 w-5 text-violet-400" /><span>Certificate of completion</span></li>
                    <li className="flex items-center space-x-4"><Clock className="h-5 w-5 text-violet-400" /><span>Full lifetime access</span></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
