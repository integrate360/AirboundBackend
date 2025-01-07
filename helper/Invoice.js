const sgMail = require("@sendgrid/mail");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(process.env.Sendgrid_Key);

const generatePDFInvoice = (booking, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);

    // Header
    doc
      .fontSize(20)
      .fillColor("#007bff")
      .text("Booking Invoice", { align: "center" })
      .moveDown();

    // Booking Details
    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Booking ID: ${booking._id}`)
      .text(`Class Name: ${booking.className}`)
      .text(`Location: ${booking.location || "N/A"}`)
      .text(`Dates: ${booking.dates.join(", ")}`)
      .text(
        `Total Amount: ${
          booking.totalAmount ? `${booking.totalAmount}` : "N/A"
        }`
      )
      .moveDown();

    // Footer
    doc
      .fillColor("#007bff")
      .fontSize(12)
      .text("Thank you for choosing our service!", { align: "center" })
      .moveDown()
      .fillColor("black")
      .text(
        "For questions, reach us at airboundfitness@gmail.com or call +917506113884.",
        { align: "center" }
      );

    doc.end();

    writeStream.on("finish", () => resolve(outputPath));
    writeStream.on("error", (err) => reject(err));
  });
};

const sendEmailWithPDF = async ({ to, subject, body, attachmentPath }) => {
  const attachment = fs.readFileSync(attachmentPath).toString("base64");

  const msg = {
    to,
    from: "airboundfitness@gmail.com",
    subject,
    text: body,
    html: body,
    attachments: [
      {
        content: attachment,
        filename: "Invoice.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
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

  const outputPath = path.join(__dirname, "Invoice.pdf");

  try {
    // Generate the PDF invoice
    await generatePDFInvoice(booking, outputPath);

    // Send invoice to the user
    await sendEmailWithPDF({
      to: user.email,
      subject: `Invoice for Your Booking: ${booking._id}`,
      body: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 24px;">
            <strong>Thank You for Your Booking, ${user.name}!</strong>
          </div>
          <p style="font-size: 16px; color: #555; text-align: center; margin-top: 20px;">
            We are excited to confirm your booking. Please find your invoice attached.
          </p>
        </div>
      `,
      attachmentPath: outputPath,
    });

    console.log(`Invoice sent to ${user.email} for booking ID: ${booking._id}`);

    // Send notification email to the admin
    await sendEmailWithPDF({
      to: "airboundfitness@gmail.com",
      subject: "Airbound Fitness - You Have a New Booking",
      body: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 24px;">
            <strong>You Have a New Booking</strong>
          </div>
          <p style="font-size: 16px; color: #555; margin-top: 20px;">
            A new booking has been made by <strong>${user.name}</strong>.
          </p>
          <p style="font-size: 16px; color: #555;">
            <strong>Booking Details:</strong>
          </p>
          <ul style="font-size: 14px; color: #555; margin-left: 20px;">
            <li><strong>Booking ID:</strong> ${booking._id}</li>
            <li><strong>Item Name:</strong> ${booking.className}</li>
            <li><strong>Location:</strong> ${booking.location || "N/A"}</li>
${
  booking.isPackage
    ? `<li><strong>Dates:</strong> Multiple Dates</li>`
    : `<li><strong>Dates:</strong> ${booking.dates.join(", ")}</li>`
}
            <li><strong>Total Amount:</strong> ${
              booking.totalAmount || "N/A"
            }</li>
          </ul>
          <p style="font-size: 16px; color: #555; margin-top: 20px;">
            Please find the invoice attached for your records.
          </p>
        </div>
      `,
      attachmentPath: outputPath,
    });

    console.log(
      `Invoice and notification sent to admin for booking ID: ${booking._id}`
    );
  } catch (error) {
    console.error("Failed to send invoice:", error.message);
    throw new Error("Error sending invoice");
  } finally {
    // Clean up the PDF file after sending
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
};

module.exports = { sendInvoiceToUser };
