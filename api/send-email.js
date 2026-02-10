import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { to, subject, orderDetails, type = 'order_confirmation' } = req.body;

        if (!to || !orderDetails) {
            return res.status(400).json({ error: 'Missing required fields: to, orderDetails' });
        }

        // Create transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        // Generate HTML email based on type
        let htmlContent = '';

        if (type === 'order_confirmation') {
            htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Baba Ji Achar</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #fef3e2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3e2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 900;">🥘 Baba Ji Achar</h1>
              <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 14px; font-weight: 600;">पीढ़ियों की परंपरा से बना शुद्ध देसी अचार</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✅</span>
              </div>
              <h2 style="margin: 0 0 10px 0; color: #1c1917; font-size: 28px; font-weight: 800;">Order Confirmed!</h2>
              <p style="margin: 0; color: #78716c; font-size: 16px; font-weight: 500;">Thank you for your order, ${orderDetails.customerName}!</p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3e2; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 15px; border-bottom: 2px solid #e7e5e4;">
                    <p style="margin: 0; color: #78716c; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
                    <p style="margin: 5px 0 0 0; color: #1c1917; font-size: 18px; font-weight: 800;">${orderDetails.orderId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 15px;">
                    <p style="margin: 0 0 10px 0; color: #78716c; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Items</p>
                    ${orderDetails.items.map(item => `
                      <div style="margin-bottom: 8px; padding: 8px 0; border-bottom: 1px solid #e7e5e4;">
                        <p style="margin: 0; color: #1c1917; font-size: 14px; font-weight: 600;">${item.productName} (${item.size}) x${item.quantity}</p>
                        <p style="margin: 5px 0 0 0; color: #ea580c; font-size: 14px; font-weight: 700;">₹${item.price * item.quantity}</p>
                      </div>
                    `).join('')}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 15px; border-top: 2px solid #e7e5e4;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #78716c; font-size: 14px; font-weight: 600;">Total Amount</p>
                        </td>
                        <td align="right" style="padding: 8px 0;">
                          <p style="margin: 0; color: #ea580c; font-size: 20px; font-weight: 900;">₹${orderDetails.totalAmount}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #78716c; font-size: 14px; font-weight: 600;">Payment Method</p>
                        </td>
                        <td align="right" style="padding: 8px 0;">
                          <p style="margin: 0; #1c1917; font-size: 14px; font-weight: 700;">${orderDetails.paymentMethod}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f5f5f4; border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 10px 0; color: #78716c; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">📍 Delivery Address</p>
                <p style="margin: 0; color: #1c1917; font-size: 14px; font-weight: 600; line-height: 1.6;">
                  ${orderDetails.customerName}<br>
                  ${orderDetails.address}<br>
                  ${orderDetails.city}, ${orderDetails.pincode}<br>
                  Phone: ${orderDetails.phone}
                </p>
              </div>
            </td>
          </tr>

          <!-- WhatsApp CTA -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="https://wa.me/917754865997?text=${encodeURIComponent(`Order ${orderDetails.orderId} - Status Update Request`)}" 
                 style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);">
                📱 Track on WhatsApp
              </a>
              <p style="margin: 15px 0 0 0; color: #78716c; font-size: 12px; font-weight: 500;">
                For any queries, contact us on WhatsApp
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1c1917; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #a8a29e; font-size: 14px; font-weight: 600;">Baba Ji Achar - Bhojnamrit Foods</p>
              <p style="margin: 0; color: #78716c; font-size: 12px; font-weight: 500;">Prayagraj, Uttar Pradesh, India</p>
              <p style="margin: 15px 0 0 0; color: #78716c; font-size: 12px; font-weight: 500;">
                <a href="https://babajiachar.in" style="color: #ea580c; text-decoration: none;">babajiachar.in</a> | 
                <a href="mailto:mailbabajiachar@gmail.com" style="color: #ea580c; text-decoration: none;">mailbabajiachar@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
        } else if (type === 'status_update') {
            htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Status Update - Baba Ji Achar</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fef3e2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3e2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #d97706 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 900;">Order Status Update</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="margin: 0 0 20px 0; color: #1c1917; font-size: 24px;">Order ${orderDetails.orderId}</h2>
              <p style="margin: 0; color: #78716c; font-size: 16px;">Status: <strong style="color: #ea580c;">${orderDetails.status}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1c1917; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #a8a29e; font-size: 12px;">Baba Ji Achar - Bhojnamrit Foods</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
        }

        // Send email
        const info = await transporter.sendMail({
            from: `"Baba Ji Achar" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject || `Order Confirmation - ${orderDetails.orderId}`,
            html: htmlContent,
        });

        console.log('Email sent successfully:', info.messageId);

        return res.status(200).json({
            success: true,
            messageId: info.messageId,
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send email',
            details: error.message
        });
    }
}

