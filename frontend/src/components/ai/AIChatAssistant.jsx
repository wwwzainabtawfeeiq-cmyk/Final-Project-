import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ChefHat,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";

const QUICK_SUGGESTIONS = [
  {
    ar: "اقترح أفكارًا للعشاء",
    en: "Suggest dinner ideas",
  },
  {
    ar: "أريد شيئًا حارًا",
    en: "I want something spicy",
  },
  {
    ar: "ما هي أشهر أطباق البصرة؟",
    en: "What are famous Basra dishes?",
  },
  {
    ar: "اقترح حلويات",
    en: "Suggest sweets",
  },
];

export default function AIChatAssistant() {
  const { t, lang } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          role: "ai",
          text: t(
            "مرحبًا بك في نكهة البصرة! أنا مساعدك الذكي، وجاهز لمساعدتك في اختيار أفضل أطباق البصرة. كيف يمكنني مساعدتك اليوم؟",
            "Welcome to Basra Flavor! I am your smart assistant, ready to help you choose the best Basra dishes. How can I help you today?"
          ),
        },
      ]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const getAIResponse = async (userText) => {
    try {
      const response = await API.get("/smart-search/smart", {
        params: {
          q: userText,
        },
      });

      const payload = response.data || {};
      const results = Array.isArray(payload.data)
        ? payload.data
        : [];

      if (results.length === 0) {
        return lang === "ar"
          ? "لم أجد أطباقًا مطابقة لطلبك حاليًا. جرّب البحث باسم طبق أو مكوّن أو سعر، مثل: برياني أو رز أو 10 آلاف."
          : "I couldn't find dishes matching your request right now. Try searching by dish, ingredient, or price, such as biryani, rice, or 10k.";
      }

      const topResults = results.slice(0, 5);

      const lines = topResults.map((meal, index) => {
        const price = Number(meal.price || 0).toLocaleString("en-US");

        return `${index + 1}. ${meal.name} — ${price} ${lang === "ar" ? "د.ع" : "IQD"}`;
      });

      if (lang === "ar") {
        return `وجدت ${results.length} طبقًا مناسبًا لبحثك:\n${lines.join("\n")}`;
      }

      return `I found ${results.length} dish${
        results.length === 1 ? "" : "es"
      } matching your search:\n${lines.join("\n")}`;
    } catch (error) {
      console.error("AI assistant search error:", error);

      return lang === "ar"
        ? "حدث خطأ أثناء البحث عن الأطباق. حاول مرة أخرى."
        : "Something went wrong while searching for dishes. Please try again.";
    }
  };

  const handleSend = async (text) => {
    const messageText = text || input.trim();

    if (!messageText || isTyping) {
      return;
    }

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(messageText);

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: aiResponse,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setIsOpen(false);

    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 1,
          type: "spring",
          stiffness: 200,
        }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[80] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #C9A227, #F5D76E)",
          boxShadow: "0 10px 40px rgba(201, 162, 39, 0.5)",
        }}
      >
        <MessageCircle
          size={28}
          style={{ color: "#0F2419" }}
        />

        <motion.span
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{
            background: "#ef4444",
            color: "#FFFFFF",
          }}
        >
          AI
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 50,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 50,
            }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 250,
            }}
            className="fixed bottom-6 left-6 z-[90] w-[calc(100vw-3rem)] max-w-md rounded-3xl overflow-hidden flex flex-col"
            style={{
              height: "600px",
              maxHeight: "calc(100vh - 3rem)",
              background:
                "linear-gradient(135deg, #0F2419 0%, #1B4332 100%)",
              border:
                "2px solid rgba(201, 162, 39, 0.4)",
              boxShadow:
                "0 25px 80px rgba(201, 162, 39, 0.3)",
            }}
          >
            <div
              className="p-5 flex items-center justify-between"
              style={{
                borderBottom:
                  "1px solid rgba(201, 162, 39, 0.2)",
                background:
                  "rgba(201, 162, 39, 0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center relative"
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A227, #F5D76E)",
                  }}
                >
                  <Sparkles
                    size={22}
                    style={{ color: "#0F2419" }}
                  />

                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
                    style={{
                      background: "#22c55e",
                      borderColor: "#0F2419",
                    }}
                  />
                </div>

                <div>
                  <h3 className="font-ruqaa text-xl text-gradient-gold">
                    {t(
                      "مساعد نكهة البصرة",
                      "Basra Flavor Assistant"
                    )}
                  </h3>

                  <p
                    className="font-tajawal text-[10px]"
                    style={{
                      color: "#22c55e",
                    }}
                  >
                    <span aria-hidden="true">●</span>{" "}
                    {t("متصل الآن", "Online now")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  title={t(
                    "محادثة جديدة",
                    "New chat"
                  )}
                >
                  <Trash2
                    size={16}
                    style={{
                      color:
                        "rgba(255, 255, 255, 0.6)",
                    }}
                  />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X
                    size={18}
                    style={{
                      color: "#F5D76E",
                    }}
                  />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-start flex-row-reverse"
                      : "justify-start"
                  } gap-2`}
                >
                  {msg.role === "ai" && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #C9A227, #F5D76E)",
                      }}
                    >
                      <ChefHat
                        size={14}
                        style={{
                          color: "#0F2419",
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="rounded-2xl px-4 py-3 max-w-[85%]"
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #C9A227, #F5D76E)"
                          : "rgba(255, 255, 255, 0.08)",
                      color:
                        msg.role === "user"
                          ? "#0F2419"
                          : "#FFFFFF",
                      border:
                        msg.role === "ai"
                          ? "1px solid rgba(201, 162, 39, 0.2)"
                          : "none",
                    }}
                  >
                    <p className="font-tajawal text-sm leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex gap-2 items-end"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #C9A227, #F5D76E)",
                    }}
                  >
                    <ChefHat
                      size={14}
                      style={{
                        color: "#0F2419",
                      }}
                    />
                  </div>

                  <div
                    className="rounded-2xl px-4 py-3 flex gap-1"
                    style={{
                      background:
                        "rgba(255, 255, 255, 0.08)",
                      border:
                        "1px solid rgba(201, 162, 39, 0.2)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#F5D76E",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.length <= 1 && !isTyping && (
                <div className="pt-4">
                  <p
                    className="font-tajawal text-xs mb-3 text-center"
                    style={{
                      color:
                        "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {t(
                      "جرّب أحد هذه الاقتراحات:",
                      "Try one of these:"
                    )}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_SUGGESTIONS.map(
                      (suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.1 * index,
                          }}
                          onClick={() =>
                            handleSend(
                              lang === "ar"
                                ? suggestion.ar
                                : suggestion.en
                            )
                          }
                          className="p-3 rounded-xl font-tajawal text-xs transition-all hover:scale-105 text-right"
                          style={{
                            background:
                              "rgba(201, 162, 39, 0.08)",
                            border:
                              "1px solid rgba(201, 162, 39, 0.25)",
                            color: "#FFFFFF",
                          }}
                        >
                          {lang === "ar"
                            ? suggestion.ar
                            : suggestion.en}
                        </motion.button>
                      )
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div
              className="p-4"
              style={{
                borderTop:
                  "1px solid rgba(201, 162, 39, 0.2)",
              }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder={t(
                    "اسألني عن أي وجبة...",
                    "Ask me about any dish..."
                  )}
                  style={{
                    color: "#FFFFFF",
                    backgroundColor:
                      "rgba(255, 255, 255, 0.08)",
                    border:
                      "1px solid rgba(201, 162, 39, 0.35)",
                    borderRadius: "999px",
                    padding: "12px 18px",
                    width: "100%",
                    fontFamily:
                      "Tajawal, sans-serif",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={
                    !input.trim() || isTyping
                  }
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105 disabled:opacity-40"
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A227, #F5D76E)",
                  }}
                >
                  <Send
                    size={18}
                    style={{
                      color: "#0F2419",
                    }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
