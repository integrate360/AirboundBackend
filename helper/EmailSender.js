const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.Sendgrid_Key);

const sendEmailToUser = async (user, newDates, classBody) => {
  if (!user.email) {
    console.error(`No email found for user: ${user?.name}`);
    return;
  }

  const emailContent = `
    <p>Dear ${user.name},</p>
    <p>Your class ${
      classBody?.name
    } has been rescheduled. The new dates are:</p>
    <ul>
      ${newDates
        .map((date) => `<li>${new Date(date).toLocaleDateString()}</li>`)
        .join("")}
    </ul>
    <p>We apologize for any inconvenience caused and hope to see you at the new dates!</p>
  `;

  const msg = {
    to: user.email,
    from: "airboundfitness@gmail.com",
    subject: "Your Class Has Been Rescheduled",
    html: emailContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};

module.exports = { sendEmailToUser };
