import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CreditCard, Lock, CheckCircle, ChevronRight, Shield, Star, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getCourseByIdApi } from "../services/courseService";
import { enrollInCourseApi, checkEnrollmentApi } from "../services/enrollmentService";

function formatCardNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val) {
  const d = val.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
}

export default function Checkout() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse]   = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getCourseByIdApi(courseId).then((r) => {
      if (r.success) { setCourse(r.course); setLessons(r.lessons || []); }
      setLoading(false);
    });
    checkEnrollmentApi(courseId).then((r) => {
      if (r.success && r.isEnrolled) setAlreadyEnrolled(true);
    });
  }, [courseId, user, navigate]);

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    const rawNumber = card.number.replace(/\s/g, '');
    if (rawNumber.length < 16) { setError('Please enter a valid 16-digit card number.'); return; }
    if (!card.expiry.includes('/') || card.expiry.length < 5) { setError('Please enter a valid expiry (MM/YY).'); return; }
    if (card.cvv.length < 3) { setError('Please enter a valid 3-digit CVV.'); return; }
    if (!card.name.trim()) { setError('Please enter the cardholder name.'); return; }

    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1800));
    const result = await enrollInCourseApi(courseId);
    setProcessing(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        if (lessons.length > 0) {
          navigate(`/learn/${courseId}/lessons/${lessons[0]._id}`);
        } else {
          navigate('/dashboard');
        }
      }, 2500);
    } else {
      setError(result.message || 'Payment failed. Please try again.');
    }
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
        Course not found. <Link to="/courses" className="ml-2 text-violet-400">← Back</Link>
      </div>
    );
  }

  if (alreadyEnrolled) {
    return (
      <div className="bg-[#080410] min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#120B24] border border-emerald-500/30 rounded-2xl p-10 text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Already Enrolled</h2>
          <p className="text-slate-400 mb-6">You already have access to this course.</p>
          {lessons.length > 0 ? (
            <Link to={`/learn/${courseId}/lessons/${lessons[0]._id}`}
              className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
              Continue Learning
            </Link>
          ) : (
            <Link to="/dashboard" className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[#080410] min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#120B24] border border-emerald-500/30 rounded-2xl p-10 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full mx-auto flex items-center justify-center mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-slate-400 mb-2">You're now enrolled in</p>
          <p className="text-violet-300 font-bold mb-6">{course.title}</p>
          <p className="text-slate-500 text-sm">Redirecting to your first lesson…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans relative pt-24 pb-16">
      <div className="absolute top-[5%] left-[10%] w-100 h-100 bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-75 h-75 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-8">
          <Link to="/courses" className="hover:text-violet-400 transition-colors">Courses</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/courses/${courseId}`} className="hover:text-violet-400 transition-colors truncate max-w-50">{course.title}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-violet-300">Checkout</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-10">Complete Your Enrollment</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handlePay} className="space-y-5">
              <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-400" /> Payment Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Cardholder Name</label>
                    <input
                      required
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Card Number</label>
                    <div className="relative">
                      <input
                        required
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/60 transition-colors pr-12 tracking-widest font-mono"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Expiry Date</label>
                      <input
                        required
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/60 transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">CVV</label>
                      <input
                        required
                        type="password"
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/60 transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-70 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ${course.price?.toFixed(2)} &amp; Enroll
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>256-bit SSL encryption. Your payment is secure.</span>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden sticky top-28">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#120B24] to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-white text-lg mb-1 leading-snug">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-4">by {course.instructor?.name || 'Instructor'}</p>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 flex-wrap">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration || 'Self-paced'}</span>
                  <span className="flex items-center gap-1 capitalize"><Award className="w-3 h-3" /> {course.level}</span>
                  <span>{lessons.length} lessons</span>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Course price</span>
                    <span>${course.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-lg pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-violet-300">${course.price?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <p className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> Full lifetime access</p>
                  <p className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> Certificate of completion</p>
                  <p className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> Access on all devices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
