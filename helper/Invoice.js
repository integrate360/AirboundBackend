const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.Sendgrid_Key);

const generateInvoice = (booking) => {
  return `
    Booking ID: ${booking._id}
    Class Name: ${booking.className}
    Location: ${booking.location}
    Dates: ${booking.dates.join(", ")}
    Total Amount: ${booking.totalAmount ? `$${booking.totalAmount}` : "N/A"}
  `;
};

const sendEmail = async ({ to, subject, body }) => {
  const msg = {
    to,
    from: "ngeduwizer@gmail.com",
    subject,
    text: body,
    html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "Failed to send email:",
      error.response?.body || error.message
    );
    throw new Error("Error sending email");
  }
};

const sendInvoiceToUser = async (user, booking) => {
  if (!user?.email || !user?.name) {
    throw new Error("User information is incomplete");
  }

  if (!booking || !booking._id) {
    throw new Error("Booking information is incomplete");
  }

  const invoiceDetails = generateInvoice(booking);

  try {
    await sendEmail({
      to: user.email,
      subject: `Invoice for Your Booking: ${booking._id}`,
      body: `Dear ${user.name},\n\nThank you for booking with us!\n\nYour booking details:\n\n${invoiceDetails}\n\nWe look forward to seeing you.`,
    });

    console.log(`Invoice sent to ${user.email} for booking ID: ${booking._id}`);
  } catch (error) {
    console.error("Failed to send invoice:", error.message);
    throw new Error("Error sending invoice");
  }
};

module.exports = { sendInvoiceToUser };
