"use client"

import { useState, useEffect } from "react";
import { Button } from "antd";
import "antd/dist/reset.css"

// Translations
const translations = {
    en: {
        title: "Ocean Art Exam",
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
        title: " ആർട്ട് പരീക്ഷ",
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

export default function OceanExam() {
    const [lockoutMessage, setLockoutMessage] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(20 * 60);
    const [isTimeOver, setIsTimeOver] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState(false);
    const [language, setLanguage] = useState<"en" | "ml">("en");

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

    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const questionsEN: Question[] = [
        {
            name: "ocean-color",
            question: "What is the most common color used to represent ocean water in resin art?",
            options: ["Green", "Blue", "Red", "Black"],
        },
        {
            name: "sea-foam-pigment",
            question: "Which pigment color is typically used to create sea foam or waves in ocean resin art?",
            options: ["Brown", "Silver", "White", "Yellow"],
        },
        {
            name: "safe-embedding-item",
            question: "Which of these items is safe and suitable to embed in an ocean resin piece?",
            options: ["Wet seaweed", "Fresh flowers", "Dried seashells", "Paper cutouts"],
        },
        {
            name: "wave-shaping-tool",
            question: "What tool is commonly used to shape and move waves in ocean resin art?",
            options: ["Paintbrush", "Heat gun", "Toothpick", "Sponge"],
        },
        {
            name: "shoreline-technique",
            question: "To create a beach shoreline effect, which technique is typically used?",
            options: ["Pour all colors at once", "Drop alcohol into resin", "Pour resin in layers with blending", "Use a fan"],
        },
        {
            name: "shimmer-addition",
            question: "Which of the following is typically used to add shimmer to ocean water in resin?",
            options: ["Soap", "Mica powder", "Glitter glue", "Oil pastels"],
        },
        {
            name: "gradient-technique",
            question: "What is a common method to create the gradient from deep ocean to shallow water?",
            options: ["Pouring white resin all over", "Using multiple shades of blue", "Sprinkling salt", "Painting over cured resin"],
        },
        {
            name: "best-surface",
            question: "Which surface is best for creating an ocean-themed resin piece?",
            options: ["Cardboard", "Glass", "Wood panel", "Metal sheet"],
        },
        {
            name: "bubble-pop-tool",
            question: "Which tool is used to pop bubbles and help create wave lacing in ocean resin art?",
            options: ["Spray bottle", "Hairdryer", "Heat gun", "Ruler"],
        },
        {
            name: "non-ocean-theme-item",
            question: "Which of the following is not typically part of an ocean theme resin artwork?",
            options: ["Starfish", "Shells", "Flames", "Sand"],
        },
        {
            name: "importance-of-layers",
            question: "Why are layers important in ocean-themed resin art?",
            options: ["To reduce drying time", "To allow adding glitter", "To create depth and realistic ocean effects", "To reuse leftover resin"],
        },
        {
            name: "realistic-sea-foam",
            question: "How can you create realistic sea foam in resin waves?",
            options: ["Blow on the resin with a straw", "Use alcohol ink", "Use white pigment and manipulate with a heat gun", "Sprinkle flour"],
        },
        {
            name: "overheating-white-pigment",
            question: "What happens if white pigment is overheated during wave creation?",
            options: ["It disappears", "It cracks", "It turns yellow", "It spreads too much and loses wave shape"],
        },
        {
            name: "first-step",
            question: "What is the first step before starting to pour resin for an ocean art piece?",
            options: ["Mixing pigments directly on the artwork", "Preparing the workspace and safety gear", "Applying resin without mixing", "Cutting the canvas"],
        },
        {
            name: "resin-components",
            question: "Which two components are mixed to create epoxy resin?",
            options: ["Resin and pigment", "Resin and hardener", "Resin and water", "Resin and glue"],
        },
    ];

    const questionsML: Question[] =

        [
            {
                name: "ocean-color",
                question: "റെസിൻ കലയിൽ സമുദ്രജലം പ്രതിനിധീകരിക്കാൻ സാധാരണയായി ഉപയോഗിക്കുന്ന നിറം ഏതാണ്?",
                options: ["പച്ച", "നീല", "ചുവപ്പ്", "കറുപ്പ്"],
            },
            {
                name: "sea-foam-pigment",
                question: "സമുദ്ര റെസിൻ കലയിൽ കടൽ നുരയോ തിരമാലകളോ ഉണ്ടാക്കാൻ സാധാരണയായി ഉപയോഗിക്കുന്ന പിഗ്മെന്റ് നിറം ഏതാണ്?",
                options: ["തവിട്ടുനിറം", "വെള്ളിനിറം", "വെള്ള", "മഞ്ഞ"],
            },
            {
                name: "safe-embedding-item",
                question: "ഒരു സമുദ്ര റെസിൻ ഭാഗത്ത് ഉൾപ്പെടുത്താൻ സുരക്ഷിതവും അനുയോജ്യവുമായ ഇനം ഏതാണ്?",
                options: ["നനഞ്ഞ കടൽച്ചീര", "പുതിയ പൂക്കൾ", "ഉണങ്ങിയ കടൽച്ചിപ്പികൾ", "പേപ്പർ കട്ട്ഔട്ടുകൾ"],
            },
            {
                name: "wave-shaping-tool",
                question: "സമുദ്ര റെസിൻ കലയിൽ തിരമാലകൾ രൂപപ്പെടുത്താനും നീക്കാനും സാധാരണയായി ഉപയോഗിക്കുന്ന ഉപകരണം ഏതാണ്?",
                options: ["പെയിന്റ് ബ്രഷ്", "ഹീറ്റ് ഗൺ", "ടൂത്ത്പിക്ക്", "സ്പോഞ്ച്"],
            },
            {
                name: "shoreline-technique",
                question: "ഒരു കടൽത്തീര പ്രഭാവം സൃഷ്ടിക്കാൻ സാധാരണയായി ഉപയോഗിക്കുന്ന സാങ്കേതികവിദ്യ ഏതാണ്?",
                options: ["എല്ലാ നിറങ്ങളും ഒറ്റയടിക്ക് ഒഴിക്കുക", "റെസിനിലേക്ക് ആൽക്കഹോൾ ഒഴിക്കുക", "മിശ്രണത്തോടെ റെസിൻ പാളികളായി ഒഴിക്കുക", "ഒരു ഫാൻ ഉപയോഗിക്കുക"],
            },
            {
                name: "shimmer-addition",
                question: "റെസിനിലെ സമുദ്രജലത്തിൽ തിളക്കം ചേർക്കാൻ സാധാരണയായി ഉപയോഗിക്കുന്നത് താഴെപ്പറയുന്നവയിൽ ഏതാണ്?",
                options: ["സോപ്പ്", "മൈക്ക പൊടി", "ഗ്ലിറ്റർ പശ", "ഓയിൽ പാസ്റ്റലുകൾ"],
            },
            {
                name: "gradient-technique",
                question: "ആഴക്കടലിൽ നിന്ന് ആഴം കുറഞ്ഞ വെള്ളത്തിലേക്ക് ഗ്രേഡിയന്റ് സൃഷ്ടിക്കാനുള്ള ഒരു സാധാരണ മാർഗം ഏതാണ്?",
                options: ["മുഴുവൻ വെള്ള റെസിൻ ഒഴിക്കുക", "നീലയുടെ ഒന്നിലധികം ഷേഡുകൾ ഉപയോഗിക്കുക", "ഉപ്പ് വിതറുക", "ഉണങ്ങിയ റെസിൻ മുകളിൽ പെയിന്റ് ചെയ്യുക"],
            },
            {
                name: "best-surface",
                question: "സമുദ്രം പ്രമേയമായ ഒരു റെസിൻ ഭാഗം ഉണ്ടാക്കാൻ ഏറ്റവും അനുയോജ്യമായ പ്രതലം ഏതാണ്?",
                options: ["കാർഡ്ബോർഡ്", "ഗ്ലാസ്", "മരം പാനൽ", "ലോഹ ഷീറ്റ്"],
            },
            {
                name: "bubble-pop-tool",
                question: "സമുദ്ര റെസിൻ കലയിൽ കുമിളകൾ പൊട്ടിക്കാനും തിരമാലകൾ ഉണ്ടാക്കാനും ഉപയോഗിക്കുന്ന ഉപകരണം ഏതാണ്?",
                options: ["സ്പ്രേ ബോട്ടിൽ", "ഹെയർ ഡ്രയർ", "ഹീറ്റ് ഗൺ", "റൂളർ"],
            },
            {
                name: "non-ocean-theme-item",
                question: "ഒരു സമുദ്രം പ്രമേയമായ റെസിൻ കലാസൃഷ്ടിയുടെ ഭാഗമല്ലാത്തത് താഴെപ്പറയുന്നവയിൽ ഏതാണ്?",
                options: ["നക്ഷത്രമത്സ്യം", "ചിപ്പികൾ", "തീ", "മണൽ"],
            },
            {
                name: "importance-of-layers",
                question: "സമുദ്രം പ്രമേയമായ റെസിൻ കലയിൽ പാളികൾക്ക് പ്രാധാന്യമുള്ളത് എന്തുകൊണ്ട്?",
                options: ["ഉണങ്ങുന്ന സമയം കുറയ്ക്കാൻ", "തിളക്കം ചേർക്കാൻ അനുവദിക്കാൻ", "ആഴവും യഥാർത്ഥ സമുദ്ര പ്രഭാവങ്ങളും സൃഷ്ടിക്കാൻ", "ബാക്കിയുള്ള റെസിൻ വീണ്ടും ഉപയോഗിക്കാൻ"],
            },
            {
                name: "realistic-sea-foam",
                question: "റെസിൻ തിരമാലകളിൽ യഥാർത്ഥ കടൽ നുര എങ്ങനെ ഉണ്ടാക്കാം?",
                options: ["ഒരു വൈക്കോൽ ഉപയോഗിച്ച് റെസിനിൽ ഊതുക", "ആൽക്കഹോൾ മഷി ഉപയോഗിക്കുക", "വെള്ള പിഗ്മെന്റ് ഉപയോഗിച്ച് ഒരു ഹീറ്റ് ഗൺ ഉപയോഗിച്ച് രൂപപ്പെടുത്തുക", "അരിപ്പൊടി വിതറുക"],
            },
            {
                name: "overheating-white-pigment",
                question: "തിരമാല ഉണ്ടാക്കുന്ന സമയത്ത് വെള്ള പിഗ്മെന്റ് അമിതമായി ചൂടാക്കിയാൽ എന്ത് സംഭവിക്കും?",
                options: ["അത് അപ്രത്യക്ഷമാകും", "അത് പൊട്ടുന്നു", "അത് മഞ്ഞ നിറമാകും", "അത് വളരെയധികം വ്യാപിക്കുകയും തിരമാലയുടെ രൂപം നഷ്ടപ്പെടുകയും ചെയ്യും"],
            },
            {
                name: "first-step",
                question: "ഒരു സമുദ്ര കലാസൃഷ്ടിക്കായി റെസിൻ ഒഴിക്കുന്നതിന് മുമ്പുള്ള ആദ്യപടി എന്താണ്?",
                options: ["കലാസൃഷ്ടിയിൽ നേരിട്ട് പിഗ്മെന്റുകൾ കലർത്തുക", "പ്രവർത്തി സ്ഥലവും സുരക്ഷാ ഉപകരണങ്ങളും തയ്യാറാക്കുക", "കലർത്താതെ റെസിൻ പ്രയോഗിക്കുക", "ക്യാൻവാസ് മുറിക്കുക"],
            },
            {
                name: "resin-components",
                question: "എപ്പോക്സി റെസിൻ ഉണ്ടാക്കാൻ ഏതൊക്കെ രണ്ട് ഘടകങ്ങളാണ് കലർത്തുന്നത്?",
                options: ["റെസിൻ, പിഗ്മെന്റ്", "റെസിൻ, ഹാർഡ്നർ", "റെസിൻ, വെള്ളം", "റെസിൻ, പശ"],
            },
        ]
    // tutor names  and positions
    const tutors = {
        "Resin Tutors": ["Rishana", "Asna", "Sumayya", "Hamna"],
        "Mehandi Tutor": ["Jasira"],
        "Digital Marketing": ["Brijesh"],
    };

    
    const currentQuestions = language === "ml" ? questionsML : questionsEN;

    // Malayalam to English mapping for answers
    const mlToEnOptionMap: Record<string, Record<string, string>> = {
        "ocean-color": {
            "പച്ച": "Green",
            "നീല": "Blue",
            "ചുവപ്പ്": "Red",
            "കറുപ്പ്": "Black"
        },
        "sea-foam-pigment": {
            "തവിട്ടുനിറം": "Brown",
            "വെള്ളിനിറം": "Silver",
            "വെള്ള": "White",
            "മഞ്ഞ": "Yellow"
        },
        "safe-embedding-item": {
            "നനഞ്ഞ കടൽച്ചീര": "Wet seaweed",
            "പുതിയ പൂക്കൾ": "Fresh flowers",
            "ഉണങ്ങിയ കടൽച്ചിപ്പികൾ": "Dried seashells",
            "പേപ്പർ കട്ട്ഔട്ടുകൾ": "Paper cutouts"
        },
        "wave-shaping-tool": {
            "പെയിന്റ് ബ്രഷ്": "Paintbrush",
            "ഹീറ്റ് ഗൺ": "Heat gun",
            "ടൂത്ത്പിക്ക്": "Toothpick",
            "സ്പോഞ്ച്": "Sponge"
        },
        "shoreline-technique": {
            "എല്ലാ നിറങ്ങളും ഒറ്റയടിക്ക് ഒഴിക്കുക": "Pour all colors at once",
            "റെസിനിലേക്ക് ആൽക്കഹോൾ ഒഴിക്കുക": "Drop alcohol into resin",
            "മിശ്രണത്തോടെ റെസിൻ പാളികളായി ഒഴിക്കുക": "Pour resin in layers with blending",
            "ഒരു ഫാൻ ഉപയോഗിക്കുക": "Use a fan"
        },
        "shimmer-addition": {
            "സോപ്പ്": "Soap",
            "മൈക്ക പൊടി": "Mica powder",
            "ഗ്ലിറ്റർ പശ": "Glitter glue",
            "ഓയിൽ പാസ്റ്റലുകൾ": "Oil pastels"
        },
        "gradient-technique": {
            "മുഴുവൻ വെള്ള റെസിൻ ഒഴിക്കുക": "Pouring white resin all over",
            "നീലയുടെ ഒന്നിലധികം ഷേഡുകൾ ഉപയോഗിക്കുക": "Using multiple shades of blue",
            "ഉപ്പ് വിതറുക": "Sprinkling salt",
            "ഉണങ്ങിയ റെസിൻ മുകളിൽ പെയിന്റ് ചെയ്യുക": "Painting over cured resin"
        },
        "best-surface": {
            "കാർഡ്ബോർഡ്": "Cardboard",
            "ഗ്ലാസ്": "Glass",
            "മരം പാനൽ": "Wood panel",
            "ലോഹ ഷീറ്റ്": "Metal sheet"
        },
        "bubble-pop-tool": {
            "സ്പ്രേ ബോട്ടിൽ": "Spray bottle",
            "ഹെയർ ഡ്രയർ": "Hairdryer",
            "ഹീറ്റ് ഗൺ": "Heat gun",
            "റൂളർ": "Ruler"
        },
        "non-ocean-theme-item": {
            "നക്ഷത്രമത്സ്യം": "Starfish",
            "ചിപ്പികൾ": "Shells",
            "തീ": "Flames",
            "മണൽ": "Sand"
        },
        "importance-of-layers": {
            "ഉണങ്ങുന്ന സമയം കുറയ്ക്കാൻ": "To reduce drying time",
            "തിളക്കം ചേർക്കാൻ അനുവദിക്കാൻ": "To allow adding glitter",
            "ആഴവും യഥാർത്ഥ സമുദ്ര പ്രഭാവങ്ങളും സൃഷ്ടിക്കാൻ": "To create depth and realistic ocean effects",
            "ബാക്കിയുള്ള റെസിൻ വീണ്ടും ഉപയോഗിക്കാൻ": "To reuse leftover resin"
        },
        "realistic-sea-foam": {
            "ഒരു വൈക്കോൽ ഉപയോഗിച്ച് റെസിനിൽ ഊതുക": "Blow on the resin with a straw",
            "ആൽക്കഹോൾ മഷി ഉപയോഗിക്കുക": "Use alcohol ink",
            "വെള്ള പിഗ്മെന്റ് ഉപയോഗിച്ച് ഒരു ഹീറ്റ് ഗൺ ഉപയോഗിച്ച് രൂപപ്പെടുത്തുക": "Use white pigment and manipulate with a heat gun",
            "അരിപ്പൊടി വിതറുക": "Sprinkle flour"
        },
        "overheating-white-pigment": {
            "അത് അപ്രത്യക്ഷമാകും": "It disappears",
            "അത് പൊട്ടുന്നു": "It cracks",
            "അത് മഞ്ഞ നിറമാകും": "It turns yellow",
            "അത് വളരെയധികം വ്യാപിക്കുകയും തിരമാലയുടെ രൂപം നഷ്ടപ്പെടുകയും ചെയ്യും": "It spreads too much and loses wave shape"
        },
        "first-step": {
            "കലാസൃഷ്ടിയിൽ നേരിട്ട് പിഗ്മെന്റുകൾ കലർത്തുക": "Mixing pigments directly on the artwork",
            "പ്രവർത്തി സ്ഥലവും സുരക്ഷാ ഉപകരണങ്ങളും തയ്യാറാക്കുക": "Preparing the workspace and safety gear",
            "കലർത്താതെ റെസിൻ പ്രയോഗിക്കുക": "Applying resin without mixing",
            "ക്യാൻവാസ് മുറിക്കുക": "Cutting the canvas"
        },
        "resin-components": {
            "റെസിൻ, പിഗ്മെന്റ്": "Resin and pigment",
            "റെസിൻ, ഹാർഡ്നർ": "Resin and hardener",
            "റെസിൻ, വെള്ളം": "Resin and water",
            "റെസിൻ, പശ": "Resin and glue"
        }
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
            type: "ocean",
            name: formData.get("name"),
            email: formData.get("email"),
            mobile: formData.get("mobile"),
            batch: formData.get("batch"),
            tutor: formData.get("tutor"),
            answers,
        };

        const res = await fetch("/api/submitocean", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log("res", result)

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