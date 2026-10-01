import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ReviewsPanel() {
  const { t } = useLanguage();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    total_reviews: 0,
    average_rating: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const storedUser =
        localStorage.getItem("bf_user") ||
        localStorage.getItem("user");

      if (!storedUser) {
        setReviews([]);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user?.id) {
        setReviews([]);
        return;
      }

      const response = await API.get(`/reviews/cook/${user.id}`);

      const data = response.data?.data || {};

      setReviews(data.reviews || []);
      setStats({
        total_reviews: Number(data.stats?.total_reviews || 0),
        average_rating: Number(data.stats?.average_rating || 0),
      });
    } catch (error) {
      console.error("Load cook reviews error:", error);
      setReviews([]);
      setStats({
        total_reviews: 0,
        average_rating: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const ratingDistribution = useMemo(() => {
    const total = reviews.length;

    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter(
        (review) => Number(review.rating) === star
      ).length;

      return {
        star,
        count,
        percent: total > 0 ? (count / total) * 100 : 0,
      };
    });
  }, [reviews]);

  const fiveStarPercentage =
    reviews.length > 0
      ? (ratingDistribution.find((item) => item.star === 5)?.count || 0) /
        reviews.length *
        100
      : 0;

  const latestRating =
    reviews.length > 0 ? Number(reviews[0].rating || 0) : 0;

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
          border: "1px solid rgba(201, 162, 39, 0.2)",
        }}
      >
        <div className="text-center md:border-l border-gold/10 md:pl-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
            style={{
              background: "linear-gradient(135deg, #C9A227, #F5D76E)",
            }}
          >
            <Award size={32} style={{ color: "#0F2419" }} />
          </div>

          <p className="font-cairo text-5xl font-bold text-gradient-gold mb-1">
            {Number(stats.average_rating || 0).toFixed(1)}
          </p>

          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={
                  star <= Math.round(stats.average_rating)
                    ? "#F5D76E"
                    : "transparent"
                }
                color="#F5D76E"
              />
            ))}
          </div>

          <p
            className="font-tajawal text-sm"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {stats.total_reviews} {t("تقييم", "reviews")}
          </p>
        </div>

        <div className="md:col-span-2 space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.star} className="flex items-center gap-3">
              <span
                className="font-cairo text-sm w-8"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {item.star} ★
              </span>

              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 * (5 - item.star),
                  }}
                  className="h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #C9A227, #F5D76E)",
                  }}
                />
              </div>

              <span
                className="font-cairo text-xs w-10 text-left"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            value: Number(stats.average_rating || 0).toFixed(1),
            en: "Average Rating",
            ar: "متوسط التقييم",
          },
          {
            value: stats.total_reviews,
            en: "Total Reviews",
            ar: "إجمالي التقييمات",
          },
          {
            value: `${fiveStarPercentage.toFixed(0)}%`,
            en: "5-Star Reviews",
            ar: "تقييمات 5 نجوم",
          },
          {
            value: latestRating ? `${latestRating}/5` : "-",
            en: "Latest Rating",
            ar: "آخر تقييم",
          },
        ].map((item) => (
          <motion.div
            key={item.en}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
              border: "1px solid rgba(201, 162, 39, 0.2)",
            }}
          >
            <div className="text-3xl mb-2">
              {item.en === "Average Rating" ? "★" : ""}
            </div>

            <p className="font-cairo text-2xl font-bold text-gradient-gold mb-1">
              {item.value}
            </p>

            <p
              className="font-tajawal text-xs"
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              {t(item.ar, item.en)}
            </p>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="font-ruqaa text-2xl text-gradient-gold mb-4 flex items-center gap-2">
          <MessageSquare size={24} />
          {t("آخر التقييمات", "Recent Reviews")}
        </h3>

        {loading ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
            }}
          >
            {t("جاري تحميل التقييمات...", "Loading reviews...")}
          </div>
        ) : reviews.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
              border: "1px solid rgba(201, 162, 39, 0.2)",
            }}
          >
            <MessageSquare
              size={40}
              className="mx-auto mb-3 opacity-50"
            />

            <p>
              {t(
                "لا توجد تقييمات لهذا الطباخ حالياً",
                "No reviews for this cook yet"
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl p-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
                  border: "1px solid rgba(201, 162, 39, 0.2)",
                }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #C9A227, #F5D76E)",
                      color: "#0F2419",
                    }}
                  >
                    {(review.customer_name || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          className="font-tajawal font-bold text-base"
                          style={{ color: "#FFFFFF" }}
                        >
                          {review.customer_name || "-"}
                        </h4>

                        <p
                          className="font-tajawal text-xs mt-0.5"
                          style={{
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {review.meal_name || "-"} •{" "}
                          {formatDate(review.created_at)}
                        </p>
                      </div>

                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={
                              star <= Number(review.rating)
                                ? "#F5D76E"
                                : "transparent"
                            }
                            color="#F5D76E"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p
                  className="font-tajawal text-sm leading-relaxed"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {review.comment || t("بدون تعليق", "No comment")}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
