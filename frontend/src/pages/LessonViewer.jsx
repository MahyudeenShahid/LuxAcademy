import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle, Circle, PlayCircle, FileText, Menu, X, Award, BookOpen, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getCourseByIdApi } from "../services/courseService";
import { checkEnrollmentApi, updateProgressApi } from "../services/enrollmentService";

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function BlogContent({ content }) {
  if (!content) return null;
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);
  const lines = paragraphs.length > 0 ? paragraphs : [content];
  return (
    <div className="prose prose-invert max-w-none space-y-4">
      {lines.map((para, i) => {
        if (para.startsWith('# ')) {
          return <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{para.slice(2)}</h2>;
        }
        if (para.startsWith('## ')) {
          return <h3 key={i} className="text-xl font-bold text-violet-300 mt-5 mb-2">{para.slice(3)}</h3>;
        }
        if (para.startsWith('- ') || para.startsWith('* ')) {
          const items = para.split('\n').filter(l => l.startsWith('- ') || l.startsWith('* '));
          return (
            <ul key={i} className="space-y-2 list-none">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>{item.slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (para.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-4 border-violet-500 pl-4 italic text-slate-300 bg-violet-500/5 py-2 pr-4 rounded-r-xl">
              {para.slice(2)}
            </blockquote>
          );
        }
        return <p key={i} className="text-slate-300 leading-relaxed">{para}</p>;
      })}
    </div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ['#7c3aed', '#a855f7', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'][i % 6],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: p.left, top: '-8px', background: p.color,
            animation: `fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse]       = useState(null);
  const [lessons, setLessons]     = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  // Completed lesson IDs stored per course in localStorage
  const storageKey = `completed_${courseId}_${user?._id || 'guest'}`;
  const [completedIds, setCompletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    getCourseByIdApi(courseId).then((r) => {
      if (r.success) { setCourse(r.course); setLessons(r.lessons || []); }
      setLoading(false);
    });
    if (user) {
      checkEnrollmentApi(courseId).then((r) => {
        if (r.success) setEnrollment(r.enrollment);
      });
    }
  }, [courseId, user]);

  const currentLesson = lessons.find((l) => l._id === lessonId);
  const currentIndex  = lessons.findIndex((l) => l._id === lessonId);
  const prevLesson    = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson    = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isCompleted   = completedIds.includes(lessonId);
  const completedCount = completedIds.filter((id) => lessons.some((l) => l._id === id)).length;
  const progressPct   = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  const canAccess = currentLesson?.isFree || !!enrollment;

  const handleMarkComplete = useCallback(async () => {
    if (isCompleted) return;
    const newIds = [...new Set([...completedIds, lessonId])];
    setCompletedIds(newIds);
    localStorage.setItem(storageKey, JSON.stringify(newIds));

    const newProgress = Math.round((newIds.filter((id) => lessons.some((l) => l._id === id)).length / lessons.length) * 100);
    if (enrollment?._id) {
      await updateProgressApi(enrollment._id, newProgress);
    }

    if (newProgress >= 100) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 4000);
    } else if (nextLesson) {
      setTimeout(() => navigate(`/learn/${courseId}/lessons/${nextLesson._id}`), 600);
    }
  }, [isCompleted, completedIds, lessonId, enrollment, lessons, nextLesson, courseId, navigate, storageKey]);

  if (loading) {
    return (
      <div className="bg-[#080410] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="bg-[#080410] min-h-screen flex items-center justify-center flex-col gap-4 text-center px-4">
        <BookOpen className="w-16 h-16 text-slate-600" />
        <h2 className="text-2xl font-bold text-white">Lesson not found</h2>
        <p className="text-slate-400">This lesson may have been removed or the link is invalid.</p>
        <Link to={`/courses/${courseId}`} className="mt-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
          Back to Course
        </Link>
      </div>
    );
  }

  // Locked lesson (not enrolled, not free)
  if (!canAccess) {
    return (
      <div className="bg-[#080410] min-h-screen flex items-center justify-center flex-col gap-4 text-center px-4">
        <Lock className="w-16 h-16 text-slate-600" />
        <h2 className="text-2xl font-bold text-white">Lesson Locked</h2>
        <p className="text-slate-400">Enroll in this course to access this lesson.</p>
        <Link to={`/courses/${courseId}`} className="mt-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
          View Course
        </Link>
      </div>
    );
  }

  const ytId = getYouTubeId(currentLesson.videoUrl);

  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans flex flex-col">
      {celebrating && <Confetti />}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#0A051A]/95 backdrop-blur-xl border-b border-white/10 flex items-center px-4 gap-4">
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link to={`/courses/${courseId}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold shrink-0">
          <ChevronLeft className="w-4 h-4" /> {course.title}
        </Link>
        <div className="flex-grow mx-4 hidden md:block">
          <div className="h-2 bg-[#2A1B4E] rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <span className="text-xs font-bold text-violet-400 shrink-0">{progressPct}% complete</span>
      </header>

      <div className="flex pt-14 min-h-screen">
        {/* Sidebar */}
        <aside className={`fixed md:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-80 bg-[#0A051A] border-r border-white/10 overflow-y-auto flex-shrink-0 z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-5">
            <div className="mb-5">
              <h2 className="font-bold text-white text-sm mb-1 truncate">{course.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{completedCount}/{lessons.length} completed</span>
                <div className="flex-grow h-1 bg-[#2A1B4E] rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {lessons.map((lesson, idx) => {
                const done = completedIds.includes(lesson._id);
                const active = lesson._id === lessonId;
                const locked = !lesson.isFree && !enrollment;
                return (
                  <button
                    key={lesson._id}
                    disabled={locked}
                    onClick={() => { navigate(`/learn/${courseId}/lessons/${lesson._id}`); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all text-sm ${
                      active ? 'bg-violet-600/20 border border-violet-500/30 text-white' :
                      locked ? 'opacity-40 cursor-not-allowed text-slate-500' :
                      'hover:bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="shrink-0">
                      {done ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                       locked ? <Lock className="w-4 h-4" /> :
                       <Circle className="w-4 h-4 text-slate-500" />}
                    </span>
                    <span className="flex-grow truncate leading-tight">{idx + 1}. {lesson.title}</span>
                    {lesson.duration && <span className="text-xs text-slate-500 shrink-0">{lesson.duration}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-grow overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span>Lesson {currentIndex + 1} of {lessons.length}</span>
                {currentLesson.isFree && (
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Free</span>
                )}
                {isCompleted && (
                  <span className="bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{currentLesson.title}</h1>
            </div>

            {/* Video */}
            {currentLesson.videoUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden bg-black shadow-2xl">
                {ytId ? (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      className="w-full h-full"
                      title={currentLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video src={currentLesson.videoUrl} controls className="w-full aspect-video" />
                )}
              </div>
            )}

            {/* Blog Content */}
            {currentLesson.content ? (
              <div className="bg-[#0E0725] border border-[#2A1B4E] rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex items-center gap-2 mb-5 text-slate-400 text-sm font-semibold border-b border-white/5 pb-4">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span>Lesson Content</span>
                </div>
                <BlogContent content={currentLesson.content} />
              </div>
            ) : !currentLesson.videoUrl ? (
              <div className="bg-[#0E0725] border border-[#2A1B4E] rounded-2xl p-8 mb-8 text-center">
                <PlayCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No content has been added to this lesson yet.</p>
              </div>
            ) : null}

            {/* Completion Banner */}
            {celebrating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/40 rounded-2xl p-6 text-center"
              >
                <Award className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-white mb-1">Course Complete!</h3>
                <p className="text-slate-300 text-sm">Congratulations! You've completed all lessons. Check your Certificates tab for your award.</p>
              </motion.div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
              {/* Previous */}
              <button
                onClick={() => prevLesson && navigate(`/learn/${courseId}/lessons/${prevLesson._id}`)}
                disabled={!prevLesson}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#2A1B4E] text-slate-400 hover:text-white hover:border-violet-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Lesson
              </button>

              {/* Mark Complete */}
              <AnimatePresence mode="wait">
                {isCompleted ? (
                  <motion.div
                    key="done"
                    initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-sm"
                  >
                    <CheckCircle className="w-5 h-5" /> Completed
                  </motion.div>
                ) : (
                  <motion.button
                    key="mark"
                    onClick={handleMarkComplete}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                  >
                    Mark as Complete
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Next */}
              <button
                onClick={() => nextLesson && navigate(`/learn/${courseId}/lessons/${nextLesson._id}`)}
                disabled={!nextLesson}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#2A1B4E] text-slate-400 hover:text-white hover:border-violet-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold text-sm"
              >
                Next Lesson <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
