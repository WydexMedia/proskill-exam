// import dns from "node:dns";
// dns.setServers(['1.1.1.1']);
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from 'fontkit';
import { generateCertificatePDF, normalizeNameForCursive } from "@/lib/certificate";



// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log('hiiii')
// console.log("EMAIL_CLIENT_ID:", process.env.EMAIL_CLIENT_ID);
// console.log("EMAIL_CLIENT_SECRET:", process.env.EMAIL_CLIENT_SECRET);
// console.log("EMAIL_REFRESH_TOKEN:", process.env.EMAIL_REFRESH_TOKEN);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    },
});

async function generateCertificatePDF(name: string, dateStr: string) {
  const certImagePath = path.join(process.cwd(), "public/certificate.jpg");
  const certImageBytes = fs.readFileSync(certImagePath);

  const fontPath = path.join(process.cwd(), "public/fonts/FormaleScript_PERSONAL_USE_ONLY.otf");
  const customFontBytes = fs.readFileSync(fontPath);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit as any); // Register fontkit

  const page = pdfDoc.addPage([842, 595]);

  const jpgImage = await pdfDoc.embedJpg(certImageBytes);
  page.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: 842,
      height: 595,
  });

  const cursiveFont = await pdfDoc.embedFont(customFontBytes);

  page.drawText(name, {
      x: 350,
      y: 200,
      size: 28,
      font: cursiveFont,
      color: rgb(0, 0, 0),
  });

  const standardFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(dateStr, {
      x: 255,
      y: 70,
      size: 18,
      font: standardFont,
      color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Helper to render answers as HTML table (only attended answers)
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
        ${Object.keys(answers).map(key => `
          <tr>
            <td>${key}</td>
            <td>${answers[key] || "-"}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function sendCertificateEmail(
    name: string,
    email: string,
    tutor: string,
    dateStr: string,
    answers: Record<string, string>
) {
    const displayName = normalizeNameForCursive(name);
  const certBuffer = await generateCertificatePDF(displayName, dateStr);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎓 Congratulations! You Passed the Exam",
    text: `Dear ${displayName},\n\nCongratulations on successfully passing your exam!\n\nPlease find your certificate attached.\n\nName: ${displayName}\nTutor: ${tutor}\nDate: ${dateStr}\n\nWe are proud to have you as part of our learning community.\n\nAll the best,\nTeam Proskill\n`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #ddd; background:#ffffff; color:#333;">
        <h2 style="color:#000000; font-size:22px; margin-bottom:16px;">🎓 Congratulations! You Passed the Exam</h2>
        <p style="font-size:16px; line-height:1.6;">Dear <strong>${displayName}</strong>,</p>
        <p style="font-size:16px; line-height:1.6;">Congratulations on successfully completing your examination with <strong>Proskill</strong>!</p>
        <p style="font-size:16px; line-height:1.6;">You have demonstrated dedication and skill in mastering the material.</p>
        <p style="font-size:16px; line-height:1.6;"><strong>Exam Details:</strong><br> Name: ${displayName}<br> Tutor: ${tutor}<br> Date: ${dateStr}</p>
        <p style="font-size:16px; line-height:1.6;"><strong>Your Answers:</strong></p>
        ${renderAnswersTable(answers)}
        <p style="font-size:16px; line-height:1.6; margin-top:16px;">Your certificate is attached to this email. Keep it as a record of your achievement.</p>
        <div style="margin:24px 0; text-align:center;"><a href="https://calculator.proskilledu.com/testimonial" style="background:#000000; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:4px; font-weight:bold; display:inline-block;">Visit Your Success Stories</a></div>
        <p style="font-size:16px; line-height:1.6;">We are proud to have you as part of our learning community and look forward to seeing you achieve even more.</p>
        <p style="font-size:16px; line-height:1.6; margin-top:24px;">All the best!<br> — Team Proskill</p>
      </div>
    `,
    attachments: [
      { filename: "certificate.pdf", content: Buffer.from(certBuffer) }
    ],
  });
}

async function sendFailureEmail(
  name: string,
  email: string,
  answers: Record<string, string>
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Opportunity to Improve Your Exam Score",
    text: `Dear ${name},\n\nThank you for completing your recent examination with Proskill.\n\nWe noticed that your score didn’t meet the expected level. But don’t worry—you still have the opportunity to improve!\n\nYou are allowed one more attempt within the next 24 hours.\n\nWe encourage you to review the classes provided and give it your best in the second attempt.\n\nIf you have any doubts, feel free to connect with your trainer through your course’s WhatsApp group.\n\nProskill is proud to have you as part of our learning community.\n\nAll the best!\n— Team Proskill\n`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background: #ffffff; color: #333;">
        <h2 style="color: #000000; font-size: 22px; margin-bottom: 16px;">Opportunity to Improve Your Exam Score</h2>
        <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6;">Thank you for completing your recent examination with <strong>Proskill</strong> as part of your online course.</p>
        <p style="font-size: 16px; line-height: 1.6;">We noticed that your score in this attempt didn’t meet the expected level. But don’t worry — you still have the opportunity to improve!</p>
        <p style="font-size: 16px; line-height: 1.6;">You are allowed <strong>one more attempt within the next 24 hours.</strong></p>
        <p style="font-size: 16px; line-height: 1.6;"><strong>Your Answers:</strong></p>
        ${renderAnswersTable(answers)}
        <p style="font-size: 16px; line-height: 1.6;">If you have any doubts, feel free to connect with your trainer through your course’s WhatsApp group. Our team is here to support your success.</p>
        <div style="margin: 24px 0; text-align: center;"><a href="https://calculator.proskilledu.com/testimonial" style="background: #000000; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Visit our success Stories</a></div>
        <p style="font-size: 16px; line-height: 1.6;">Proskill is proud to have you as part of our learning community, and we believe in your potential to do even better.</p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">All the best!<br> — Team Proskill</p>
      </div>
    `,
  });
}



export async function POST(req: Request) {
    try {
        const data = await req.json();

        const correctAnswers = {
            "resin-ingredient": "Epoxy resin",
            "epoxy-curing": "Hardener",
            "mixing-ratio": "1:1",
            "embed-material": "Dried flowers",
            "heat-gun-purpose": "Remove air bubbles",
            "jewelry-resin": "UV Resin",
            "resin-skin": "Wash with soap and water",
            "cure-time": "24-72 hours",
            "curing-factor": "All of the above",
            "mix-slowly": "To prevent excess bubbles",
            "too-much-pigment": "It becomes sticky and doesn't cure properly",
            "not-safety": "Eating while working",
            "prevent-yellowing": "Use UV-resistant resin and store artwork away from sunlight",
            "sticky-reason": "Incorrect mixing ratio",
            "best-mold": "Silicone molds",
        };

        let score = 0;

        for (const [key, correct] of Object.entries(correctAnswers)) {
            if (data.answers[key] === correct) {
                score++;
            }
        }

        const passed = score >= 12;

        // Generate current date string
        const dateStr = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

        // Send email if passed or failed
        let certBuffer = null;
        if (passed) {
            certBuffer = await generateCertificatePDF(data.name, dateStr);
            await sendCertificateEmail(data.name, data.email, data.tutor, dateStr, data.answers);
        } else {
            await sendFailureEmail(data.name, data.email, data.answers);
        }

        const client = await clientPromise;
        const db = client.db("examDB");

        await db.collection("examSubmissions").insertOne({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            batch: data.batch,
            tutor: data.tutor,
            answers: data.answers,
            score,
            passed,
            // certificate: certBuffer ? Buffer.from(certBuffer) : null, // <-- Save certificate
            submittedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            score,
            passed,
            submittedAt: new Date(),
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}