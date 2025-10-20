"use client";

import { useEffect, useState } from "react";
import { Button } from "antd"; // Import Ant Design Button
import "antd/dist/reset.css"; // Import Ant Design styles if not already

// Translations
const translations = {
  en: {
    title: "Resin Art Exam",
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
    title: "റെസിൻ ആർട്ട് പരീക്ഷ",
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
    enterField: "നിങ്ങളുടെ ",
    emailRequired: "ആരംഭിക്കുന്നതിന് മുമ്പ് നിങ്ങളുടെ ഇമെയിൽ നൽകുക."
  }
};

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

    useEffect(() => {
    async function loadTutors() {
      try {
        const data = await fetchTutorsByCategory("Resin Tutors");
        setList(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadTutors();
  }, []);

   const fetchTutorsByCategory = async (category: string) => {
    const res = await fetch(`/api/tutors?category=${encodeURIComponent(category)}`);
    if (!res.ok) {
      throw new Error("Failed to fetch tutors");
    }
    return res.json(); // { "Mehandi Tutor": ["Jasira"] }
  };
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Mapping from Malayalam options to English for each question
  const mlToEnOptionMap: Record<string, Record<string, string>> = {
    "resin-ingredient": {
      "ആക്രിലിക് പെയിന്റ്": "Acrylic paint",
      "എപ്പോക്സി റെസിൻ": "Epoxy resin",
      "വാട്ടർകളർ": "Watercolor",
      "ക്ലേ": "Clay",
    },
    "epoxy-curing": {
      "വെള്ളം": "Water",
      "ഹാർഡനർ": "Hardener",
      "ഗ്ലൂ": "Glue",
      "ആൽക്കഹോൾ": "Alcohol",
    },
    "mixing-ratio": {
      "1:1": "1:1",
      "2:1": "2:1",
      "1:2": "1:2",
      "3:1": "3:1",
    },
    "embed-material": {
      "പുതിയ പൂക്കൾ": "Fresh flowers",
      "ഉണങ്ങിയ പൂക്കൾ": "Dried flowers",
      "സീലിംഗ് ഇല്ലാത്ത പേപ്പർ": "Paper without sealing",
      "ഐസ് ക്യൂബുകൾ": "Ice cubes",
    },
    "heat-gun-purpose": {
      "ഉണക്കൽ വേഗത്തിലാക്കാൻ": "Speed up drying",
      "വായു കുമിളകൾ നീക്കം ചെയ്യുക": "Remove air bubbles",
      "റെസിൻ വേഗത്തിൽ മിശ്രണം ചെയ്യുക": "Mix the resin faster",
      "റെസിൻ ഉടൻ കട്ടപിടിക്കുക": "Harden the resin instantly",
    },
    "jewelry-resin": {
      "പോളിയുറിതെയ്ൻ റെസിൻ": "Polyurethane resin",
      "എപ്പോക്സി റെസിൻ": "Epoxy resin",
      "യുവി റെസിൻ": "UV Resin",
      "ആക്രിലിക് റെസിൻ": "Acrylic resin",
    },
    "resin-skin": {
      "ഉടൻ തുടച്ചുനീക്കുക": "Rub it off immediately",
      "സോപ്പും വെള്ളവും കൊണ്ട് കഴുകുക": "Wash with soap and water",
      "ഉണങ്ങിയ തുണി ഉപയോഗിച്ച് തുടച്ചുനീക്കുക": "Use a dry cloth to wipe it off",
      "അവഗണിച്ച് ഉണങ്ങാൻ വിടുക": "Ignore it and let it dry",
    },
    "cure-time": {
      "30 മിനിറ്റ്": "30 minutes",
      "6 മണിക്കൂർ": "6 hours",
      "24-72 മണിക്കൂർ": "24-72 hours",
      "1 ആഴ്ച": "1 week",
      "12 മണിക്കൂർ": "12 hours",
    },
    "curing-factor": {
      "ആർദ്രത": "Humidity",
      "താപനില": "Temperature",
      "മിശ്രണ അനുപാതം": "Mixing ratio",
      "മുകളിലെ എല്ലാം": "All of the above",
    },
    "mix-slowly": {
      "അധിക കുമിളകൾ ഒഴിവാക്കാൻ": "To prevent excess bubbles",
      "ക്യൂറിംഗ് വേഗത്തിലാക്കാൻ": "To speed up curing",
      "റെസിൻ മൃദുവാക്കാൻ": "To make the resin softer",
      "റെസിന്റെ നിറം മാറ്റാൻ": "To change the resin color",
    },
    "too-much-pigment": {
      "വേഗത്തിൽ ക്യൂർ ചെയ്യും": "It cures faster",
      "ഒട്ടിപ്പിടിക്കുകയും ശരിയായി ക്യൂർ ചെയ്യാതിരിക്കുകയും ചെയ്യും": "It becomes sticky and doesn't cure properly",
      "നുരയായി മാറും": "It turns into foam",
      "പാരദർശകത വർദ്ധിക്കും": "It increases transparency",
    },
    "not-safety": {
      "ഗ്ലൗവ്സ് ധരിക്കുക": "Wearing gloves",
      "വായുസഞ്ചാരമുള്ള സ്ഥലത്ത് പ്രവർത്തിക്കുക": "Working in a ventilated area",
      "പ്രവർത്തിക്കുമ്പോൾ ഭക്ഷണം കഴിക്കുക": "Eating while working",
      "ശ്വാസകോശ മാസ്ക് ഉപയോഗിക്കുക": "Using a respirator mask",
    },
    "prevent-yellowing": {
      "ആർദ്രമായ പരിസ്ഥിതിയിൽ സൂക്ഷിക്കുക": "Store it in a humid environment",
      "അധിക ഹാർഡനർ ചേർക്കുക": "Add extra hardener",
      "യുവി-എതിർ റെസിൻ ഉപയോഗിച്ച് കലാസൃഷ്ടി സൂര്യപ്രകാശത്തിൽ നിന്ന് അകലെ സൂക്ഷിക്കുക": "Use UV-resistant resin and store artwork away from sunlight",
      "ഫ്രീസറിൽ സൂക്ഷിക്കുക": "Keep it in the freezer",
    },
    "sticky-reason": {
      "തെറ്റായ മിശ്രണ അനുപാതം": "Incorrect mixing ratio",
      "അധിക താപത്തിന്റെ സമ്പർക്കം": "Too much heat exposure",
      "പ്ലാസ്റ്റിക് മോൾഡ് ഉപയോഗിക്കുക": "Using a plastic mold",
      "അധിക പിഗ്മെന്റ് ചേർക്കുക": "Adding extra pigment",
    },
    "best-mold": {
      "ലോഹ മോൾഡുകൾ": "Metal molds",
      "സിലിക്കൺ മോൾഡുകൾ": "Silicone molds",
      "ഗ്ലാസ് മോൾഡുകൾ": "Glass molds",
      "മര മോൾഡുകൾ": "Wood molds",
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true); // Show loader

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
      type:"resin",
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
    console.log(result.type)

    if (result.success) {
      if (result.passed) {
        window.location.href = `/exam/success?score=${result.score}&name=${payload.name}&type=${result.type}`;
      } else {
        window.location.href = `/exam/failure?score=${result.score}&name=${payload.name}`;
      }
    } else {
      alert("Error submitting exam.");
      setSubmitting(false); // Hide loader if error
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

  // Questions in Malayalam
  const questionsMalayalam: Question[] = [
    {
      name: "resin-ingredient",
      question: "റെസിൻ ആർട്ടിൽ ഉപയോഗിക്കുന്ന റെസിനിലെ പ്രാഥമിക ഘടകം എന്താണ്?",
      options: ["ആക്രിലിക് പെയിന്റ്", "എപ്പോക്സി റെസിൻ", "വാട്ടർകളർ", "ക്ലേ"],
    },
    {
      name: "epoxy-curing",
      question: "എപ്പോക്സി റെസിനുമായി ചേർത്ത് ക്യൂറിംഗ് പ്രക്രിയ ആരംഭിക്കാൻ ഏത് ഘടകമാണ് ഉപയോഗിക്കുന്നത്?",
      options: ["വെള്ളം", "ഹാർഡനർ", "ഗ്ലൂ", "ആൽക്കഹോൾ"],
    },
    {
      name: "mixing-ratio",
      question: "മിക്ക എപ്പോക്സി റെസിനുകൾക്കും ശുപാർശ ചെയ്യുന്ന മിശ്രണ അനുപാതം എന്താണ്?",
      options: ["1:1", "2:1", "1:2", "3:1"],
    },
    {
      name: "embed-material",
      question: "ഇനിപ്പറയുന്നവയിൽ ഏതാണ് റെസിൻ ആർട്ടിൽ സുരക്ഷിതമായി എംബെഡ് ചെയ്യാൻ കഴിയുന്നത്?",
      options: ["പുതിയ പൂക്കൾ", "ഉണങ്ങിയ പൂക്കൾ", "സീലിംഗ് ഇല്ലാത്ത പേപ്പർ", "ഐസ് ക്യൂബുകൾ"],
    },
    {
      name: "heat-gun-purpose",
      question: "റെസിൻ ആർട്ടിൽ ഹീറ്റ് ഗൺ അല്ലെങ്കിൽ ടോർച്ച് ഉപയോഗിക്കുന്നതിന്റെ പ്രധാന ഉദ്ദേശ്യം എന്താണ്?",
      options: ["ഉണക്കൽ വേഗത്തിലാക്കാൻ", "വായു കുമിളകൾ നീക്കം ചെയ്യുക", "റെസിൻ വേഗത്തിൽ മിശ്രണം ചെയ്യുക", "റെസിൻ ഉടൻ കട്ടപിടിക്കുക"],
    },
    {
      name: "jewelry-resin",
      question: "നെക്ലസ് നിർമ്മിക്കാൻ സാധാരണയായി ഉപയോഗിക്കുന്ന റെസിൻ തരം ഏതാണ്?",
      options: ["പോളിയുറിതെയ്ൻ റെസിൻ", "എപ്പോക്സി റെസിൻ", "യുവി റെസിൻ", "ആക്രിലിക് റെസിൻ"],
    },
    {
      name: "resin-skin",
      question: "റെസിൻ തൊലിയിൽ വീണാൽ എന്ത് ചെയ്യണം?",
      options: ["ഉടൻ തുടച്ചുനീക്കുക", "സോപ്പും വെള്ളവും കൊണ്ട് കഴുകുക", "ഉണങ്ങിയ തുണി ഉപയോഗിച്ച് തുടച്ചുനീക്കുക", "അവഗണിച്ച് ഉണങ്ങാൻ വിടുക"],
    },
    {
      name: "cure-time",
      question: "എപ്പോക്സി റെസിൻ സാധാരണയായി പൂർണ്ണമായും ക്യൂർ ചെയ്യാൻ എത്ര സമയമെടുക്കും?",
      options: ["30 മിനിറ്റ്", "6 മണിക്കൂർ", "24-72 മണിക്കൂർ", "1 ആഴ്ച", "12 മണിക്കൂർ"],
    },
    {
      name: "curing-factor",
      question: "എപ്പോക്സി റെസിന്റെ ക്യൂറിംഗ് സമയത്തെ ഏത് ഘടകമാണ് ബാധിക്കുന്നത്?",
      options: ["ആർദ്രത", "താപനില", "മിശ്രണ അനുപാതം", "മുകളിലെ എല്ലാം"],
    },
    {
      name: "mix-slowly",
      question: "റെസിൻ, ഹാർഡനർ എന്നിവ സാവധാനം മിശ്രണം ചെയ്യേണ്ടത് എന്തുകൊണ്ടാണ്?",
      options: ["അധിക കുമിളകൾ ഒഴിവാക്കാൻ", "ക്യൂറിംഗ് വേഗത്തിലാക്കാൻ", "റെസിൻ മൃദുവാക്കാൻ", "റെസിന്റെ നിറം മാറ്റാൻ"],
    },
    {
      name: "too-much-pigment",
      question: "റെസിനിൽ വളരെയധികം പിഗ്മെന്റ് ചേർത്താൽ എന്ത് സംഭവിക്കും?",
      options: ["വേഗത്തിൽ ക്യൂർ ചെയ്യും", "ഒട്ടിപ്പിടിക്കുകയും ശരിയായി ക്യൂർ ചെയ്യാതിരിക്കുകയും ചെയ്യും", "നുരയായി മാറും", "പാരദർശകത വർദ്ധിക്കും"],
    },
    {
      name: "not-safety",
      question: "റെസിനുമായി പ്രവർത്തിക്കുമ്പോൾ ഇനിപ്പറയുന്നവയിൽ ഏതാണ് ശരിയായ സുരക്ഷാ മുൻകരുതൽ അല്ലാത്തത്?",
      options: ["ഗ്ലൗവ്സ് ധരിക്കുക", "വായുസഞ്ചാരമുള്ള സ്ഥലത്ത് പ്രവർത്തിക്കുക", "പ്രവർത്തിക്കുമ്പോൾ ഭക്ഷണം കഴിക്കുക", "ശ്വാസകോശ മാസ്ക് ഉപയോഗിക്കുക"],
    },
    {
      name: "prevent-yellowing",
      question: "കാലക്രമേണ റെസിൻ മഞ്ഞയായി മാറുന്നത് ഒഴിവാക്കാൻ ഏറ്റവും നല്ലത് മാർഗ്ഗം എന്താണ്?",
      options: ["ആർദ്രമായ പരിസ്ഥിതിയിൽ സൂക്ഷിക്കുക", "അധിക ഹാർഡനർ ചേർക്കുക", "യുവി-എതിർ റെസിൻ ഉപയോഗിച്ച് കലാസൃഷ്ടി സൂര്യപ്രകാശത്തിൽ നിന്ന് അകലെ സൂക്ഷിക്കുക", "ഫ്രീസറിൽ സൂക്ഷിക്കുക"],
    },
    {
      name: "sticky-reason",
      question: "72 മണിക്കൂർ കഴിഞ്ഞിട്ടും നിങ്ങളുടെ റെസിൻ ഒട്ടിപ്പിടിച്ചിരിക്കുകയാണെങ്കിൽ, സാധ്യമായ കാരണം എന്താണ്?",
      options: ["തെറ്റായ മിശ്രണ അനുപാതം", "അധിക താപത്തിന്റെ സമ്പർക്കം", "പ്ലാസ്റ്റിക് മോൾഡ് ഉപയോഗിക്കുക", "അധിക പിഗ്മെന്റ് ചേർക്കുക"],
    },
    {
      name: "best-mold",
      question: "എപ്പോക്സി റെസിൻ ആർട്ടിന് ഏത് തരം മോൾഡാണ് ഏറ്റവും നല്ലത്?",
      options: ["ലോഹ മോൾഡുകൾ", "സിലിക്കൺ മോൾഡുകൾ", "ഗ്ലാസ് മോൾഡുകൾ", "മര മോൾഡുകൾ"],
    },
  ];
   // tutor names  and positions
    const tutors = {
        "Resin Tutors": ["Rishana", "Asna", "Sumayya", "Hamna", "Thesnim"]
    };

  // Use appropriate questions based on language
  const currentQuestions = language === "ml" ? questionsMalayalam : questions;

  if (isTimeOver) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="border-2 border-black p-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-black">{t.timesUp}</h1>
            <p className="text-lg mb-4 text-black">
              {t.timeExceeded}
            </p>
            <p className="font-medium text-black">
              {t.contactTeam}
            </p>
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
          className="px-3 py-1 text-sm border border-black bg-white text-black hover:bg-grey hover:text-white transition-colors duration-200"
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
                                            name={field}
                                            required
                                            disabled={started}
                                            className="w-full border-2 border-black px-4 py-2 focus:outline-none bg-white disabled:bg-gray-50"
                                        >
                                            <option value="">Select Tutor</option>
                                            {Object.entries(tutors).map(([group, names]) => (
                                                <optgroup key={group} label={group}>
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