"use client";

import { useEffect, useState } from "react";
import { Button } from "antd";
import "antd/dist/reset.css";


// Translations
const translations = {
  en: {
    title: "Mehndi Art Exam",
    timesUp: "Time's Up!",
    timeExceeded: "You have exceeded the allotted time for this exam.",
    contactTeam: "Please contact our team for further assistance.",
    instructions: "Instructions",
    instruction1: "• You have 20 minutes to complete this exam",
    instruction2: "• The test will automatically close after the allotted time",
    instruction3: "• Ensure stable internet connection",
    instruction4: "• Do not refresh or close the browser during the exam",
    instruction5: "• Please make sure your email address is correct, as your certificate will be sent there.",
    goodLuck: "Good luck! — Team Proskill",
    contactInfo: "Contact Information",
    startExam: "START EXAM",
    questions: "Questions",
    submitExam: "SUBMIT EXAM",
    enterField: "Enter your",
    emailRequired: "Please enter your email before starting."
  },
  ml: {
    title: "മെഹന്തി ആർട്ട് പരീക്ഷ",
    timesUp: "സമയം കഴിഞ്ഞു!",
    timeExceeded: "നിങ്ങൾ ഈ പരീക്ഷയ്ക്ക് നിശ്ചിത സമയം കവിഞ്ഞു.",
    contactTeam: "കൂടുതൽ സഹായത്തിനായി ഞങ്ങളുടെ ടീമുമായി ബന്ധപ്പെടുക.",
    instructions: "നിർദ്ദേശങ്ങൾ",
    instruction1: "• ഈ പരീക്ഷ പൂർത്തിയാക്കാൻ നിങ്ങൾക്ക് 20 മിനിറ്റ് സമയമുണ്ട്",
    instruction2: "• നിശ്ചിത സമയത്തിന് ശേഷം ടെസ്റ്റ് സ്വയമേവ അടച്ചുപൂട്ടും",
    instruction3: "• സ്ഥിരമായ ഇന്റർനെറ്റ് കണക്ഷൻ ഉറപ്പാക്കുക",
    instruction4: "• പരീക്ഷ സമയത്ത് ബ്രൗസർ റിഫ്രഷ് ചെയ്യരുത് അല്ലെങ്കിൽ അടയ്ക്കരുത്",
    instruction5: "• നിങ്ങളുടെ സർട്ടിഫിക്കറ്റ് അവിടെ അയയ്ക്കപ്പെടുമെന്നതിനാൽ നിങ്ങളുടെ ഇമെയിൽ വിലാസം ശരിയാണെന്ന് ഉറപ്പാക്കുക.",
    goodLuck: "ആശംസകൾ! — പ്രോസ്കിൽ ടീം",
    contactInfo: "ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ",
    startExam: "പരീക്ഷ ആരംഭിക്കുക",
    questions: "ചോദ്യങ്ങൾ",
    submitExam: "പരീക്ഷ സമർപ്പിക്കുക",
    enterField: "നിങ്ങളുടെ നൽകുക",
    emailRequired: "ആരംഭിക്കുന്നതിന് മുമ്പ് നിങ്ങളുടെ ഇമെയിൽ നൽകുക."
  }
};

interface Question {
  name: string;
  question: string;
  options: string[];
}

export default function MehndiExam() {
  const [lockoutMessage, setLockoutMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);
  const [isTimeOver, setIsTimeOver] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState<"en" | "ml">("en");
  const [list, setList] = useState<Record<string, string[]>>({});
  const t = translations[language];

  const handleStartNow = async (): Promise<void> => {
    const emailInput = (
      document.querySelector("input[name='email']") as HTMLInputElement
    )?.value;

    if (!emailInput) {
      alert(t.emailRequired);
      return;
    }
  useEffect(() => {
  fetch(`/api/tutors?category=${encodeURIComponent("Mehandi Tutor")}`)
    .then(res => res.json())
    .then(data => setList(data));
}, []);


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

  const questionsEN: Question[] = [
    { name: "main-ingredient", question: "What is the main ingredient in traditional mehndi paste?", options: ["Turmeric", "Charcoal", "Henna powder", "Coffee"] },
    { name: "plant-part", question: "Which part of the plant is used to make mehndi?", options: ["Root", "Stem", "Leaf", "Flower"] },
    { name: "mix-to-paste", question: "What is used to mix henna powder into a paste?", options: ["Vinegar", "Water", "Milk", "Butter"] },
    { name: "enhance-color", question: "Which natural ingredient is commonly added to enhance the color of mehndi?", options: ["Lemon juice", "Salt", "Rosewater", "Sugar syrup"] },
    { name: "seal-mehndi", question: "What is used to seal mehndi and keep it moist for better color?", options: ["Nail polish", "Sugar-lemon mixture", "Coconut oil", "Perfume"] },
    { name: "best-duration", question: "How long should mehndi paste be left on the skin for best color?", options: ["30 minutes", "1 hour", "4–6 hours", "15 minutes"] },
    { name: "stain-color", question: "What is the usual color of mehndi stain after removal?", options: ["Black", "Orange to dark brown", "Blue", "Red"] },
    { name: "apply-tool", question: "Which tool is commonly used to apply mehndi designs?", options: ["Brush", "Spoon", "Cone", "Needle"] },
    { name: "eucalyptus-purpose", question: "What is the purpose of adding eucalyptus oil to mehndi?", options: ["To reduce smell", "To lighten the stain", "To darken the color", "To make it dry faster"] },
    { name: "deepen-color", question: "Which ingredient can help deepen the color of dried mehndi?", options: ["Rose water", "Steam from cloves", "Iced water", "Baking soda"] },
    { name: "beginner-pattern", question: "What kind of pattern is typically used in beginner-level mehndi designs?", options: ["Floral patterns", "Animal faces", "Text writing", "3D art"] },
    { name: "color-development", question: "Which of the following affects mehndi color development?", options: ["Loud music", "Nail polish", "Body heat", "Wind"] },
    { name: "avoid-in-cones", question: "Which element should be avoided in cones to prevent skin allergies?", options: ["Essential oils", "Artificial black dye (PPD)", "Lemon juice", "Clove powder"] },
    { name: "sugar-purpose", question: "Why is sugar sometimes added to the mehndi paste itself?", options: ["For fragrance", "To lighten the paste", "To make it thicker", "To help the paste stick better to skin"] },
    { name: "final-color-factor", question: "What can affect the final color of mehndi stain the most?", options: ["Applying water after 5 minutes", "Using a cone instead of brush", "Body temperature and skin type", "Using red henna only"] },
  ];

  const questionsML: Question[] = [
    { name: "main-ingredient", question: "പരമ്പരാഗത മെഹന്തി പേസ്റ്റിന്റെ പ്രധാന ഘടകം ഏതാണ്?", options: ["മഞ്ഞൾ", "ചാർക്കോൾ", "ഹെന്ന പൊടി", "കാപ്പി"] },
    { name: "plant-part", question: "മെഹന്തി ഉണ്ടാക്കാൻ ഉപയോഗിക്കുന്നത് ചെടിയുടെ ഏത് ഭാഗമാണ്?", options: ["വേരു", "തണ്ട്", "ഇല", "പുഷ്പം"] },
    { name: "mix-to-paste", question: "ഹെന്ന പൊടി പേസ്റ്റ് ആക്കാൻ എന്താണ് ഉപയോഗിക്കുന്നത്?", options: ["വിനാഗിരി", "വെള്ളം", "പാലു", "വെണ്ണ"] },
    { name: "enhance-color", question: "മെഹന്തിയുടെ നിറം കൂടുതൽ തിളക്കമുള്ളതാക്കാൻ സാധാരണ ചേർക്കുന്ന പ്രകൃതിദത്ത ഘടകം ഏതാണ്?", options: ["നാരങ്ങാനീർ", "ഉപ്പ്", "റോസ് വാട്ടർ", "പഞ്ചസാര പാനീയം"] },
    { name: "seal-mehndi", question: "മെഹന്തി നന്നായി ചൂടി നിറം പിടിക്കാനായി അത് തിളപ്പിച്ച് വെക്കാൻ ഉപയോഗിക്കുന്നത് എന്താണ്?", options: ["നെൽ പൊളീഷ്", "പഞ്ചസാര-നാരങ്ങാനീർ മിശ്രിതം", "തേങ്ങാ എണ്ണ", "പെർഫ്യൂം"] },
    { name: "best-duration", question: "മെഹന്തിക്ക് മികച്ച നിറം ലഭിക്കാനായി എത്ര നേരം ചർമത്തിൽ വയ്ക്കണം?", options: ["30 മിനിറ്റ്", "1 മണിക്കൂർ", "4–6 മണിക്കൂർ", "15 മിനിറ്റ്"] },
    { name: "stain-color", question: "മെഹന്തി എടുത്തശേഷം സാധാരണയായി കാണുന്ന നിറം ഏതാണ്?", options: ["കറുപ്പ്", "ഓറഞ്ച് മുതൽ ഇരുണ്ട തവിട്ട് വരെ", "നീല", "ചുവപ്പ്"] },
    { name: "apply-tool", question: "മെഹന്തി ഡിസൈൻ വരയ്ക്കാൻ സാധാരണ ഉപയോഗിക്കുന്ന ഉപകരണം ഏതാണ്?", options: ["ബ്രഷ്", "സ്പൂൺ", "കോൺ", "സൂചി"] },
    { name: "eucalyptus-purpose", question: "മെഹന്തിയിൽ യൂക്കലിപ്റ്റസ് ഓയിൽ ചേർക്കുന്ന ഉദ്ദേശം എന്താണ്?", options: ["ഗന്ധം കുറയ്ക്കാൻ", "നിറം ലഘുവാക്കാൻ", "നിറം ഇരുണ്ടതാക്കാൻ", "വേഗത്തിൽ ഉണക്കാൻ"] },
    { name: "deepen-color", question: "ഉണക്കിയ മെഹന്തിയുടെ നിറം കൂടുതൽ ഇരുണ്ടതാക്കാൻ സഹായിക്കുന്ന ഘടകം ഏതാണ്?", options: ["റോസ് വാട്ടർ", "ഗ്രാമ്പു ബാഷ്പം", "തണുത്ത വെള്ളം", "ബേക്കിംഗ് സോഡ"] },
    { name: "beginner-pattern", question: "ആരംഭക ഹാരത്തിൽ സാധാരണ ഉപയോഗിക്കുന്ന മെഹന്തി ഡിസൈൻ മാതൃക ഏതാണ്?", options: ["പുഷ്പ രൂപങ്ങൾ", "മൃഗമുഖങ്ങൾ", "എഴുത്ത്", "3D ആർട്ട്"] },
    { name: "color-development", question: "മെഹന്തിയുടെ നിറവിപുലതയെ ബാധിക്കുന്ന ഘടകം ഏതാണ്?", options: ["വലിയ ശബ്ദം", "നെൽ പൊളീഷ്", "ശരീര താപനില", "കാറ്റ്"] },
    { name: "avoid-in-cones", question: "ചർമം അലർജികൾ ഒഴിവാക്കാൻ കോണുകളിൽ നിന്ന് ഒഴിവാക്കേണ്ട ഘടകം ഏതാണ്?", options: ["ഈശ്വരീയ എണ്ണകൾ", "കൃത്രിമ കറുപ്പ് ഡൈ (PPD)", "നാരങ്ങാനീർ", "ഗ്രാമ്പു പൊടി"] },
    { name: "sugar-purpose", question: "പഞ്ചസാര ചിലപ്പോൾ മെഹന്തി പേസ്റ്റിൽ ചേർക്കുന്നത് എന്തിനാണ്?", options: ["സുഗന്ധം നൽകാൻ", "പേസ്റ്റ് ലളിതമാക്കാൻ", "കട്ടിയാക്കാൻ", "ചർമത്തിൽ മികവോടെ ഒട്ടിക്കാനായി"] },
    { name: "final-color-factor", question: "മെഹന്തിയുടെ അന്തിമ നിറത്തെ ഏറ്റവും അധികം ബാധിക്കുന്ന ഘടകം ഏതാണ്?", options: ["5 മിനിറ്റിനുള്ളിൽ വെള്ളം തേക്കൽ", "ബ്രഷിന്റെ പകരം കോൺ ഉപയോഗിക്കൽ", "ശരീര താപനിലയും ചർമത്തിന്റെ സ്വഭാവവും", "ചുവപ്പ് ഹെന്ന മാത്രം ഉപയോഗിക്കൽ"] },
  ];

  // tutor names  and positions
  const tutors = {
    "Resin Tutors": ["Rishana", "Asna", "Sumayya", "Hamna"],
    "Mehandi Tutor": ["Jasira"],
    "Digital Marketing": ["Brijesh"],
  };

  const currentQuestions = language === "ml" ? questionsML : questionsEN;

  // Malayalam to English mapping for answers
  const mlToEnOptionMap: Record<string, Record<string, string>> = {
    "main-ingredient": { "മഞ്ഞൾ": "Turmeric", "ചാർക്കോൾ": "Charcoal", "ഹെന്ന പൊടി": "Henna powder", "കാപ്പി": "Coffee" },
    "plant-part": { "വേരു": "Root", "തണ്ട്": "Stem", "ഇല": "Leaf", "പുഷ്പം": "Flower" },
    "mix-to-paste": { "വിനാഗിരി": "Vinegar", "വെള്ളം": "Water", "പാലു": "Milk", "വെണ്ണ": "Butter" },
    "enhance-color": { "നാരങ്ങാനീർ": "Lemon juice", "ഉപ്പ്": "Salt", "റോസ് വാട്ടർ": "Rosewater", "പഞ്ചസാര പാനീയം": "Sugar syrup" },
    "seal-mehndi": { "നെൽ പൊളീഷ്": "Nail polish", "പഞ്ചസാര-നാരങ്ങാനീർ മിശ്രിതം": "Sugar-lemon mixture", "തേങ്ങാ എണ്ണ": "Coconut oil", "പെർഫ്യൂം": "Perfume" },
    "best-duration": { "30 മിനിറ്റ്": "30 minutes", "1 മണിക്കൂർ": "1 hour", "4–6 മണിക്കൂർ": "4–6 hours", "15 മിനിറ്റ്": "15 minutes" },
    "stain-color": { "കറുപ്പ്": "Black", "ഓറഞ്ച് മുതൽ ഇരുണ്ട തവിട്ട് വരെ": "Orange to dark brown", "നീല": "Blue", "ചുവപ്പ്": "Red" },
    "apply-tool": { "ബ്രഷ്": "Brush", "സ്പൂൺ": "Spoon", "കോൺ": "Cone", "സൂചി": "Needle" },
    "eucalyptus-purpose": { "ഗന്ധം കുറയ്ക്കാൻ": "To reduce smell", "നിറം ലഘുവാക്കാൻ": "To lighten the stain", "നിറം ഇരുണ്ടതാക്കാൻ": "To darken the color", "വേഗത്തിൽ ഉണക്കാൻ": "To make it dry faster" },
    "deepen-color": { "റോസ് വാട്ടർ": "Rose water", "ഗ്രാമ്പു ബാഷ്പം": "Steam from cloves", "തണുത്ത വെള്ളം": "Iced water", "ബേക്കിംഗ് സോഡ": "Baking soda" },
    "beginner-pattern": { "പുഷ്പ രൂപങ്ങൾ": "Floral patterns", "മൃഗമുഖങ്ങൾ": "Animal faces", "എഴുത്ത്": "Text writing", "3D ആർട്ട്": "3D art" },
    "color-development": { "വലിയ ശബ്ദം": "Loud music", "നെൽ പൊളീഷ്": "Nail polish", "ശരീര താപനില": "Body heat", "കാറ്റ്": "Wind" },
    "avoid-in-cones": { "ഈശ്വരീയ എണ്ണകൾ": "Essential oils", "കൃത്രിമ കറുപ്പ് ഡൈ (PPD)": "Artificial black dye (PPD)", "നാരങ്ങാനീർ": "Lemon juice", "ഗ്രാമ്പു പൊടി": "Clove powder" },
    "sugar-purpose": { "സുഗന്ധം നൽകാൻ": "For fragrance", "പേസ്റ്റ് ലളിതമാക്കാൻ": "To lighten the paste", "കട്ടിയാക്കാൻ": "To make it thicker", "ചർമത്തിൽ മികവോടെ ഒട്ടിക്കാനായി": "To help the paste stick better to skin" },
    "final-color-factor": { "5 മിനിറ്റിനുള്ളിൽ വെള്ളം തേക്കൽ": "Applying water after 5 minutes", "ബ്രഷിന്റെ പകരം കോൺ ഉപയോഗിക്കൽ": "Using a cone instead of brush", "ശരീര താപനിലയും ചർമത്തിന്റെ സ്വഭാവവും": "Body temperature and skin type", "ചുവപ്പ് ഹെന്ന മാത്രം ഉപയോഗിക്കൽ": "Using red henna only" },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);

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
        if (language === "ml" && mlToEnOptionMap[key] && mlToEnOptionMap[key][value as string]) {
          answers[key] = mlToEnOptionMap[key][value as string];
        } else {
          answers[key] = value as string;
        }
      }
    }

    const payload = {
      type: "mehandi",
      name: formData.get("name"),
      email: formData.get("email"),
      mobile: formData.get("mobile"),
      batch: formData.get("batch"),
      tutor: formData.get("tutor"),
      answers,
    };

    const res = await fetch("/api/submitmehandi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      if (result.passed) {
        window.location.href = `/exam/success?score=${result.score}&name=${payload.name}&type=${result.type}`;
      } else {
        window.location.href = `/exam/failure?score=${result.score}&name=${payload.name}`;
      }
    } else {
      alert("Error submitting exam.");
      setSubmitting(false);
    }
  };

  if (isTimeOver) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="border-2 border-black p-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-black">{t.timesUp}</h1>
            <p className="text-lg mb-4 text-black">{t.timeExceeded}</p>
            <p className="font-medium text-black">{t.contactTeam}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Language Switcher */}
      <div className="absolute top-16 left-4 z-10 sm:top-4 sm:left-4">
        <button
          onClick={() => setLanguage(language === "en" ? "ml" : "en")}
          className="px-3 py-1 text-sm border border-black bg-white text-black hover:bg-black hover:text-white transition-colors duration-200"
        >
          {language === "en" ? "മലയാളം" : "English"}
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
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
          <h2 className="text-xl font-bold mb-4">{t.instructions}</h2>
          <div className="space-y-2 text-sm">
            <p>{t.instruction1}</p>
            <p>{t.instruction2}</p>
            <p>{t.instruction3}</p>
            <p>{t.instruction4}</p>
            <p>{t.instruction5}</p>
          </div>
          <p className="mt-4 font-medium">{t.goodLuck}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="border-2 border-black p-6">
            <h2 className="text-xl font-bold mb-6">{t.contactInfo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "email", "mobile", "batch", "tutor"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {field} *
                  </label>

                  {field === "tutor" ? (
                    <select
      name="tutor"
      required
      className="w-full border-2 border-black px-4 py-2 focus:outline-none bg-white disabled:bg-gray-50"
    >
      <option value="">Select Tutor</option>

      {Object.entries(list).map(([category, names]) => (
        <optgroup key={category} label={category}>
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>




                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      required
                      readOnly={started}
                      className="w-full border-2 border-black px-4 py-2 focus:outline-none bg-white disabled:bg-gray-50"
                      placeholder={`${t.enterField} ${field}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {lockoutMessage && (
              <div className="mt-4 p-4 border-2 border-black bg-gray-50">
                <p className="font-medium text-black">{lockoutMessage}</p>
              </div>
            )}

            {!started && (
              <Button
                type="primary"
                onClick={handleStartNow}
                className="w-full"
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  height: 56,
                  fontSize: 20,
                  marginTop: 24,
                }}
              >
                {t.startExam}
              </Button>
            )}
          </div>

          {/* Questions */}
          {started && (
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-bold mb-6">{t.questions}</h2>
              <div className="space-y-8">
                {currentQuestions.map((q, index) => (
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className="w-full"
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    height: 56,
                    fontSize: 20,
                  }}
                >
                  {t.submitExam}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 