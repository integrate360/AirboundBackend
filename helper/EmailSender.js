const sgMail = require("@sendgrid/mail");
const moment = require("moment");
sgMail.setApiKey(process.env.Sendgrid_Key);

const generateICS = (user, newDates, classBody) => {
  // Start with the basic structure of an iCalendar file (ICS)
  const calendarStart = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Google Inc//Google Calendar 70.9054//EN
`;

  const calendarEnd = `
END:VCALENDAR
`;

  // Generate an event for each new date
  const events = newDates
    .map((date) => {
      const eventStart = moment(date).format("YYYYMMDDTHHmmss") + "Z"; // Format date in UTC (Z is for UTC)
      const eventEnd =
        moment(date).add(1, "hour").format("YYYYMMDDTHHmmss") + "Z"; // Assuming each event is 1 hour long
      const eventUID = `event-${Date.now()}@example.com`; // Unique ID for each event

      return `
BEGIN:VEVENT
SUMMARY:${classBody?.name}
DESCRIPTION:Your class has been rescheduled. We hope to see you there!
LOCATION:Online (or specify location)
DTSTART:${eventStart}
DTEND:${eventEnd}
UID:${eventUID}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
    `;
    })
    .join("");

  // Combine all parts into one ICS file content
  const icsContent = calendarStart + events + calendarEnd;

  return icsContent;
};

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
        ?.map((date) => ` <li>${new Date(date).toLocaleDateString()}</li>`)
        ?.join("")}
    </ul>
    <p>We apologize for any inconvenience caused and hope to see you at the new dates!</p>
  `;

  const icsContent = generateICS(user, newDates, classBody);

  const msg = {
    to: user.email,
    from: "airboundfitness@gmail.com",
    subject: "Your Class Has Been Rescheduled",
    html: emailContent,
    attachments: [
      {
        content: Buffer.from(icsContent).toString("base64"), // Encode content in base64
        filename: "event.ics",
        type: "text/calendar",
        disposition: "attachment",
      },
    ],
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:, error`);
  }
};

module.exports = { sendEmailToUser };
