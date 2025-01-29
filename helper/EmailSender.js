const sgMail = require("@sendgrid/mail");
const ics = require("ics");
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
  const events = newDates.map((date) => {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    return {
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
      ],
      end: [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes(),
      ],
      title: `Rescheduled Class: ${classBody?.name}`,
      description: `Your class ${classBody?.name} has been rescheduled. Please check the new dates.`,
      status: "CONFIRMED",
      organizer: {
        name: "Airbound Fitness",
        email: "airboundfitness@gmail.com",
      },
      attendees: [{ name: user.name, email: user.email }],
    };
  });

  const { error, value: icsContent } = ics.createEvents(events);
  if (error) {
    console.error("Error generating .ics file:", error);
    return;
  }

  // Prepare the email with the .ics attachment
  const msg = {
    to: user.email,
    from: "airboundfitness@gmail.com",
    subject: "Your Class Has Been Rescheduled",
    html: emailContent,
    attachments: [
      {
        content: Buffer.from(icsContent).toString("base64"),
        filename: "rescheduled-class.ics",
        type: "text/calendar",
        disposition: "attachment",
      },
    ],
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};

module.exports = { sendEmailToUser };
