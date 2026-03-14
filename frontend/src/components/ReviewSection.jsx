import { useState, useEffect } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCourseReviewsApi, createReviewApi } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";

function StarRating({ value, onChange, size = 24, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={readOnly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-slate-400 w-3 shrink-0">{star}</span>
      <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-amber-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: star * 0.05 }}
        />
      </div>
      <span className="text-slate-500 w-6 text-right shrink-0">{pct}%</span>
    </div>
  );
}

export default function ReviewSection({ courseId, isEnrolled }) {
  const { user } = useAuth();
  const [reviews, setReviews]         = useState([]);
  const [avgRating, setAvgRating]     = useState(0);
  const [loading, setLoading]         = useState(true);
  const [rating, setRating]           = useState(0);
  const [comment, setComment]         = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState("");

  const alreadyReviewed = reviews.some((r) => r.user?._id === user?._id);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getCourseReviewsApi(courseId);
      if (res.success) {
        setReviews(res.reviews);
        setAvgRating(res.avgRating);
      }
      setLoading(false);
    };
    if (courseId) load();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    if (comment.trim().length < 10) { setError("Comment must be at least 10 characters."); return; }
    setError("");
    setSubmitting(true);
    const res = await createReviewApi(courseId, { rating, comment: comment.trim() });
    setSubmitting(false);
    if (res.success) {
      setReviews((prev) => [res.review, ...prev]);
      setAvgRating((prev) => {
        const total = prev * reviews.length + rating;
        return Number((total / (reviews.length + 1)).toFixed(1));
      });
      setSubmitted(true);
    } else {
      setError(res.message || "Failed to submit review.");
    }
  };

  // Star distribution
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  if (loading) {
    return (
      <div className="mt-12 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 rounded-2xl h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold text-white mb-8">
        Student Reviews
      </h2>

      {/* Stats row */}
      {reviews.length > 0 && (
        <div className="bg-[#120B24] border border-[#2A1B4E] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-6 items-center">
          {/* Big average */}
          <div className="text-center shrink-0">
            <p className="text-6xl font-extrabold text-amber-400">{avgRating}</p>
            <StarRating value={Math.round(avgRating)} readOnly size={20} />
            <p className="text-slate-400 text-sm mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
          {/* Distribution bars */}
          <div className="flex-1 w-full space-y-2">
            {dist.map(({ star, count }) => (
              <RatingBar key={star} star={star} count={count} total={reviews.length} />
            ))}
          </div>
        </div>
      )}

      {/* Review form — only for enrolled, logged-in students who haven't reviewed yet */}
      {user && isEnrolled && !alreadyReviewed && !submitted && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#120B24] border border-violet-500/30 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Your Rating</label>
              <StarRating value={rating} onChange={setRating} size={28} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share what you learnt and what you liked about this course..."
                maxLength={1000}
                className="w-full bg-[#0A051A] border border-[#2A1B4E] focus:border-violet-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm resize-none outline-none transition-colors"
              />
              <p className="text-xs text-slate-600 text-right mt-1">{comment.length}/1000</p>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all"
            >
              <Send size={15} />
              {submitting ? "Submitting…" : "Submit Review"}
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Success message */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-8 flex items-center gap-3"
          >
            <CheckCircle className="text-emerald-400 shrink-0" size={20} />
            <p className="text-emerald-300 text-sm font-medium">
              Thank you! Your review has been published.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No reviews yet.</p>
          {isEnrolled && <p className="text-sm mt-1">Be the first to share your experience!</p>}
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0A051A] border border-[#2A1B4E] rounded-2xl p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-violet-500/30 shrink-0">
                  {review.user?.avatar ? (
                    <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-violet-600/30 flex items-center justify-center text-violet-300 text-sm font-bold">
                      {review.user?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-semibold text-white text-sm">{review.user?.name || "Student"}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <StarRating value={review.rating} readOnly size={14} />
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
