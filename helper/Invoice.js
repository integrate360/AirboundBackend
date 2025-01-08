const sgMail = require("@sendgrid/mail");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
sgMail.setApiKey(process.env.Sendgrid_Key);

const generatePDFInvoice = (booking, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);

    // Add company logo
    const logoPath = path.join(__dirname, "airbound.jpg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 100 });
    }

    // Add Invoice details (random invoice number and date)
    const invoiceDate = new Date().toLocaleDateString("en-GB");
    const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`; // Random 6-digit number

    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Invoice Number: ${invoiceNumber}`, 400, 50, { align: "right" })
      .text(`Invoice Date: ${invoiceDate}`, 400, 70, { align: "right" })
      .moveDown(3);

    // Header
    doc
      .fontSize(20)
      .fillColor("#007bff")
      .text("Booking Invoice", { align: "center" })
      .moveDown(2);

    // Booking Details Section
    doc
      .fontSize(14)
      .fillColor("black")
      .text("Booking Details:", { underline: true })
      .moveDown();
    
    const detailsTable = [
      ["Class Name", booking.className],
      ["Location", booking.location || "N/A"],
      ["Dates", booking.dates.join(", ")],
      ["Total Amount", `${booking.totalAmount || "N/A"}`],
    ];

    detailsTable.forEach(([label, value], index) => {
      const y = doc.y;
      doc
        .fontSize(12)
        .text(label, 50, y)
        .text(value, 200, y, { align: "right" });
      if (index < detailsTable.length - 1) doc.moveDown(1);
    });

    // Draw a line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#cccccc").moveDown(2);

    // Get in Touch Section
    doc
      .fontSize(16)
      .fillColor("#007bff")
      .text("Get in Touch", { align: "center" })
      .moveDown(0.5);

    const tableData = [
      { section: "Phone", details: "+91 75061 13884" },
      { section: "Email", details: "hello@airbound.in" },
      { section: "Address", details: `2nd floor Empressa,\nRam Krishna Nagar, 2nd Road,\nKhar West, Mumbai - 400052` },
    ];

    // Loop through and display the contact information as a table
    tableData.forEach((row) => {
      const y = doc.y;
      doc
        .fontSize(12)
        .fillColor("black")
        .text(row.section, 50, y)
        .text(row.details, 200, y, { align: "right" });
      doc.moveDown(1);
    });

    // Footer Section
    doc
      .moveDown(2)
      .fillColor("#007bff")
      .fontSize(12)
      .text("Thank you for choosing our service!", { align: "center" })
      .moveDown()
      .fillColor("black")
      .text(
        "For questions, reach us at hello@airbound.in or call +91 75061 13884.",
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

  if (!booking || !booking.className || !booking.dates) {
    throw new Error("Booking information is incomplete");
  }

  const outputPath = path.join(__dirname, "Invoice.pdf");

  try {
    // Generate the PDF invoice
    await generatePDFInvoice(booking, outputPath);

    // Send invoice to the user
    await sendEmailWithPDF({
      to: user.email,
      subject: `Invoice for Your Booking - ${booking.name}`,
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

    console.log(`Invoice sent to ${user.email} for booking ID: ${booking.name}`);

    // Send notification email to the admin
    await sendEmailWithPDF({
      to: "vinodku4848@gmail.com",
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
              booking.totalAmount || "N/A"
            }</li>
          </ul>
        </div>
      `,
      attachmentPath: outputPath,
    });

    console.log(`Invoice and notification sent to admin for booking ID: ${booking.name}`);
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
