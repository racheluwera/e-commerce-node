import { transporter } from"../config/mail";
import {welcomeEmailTemplate } from "../templates/welcome.templates";
const sendEmail = async (to: string, subject: string, html: string) =>{
    try{
        const info = await transporter.sendMail({
            from:`"Node Auth App" <${process.env.EMAIL_SENDER || process.env.EMAIL_USER}>`,
            to,
            subject,
            html
            })
        console.log("Email sent successfully to:", to, "MessageId:", info.messageId);
    }catch (error){
        console.error('error sending email:\n',error);
    }
}

export const sendResetCodeEmail = async (to: string, code: string)=>{
    const subject = "password Reset Code";
    const html=`
    <p>hello,</p>
    <p>Here is your password reset OTP: ${code}</p>
    <p>This code will expire in 10 minutes</p>`

    await sendEmail(to,subject,html);
}
export const sendWelcomeEmail = async (to: string, name: string)=>{
    const subject = "welcome to Node Auth App";
    const html= welcomeEmailTemplate(name);
    await sendEmail(to, subject, html);
}