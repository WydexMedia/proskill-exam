import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer"
import fs from "fs"
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN
    }
})

// generating certificate
async function generateCertificatePDF(name: string, dateStr: string) {
    const certImagePath = path.join(process.cwd(), "public/certificate.jpg");
    const certImageBytes = fs.readFileSync(certImagePath);

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([842, 595]);

    const jpgImage = await pdfDoc.embedJpg(certImageBytes);
    page.drawImage(jpgImage, { x: 0, y: 0, width: 842, height: 595 });

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    //student name 
    page.drawText(name, { x: 350, y: 200, size: 36, font, color: rgb(0, 0, 0) });

    //current date 
    page.drawText(dateStr, { x: 255, y: 70, size: 18, font, color: rgb(0, 0, 0) })

    const pdfBytes = await pdfDoc.save()
    return pdfBytes;
}

// rendering answers as a table 
function renderAnswersTable(answers: Record<string, string>) {
    return `
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin-top:16px; font-size:15px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th>Question</th>
          <th>Your Answer</th>
        </tr>
      </thead>
      <tbody>
        ${Object.keys(answers)
            .map(
                (key) => `
          <tr>
            <td>${key}</td>
            <td>${answers[key] || "-"}</td>
          </tr>`
            )
            .join("")}
      </tbody>
    </table>
  `;
}

// sending Certificate
async function sendCertificateEmail(
    name: string,
    email: string,
    tutor: string,
    dateStr: string,
    answers: Record<string, string>
) {
    const certBuffer = await generateCertificatePDF(name, dateStr)

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎓 Congratulations! You Passed the Exam",
        html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #ddd; background:#ffffff; color:#333;">
        <h2 style="color:#000000; font-size:22px; margin-bottom:16px;">🎓 Congratulations! You Passed the Exam</h2>
        <p style="font-size:16px; line-height:1.6;">Dear <strong>${name}</strong>,</p>
        <p style="font-size:16px; line-height:1.6;">Congratulations on successfully completing your examination with <strong>Proskill</strong>!</p>
        <p style="font-size:16px; line-height:1.6;"><strong>Exam Details:</strong><br/>Name: ${name}<br/>Tutor: ${tutor}<br/>Date: ${dateStr}</p>
        <p style="font-size:16px; line-height:1.6;"><strong>Your Answers:</strong></p>
        ${renderAnswersTable(answers)}
        <p style="font-size:16px; line-height:1.6; margin-top:16px;">Your certificate is attached to this email.</p>
      </div>
    `,
        attachments: [{ filename: "certificate.pdf", content: Buffer.from(certBuffer) }],
    });

}

// sending failed email
async function sendFailureEmail(
    name: string,
    email: string,
    answers: Record<string, string>
) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Opportunity to Improve Your Exam Score",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background: #ffffff; color: #333;">
        <h2 style="color: #000000; font-size: 22px; margin-bottom: 16px;">Opportunity to Improve Your Exam Score</h2>
        <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6;">Thank you for completing your recent examination with <strong>Proskill</strong>.</p>
        <p style="font-size: 16px; line-height: 1.6;">You still have the opportunity to improve! You are allowed one more attempt within the next 24 hours.</p>
        <p style="font-size: 16px; line-height: 1.6;"><strong>Your Answers:</strong></p>
        ${renderAnswersTable(answers)}
      </div>
    `,
    });
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const correctAnswers: Record<string, string> = {
            "ocean-color": "Blue",
            "sea-foam-pigment": "White",
            "safe-embedding-item": "Dried seashells",
            "wave-shaping-tool": "Heat gun",
            "shoreline-technique": "Pour resin in layers with blending",
            "shimmer-addition": "Mica powder",
            "gradient-technique": "Using multiple shades of blue",
            "best-surface": "Wood panel",
            "bubble-pop-tool": "Heat gun",
            "non-ocean-theme-item": "Flames",
            "importance-of-layers": "To create depth and realistic ocean effects",
            "realistic-sea-foam": "Use white pigment and manipulate with a heat gun",
            "overheating-white-pigment": "It spreads too much and loses wave shape",
            "first-step": "Preparing the workspace and safety gear",
            "resin-components": "Resin and hardener",
        };
        let score = 0
        for (const [key, correct] of Object.entries(correctAnswers)) {
            if (data.answers[key] === correct) score++;
        }

        const passed = score >= 12
        const dateStr = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        if (passed) {
            await sendCertificateEmail(data.name, data.email, data.tutor, dateStr, data.answers)
        }
        else {
            await sendFailureEmail(data.name, data.email, data.answers)
        }

        const client = await clientPromise
        const db = client.db("examDB")


        await db.collection("examSubmissions").insertOne({
            type:data.type,
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            batch: data.batch,
            tutor: data.tutor,
            answers: data.answers,
            score,
            passed,
            submittedAt: new Date(),
        });

        return NextResponse.json({ 
            success: true, 
            score, 
            passed, 
            type: data.type 
        })
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ success: false, error: "server error" }, { status: 500 })
    }
}