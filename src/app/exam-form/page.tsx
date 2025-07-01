"use client";

import { useEffect, useState } from "react";

interface Question {
  name: string;
  question: string;
  options: string[];
}

export default function ExamForm() {
  const [lockoutMessage, setLockoutMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20 minutes in seconds
  const [isTimeOver, setIsTimeOver] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);

  const handleStartNow = async (): Promise<void> => {
    const emailInput = (
      document.querySelector("input[name='email']") as HTMLInputElement
    )?.value;

    if (!emailInput) {
      alert("Please enter your email before starting.");
      return;
    }

    const res = await fetch("/api/checkLockout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput }),
    });

    const result = await res.json();
    if (result.allowed) {
      setStarted(true);
      setLockoutMessage("");
    } else {
      setLockoutMessage(
        `You have already submitted an exam recently. Please wait ${Math.ceil(
          result.hoursRemaining
        )} hour(s) before reapplying.`
      );
    }
  };

  useEffect(() => {
    const originalScroll = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = originalScroll;
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      setIsTimeOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, started]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const answers: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (
        key !== "name" &&
        key !== "email" &&
        key !== "mobile" &&
        key !== "batch" &&
        key !== "tutor"
      ) {
        answers[key] = value as string;
      }
    }

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      mobile: formData.get("mobile"),
      batch: formData.get("batch"),
      tutor: formData.get("tutor"),
      answers,
    };

    const res = await fetch("/api/submitexam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      if (result.passed) {
        window.location.href = `/exam/success?score=${result.score}&name=${payload.name}`;
      } else {
        window.location.href = `/exam/failure?score=${result.score}&name=${payload.name}`;
      }
    } else {
      alert("Error submitting exam.");
    }
  };

  const questions: Question[] = [
    {
      name: "resin-ingredient",
      question: "What is the primary ingredient in resin used for resin art?",
      options: ["Acrylic paint", "Epoxy resin", "Watercolor", "Clay"],
    },
    {
      name: "epoxy-curing",
      question: "Which component is mixed with epoxy resin to start the curing process?",
      options: ["Water", "Hardener", "Glue", "Alcohol"],
    },
    {
      name: "mixing-ratio",
      question: "What is the recommended mixing ratio for most epoxy resins?",
      options: ["1:1", "2:1", "1:2", "3:1"],
    },
    {
      name: "embed-material",
      question: "Which of the following materials can be safely embedded in resin art?",
      options: ["Fresh flowers", "Dried flowers", "Paper without sealing", "Ice cubes"],
    },
    {
      name: "heat-gun-purpose",
      question: "What is the main purpose of using a heat gun or torch in resin art?",
      options: ["Speed up drying", "Remove air bubbles", "Mix the resin faster", "Harden the resin instantly"],
    },
    {
      name: "jewelry-resin",
      question: "Which type of resin is commonly used for making jewelry?",
      options: ["Polyurethane resin", "Epoxy resin", "UV Resin", "Acrylic resin"],
    },
    {
      name: "resin-skin",
      question: "What should you do if resin spills on your skin?",
      options: ["Rub it off immediately", "Wash with soap and water", "Use a dry cloth to wipe it off", "Ignore it and let it dry"],
    },
    {
      name: "cure-time",
      question: "How long does epoxy resin typically take to cure completely?",
      options: ["30 minutes", "6 hours", "24-72 hours", "1 week", "12 hours"],
    },
    {
      name: "curing-factor",
      question: "Which factor can affect the curing time of epoxy resin?",
      options: ["Humidity", "Temperature", "Mixing ratio", "All of the above"],
    },
    {
      name: "mix-slowly",
      question: "Why is it important to mix resin and hardener slowly?",
      options: ["To prevent excess bubbles", "To speed up curing", "To make the resin softer", "To change the resin color"],
    },
    {
      name: "too-much-pigment",
      question: "What happens if too much pigment is added to resin?",
      options: ["It cures faster", "It becomes sticky and doesn't cure properly", "It turns into foam", "It increases transparency"],
    },
    {
      name: "not-safety",
      question: "Which of the following is NOT a proper safety precaution when working with resin?",
      options: ["Wearing gloves", "Working in a ventilated area", "Eating while working", "Using a respirator mask"],
    },
    {
      name: "prevent-yellowing",
      question: "What is the best way to prevent resin from yellowing over time?",
      options: ["Store it in a humid environment", "Add extra hardener", "Use UV-resistant resin and store artwork away from sunlight", "Keep it in the freezer"],
    },
    {
      name: "sticky-reason",
      question: "If your resin remains sticky even after 72 hours, what is the likely reason?",
      options: ["Incorrect mixing ratio", "Too much heat exposure", "Using a plastic mold", "Adding extra pigment"],
    },
    {
      name: "best-mold",
      question: "Which type of mold works best for epoxy resin art?",
      options: ["Metal molds", "Silicone molds", "Glass molds", "Wood molds"],
    },
  ];

  if (isTimeOver) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="border-2 border-black p-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-black">Time's Up!</h1>
            <p className="text-lg mb-4 text-black">
              You have exceeded the allotted time for this exam.
            </p>
            <p className="font-medium text-black">
              Please contact our team for further assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Resin Art Exam</h1>
          <div className="w-32 h-0.5 bg-black mx-auto"></div>
        </div>

        {/* Timer - Only show when started */}
        {started && (
          <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 text-xl font-mono">
            {formatTime(timeLeft)}
          </div>
        )}

        {/* Instructions */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <div className="space-y-2 text-sm">
            <p>• You have 20 minutes to complete this exam</p>
            <p>• The test will automatically close after the allotted time</p>
            <p>• Ensure stable internet connection</p>
            <p>• Do not refresh or close the browser during the exam</p>
          </div>
          <p className="mt-4 font-medium">Good luck! — Team Proskill</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="border-2 border-black p-6">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "email", "mobile", "batch", "tutor"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {field} *
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    required
                    readOnly={started}
                    className="w-full border-2 border-black px-4 py-2 focus:outline-none bg-white disabled:bg-gray-50"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
            </div>
            
            {lockoutMessage && (
              <div className="mt-4 p-4 border-2 border-black bg-gray-50">
                <p className="font-medium text-black">{lockoutMessage}</p>
              </div>
            )}
            
            {!started && (
              <button
                type="button"
                onClick={handleStartNow}
                className="w-full mt-6 bg-black text-white py-3 px-6 text-lg font-bold hover:bg-gray-800 transition-colors"
              >
                START EXAM
              </button>
            )}
          </div>

          {/* Questions */}
          {started && (
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold mb-6">Questions</h2>
              <div className="space-y-8">
                {questions.map((q, index) => (
                  <div key={q.name} className="border border-black p-6">
                    <h3 className="font-bold text-lg mb-4">
                      {index + 1}. {q.question} <span className="text-red-600">*</span>
                    </h3>
                    <div className="space-y-3">
                      {q.options.map((option, optionIndex) => (
                        <label
                          key={option}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 -m-2"
                        >
                          <input
                            type="radio"
                            name={q.name}
                            value={option}
                            required
                            className="mt-1 h-4 w-4"
                          />
                          <span className="flex-1">
                            {String.fromCharCode(97 + optionIndex)}) {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t-2 border-black">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 px-6 text-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  SUBMIT EXAM
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}