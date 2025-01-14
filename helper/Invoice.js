const sgMail = require("@sendgrid/mail");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
sgMail.setApiKey(process.env.Sendgrid_Key);

const addCompanyDetails = (doc) => {
  doc
    .fontSize(16)
    .fillColor("#007bff")
    .text("Company Details", 50, 150)
    .moveDown(0.5);

  const boxStart = doc.y;
  doc.strokeColor("#e6e6e6").lineWidth(1).rect(50, boxStart, 500, 80).stroke();

  doc
    .fontSize(12)
    .fillColor("black")
    .font("Helvetica-Bold")
    .text("Airbound", 70, boxStart + 15)
    .font("Helvetica")
    .fontSize(10)
    .text("2nd floor Empressa,", 70, boxStart + 35)
    .text("Ram Krishna Nagar, 2nd Road,", 70, boxStart + 50)
    .text("Khar West, Mumbai - 400052", 70, boxStart + 65);

  doc.moveDown(4);
};

const addBillToSection = (doc, user) => {
  doc.fontSize(16).fillColor("#007bff").text("Customer Details").moveDown(0.5);

  const boxStart = doc.y;
  doc.strokeColor("#e6e6e6").lineWidth(1).rect(50, boxStart, 500, 80).stroke();

  doc
    .fontSize(10)
    .fillColor("black")
    .text(`Name: ${user.name || "N/A"}`, 70, boxStart + 15)
    .text(`Email: ${user.email || "N/A"}`, 70, boxStart + 35)
    .text(`Phone: ${user.phone || "N/A"}`, 70, boxStart + 55);

  doc.moveDown(4);
};

const addBookingDetails = (doc, booking) => {
  doc.fontSize(16).fillColor("#007bff").text("Booking Details").moveDown(0.5);

  const boxStart = doc.y;
  doc.strokeColor("#e6e6e6").lineWidth(1).rect(50, boxStart, 500, 100).stroke();

  doc
    .fontSize(10)
    .fillColor("black")
    .text(`Class Name: ${booking.className}`, 70, boxStart + 15)
    .text(`Location: ${booking.location || "N/A"}`, 70, boxStart + 35)
    .text(
      `Dates: ${
        booking?.isPackage ? "Multiple Dates" : booking.dates.join(", ")
      }`,
      70,
      boxStart + 55
    )
    .text(`Total Amount: INR ${booking.totalAmount}`, 70, boxStart + 75);

  doc.moveDown(4);
};

const addContactInfo = (doc) => {
  doc.fontSize(16).fillColor("#007bff").text("Contact Details").moveDown(0.5);

  const boxStart = doc.y;
  doc.strokeColor("#e6e6e6").lineWidth(1).rect(50, boxStart, 500, 80).stroke();

  doc
    .fontSize(10)
    .fillColor("black")
    .text("Phone: +917506113884", 70, boxStart + 15)
    .text("Email: hello@airbound.in", 70, boxStart + 35)
    .text("Website: www.airbound.in", 70, boxStart + 55);

  doc.moveDown(2);
};

const generatePDFInvoice = (booking, user, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);

    // Header with Logo and Invoice Info
    const logoPath = path.join(__dirname, "airbound.jpg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 60 });
    }

    // Invoice Details - Moved to top right with better formatting
    const invoiceDate = new Date().toLocaleDateString("en-GB");
    const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("black")
      .text(`Invoice Number: ${invoiceNumber}`, 300, 40)
      .text(`Invoice Date: ${invoiceDate}`, 300, 60);

    // Blue separator line
    doc
      .strokeColor("#007bff")
      .lineWidth(2)
      .moveTo(50, 120)
      .lineTo(550, 120)
      .stroke();

    // Add sections with improved spacing
    addCompanyDetails(doc);
    addBillToSection(doc, user);
    addBookingDetails(doc, booking);
    addContactInfo(doc);

    // Footer with better styling
    doc
      .fontSize(14)
      .fillColor("#007bff")
      .font("Helvetica-Bold")
      .text("Thank you for choosing our service!", { align: "center" })
      .moveDown()
      .fontSize(10)
      .fillColor("#666666")
      .font("Helvetica")
      .text("For any queries, please contact us at hello@airbound.in", {
        align: "center",
      });

    doc.end();
    writeStream.on("finish", () => resolve(outputPath));
    writeStream.on("error", reject);
  });
};
const sendEmail = async ({ to, subject, body, attachmentPath }) => {
  const msg = {
    to,
    from: "airboundfitness@gmail.com",
    subject,
    text: body,
    html: body,
    attachments: [
      {
        content: fs.readFileSync(attachmentPath).toString("base64"),
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
  if (!user?.email || !user?.name)
    throw new Error("User information is incomplete");
  if (!booking?.className || !booking?.dates)
    throw new Error("Booking information is incomplete");

  const outputPath = path.join(__dirname, "Invoice.pdf");

  try {
    await generatePDFInvoice(booking, user, outputPath);

    const customerEmail = {
      to: user.email,
      subject: `Invoice for Your Booking - ${booking.className}`,
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
    };

    const adminEmail = {
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
            <li><strong>Item Name:</strong> ${booking.className}</li>
            <li><strong>Location:</strong> ${booking.location || "N/A"}</li>
            <li><strong>Dates:</strong> ${booking.dates.join(", ")}</li>
            <li><strong>Total Amount:</strong> ${
              `INR ${booking.totalAmount}` || "N/A"
            }</li>
          </ul>
        </div>
      `,
      attachmentPath: outputPath,
    };

    await Promise.all([sendEmail(customerEmail), sendEmail(adminEmail)]);

    console.log(`Invoices sent successfully for booking: ${booking.className}`);
  } catch (error) {
    console.error("Failed to send invoice:", error.message);
    throw new Error("Error sending invoice");
  } finally {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
};

module.exports = { sendInvoiceToUser };
