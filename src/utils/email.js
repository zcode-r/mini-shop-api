import transporter from "../config/nodemailer.js"

export const sendemail=async (to , subject , text)=>{
    try{
        const mailoperation={
            from:process.env.EMAIL_USER,
            to:to,
            subject:subject,
            text:text
        }

        await transporter.sendMail(mailoperation)
        console.log(`Email sent to :${to}`)
    }
    catch(err){
        console.log(`Error sending email ${err}`)
    }
}
