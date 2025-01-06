const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.Sendgrid_Key);

const generateInvoice = (booking) => {
  return `
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; margin-bottom: 20px;">
      <tr>
        <td style="padding: 15px; background-color: #007bff; color: white; font-size: 20px; font-weight: bold; text-align: center;" colspan="2">Booking Invoice</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-size: 16px; font-weight: bold; background-color: #f9f9f9;">Booking ID:</td>
        <td style="padding: 10px; font-size: 16px; background-color: #f9f9f9;">${
          booking._id
        }</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-size: 16px; font-weight: bold;">Class Name:</td>
        <td style="padding: 10px; font-size: 16px;">${booking.className}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-size: 16px; font-weight: bold;">Location:</td>
        <td style="padding: 10px; font-size: 16px;">${
          booking.location || "N/A"
        }</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-size: 16px; font-weight: bold;">Dates:</td>
        <td style="padding: 10px; font-size: 16px;">${booking.dates.join(
          ", "
        )}</td>
      </tr>
      
      <tr>
        <td style="padding: 10px; font-size: 16px; font-weight: bold;">Total Amount:</td>
        <td style="padding: 10px; font-size: 16px;">${
          booking.totalAmount ? `${booking.totalAmount} rupees` : "N/A"
        }</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 20px; font-size: 16px; background-color: #f9f9f9; text-align: center; color: #007bff;">
          <strong>We look forward to seeing you!</strong>
        </td>
      </tr>
    </table>

    <table style="width: 100%; font-family: Arial, sans-serif; border-top: 2px solid #007bff; margin-top: 20px;">
      <tr>
        <td style="padding: 10px; font-size: 14px; color: #555;">
          <strong>Thank you for choosing our service!</strong><br>
          For any questions, feel free to reach us at <a href="mailto:airboundfitness@gmail.com" style="color: #007bff;">airboundfitness@gmail.com</a> or call us at <a href="tel:+917506113884" style="color: #007bff;">+917506113884</a>.
        </td>
      </tr>
    </table>
  `;
};

const sendEmail = async ({ to, subject, body }) => {
  const msg = {
    to,
    from: "airboundfitness@gmail.com",
    subject,
    text: body,
    html: body, // Using HTML body directly
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
      body: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 24px;">
            <strong>Thank You for Your Booking, ${user.name}!</strong>
          </div>
          <p style="font-size: 16px; color: #555; text-align: center; margin-top: 20px;">
            We are excited to confirm your booking. Below are the details:
          </p>
          ${invoiceDetails}
        </div>
      `,
    });

    console.log(`Invoice sent to ${user.email} for booking ID: ${booking._id}`);
  } catch (error) {
    console.error("Failed to send invoice:", error.message);
    throw new Error("Error sending invoice");
  }
};

module.exports = { sendInvoiceToUser };
