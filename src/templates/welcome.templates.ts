export const welcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 48px 40px; text-align: center;">
              <div style="display: inline-block; background-color: #f97316; border-radius: 12px; padding: 10px 20px; margin-bottom: 20px;">
                <span style="color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">E-Commerce</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; line-height: 1.3;">
                Welcome, ${name}! 🎉
              </h1>
              <p style="margin: 12px 0 0; color: #94a3b8; font-size: 15px;">Your account has been created successfully</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px; color: #334155; font-size: 15px; line-height: 1.7;">
              <p style="margin: 0 0 20px;">Hi <strong>${name}</strong>,</p>
              <p style="margin: 0 0 28px; color: #475569;">
                Thank you for joining us. We are thrilled to have you as part of our community. Your account is all set and ready to go.
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 28px;" />

              <!-- Steps -->
              <p style="margin: 0 0 16px; font-weight: 700; color: #0f172a; font-size: 15px;">Get started in 3 steps:</p>

              <!-- Step 1 -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="vertical-align: top; padding-right: 14px;">
                    <div style="background-color: #f97316; color: #ffffff; font-size: 13px; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px;">1</div>
                  </td>
                  <td style="vertical-align: top; color: #475569; font-size: 14px; padding-top: 4px;">
                    <strong style="color: #0f172a;">Log in</strong> using your email and password
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="vertical-align: top; padding-right: 14px;">
                    <div style="background-color: #f97316; color: #ffffff; font-size: 13px; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px;">2</div>
                  </td>
                  <td style="vertical-align: top; color: #475569; font-size: 14px; padding-top: 4px;">
                    <strong style="color: #0f172a;">Browse products</strong> and add them to your cart
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="vertical-align: top; padding-right: 14px;">
                    <div style="background-color: #f97316; color: #ffffff; font-size: 13px; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px;">3</div>
                  </td>
                  <td style="vertical-align: top; color: #475569; font-size: 14px; padding-top: 4px;">
                    <strong style="color: #0f172a;">Place your order</strong> and track it in real time
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #475569;">
                If you have any questions, feel free to reach out to our support team anytime.
              </p>

              <p style="margin: 24px 0 0; color: #0f172a;">
                Warm regards,<br />
                <strong style="color: #f97316;">The E-Commerce Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 6px; color: #94a3b8; font-size: 12px;">
                If you did not create this account, you can safely ignore this email.
              </p>
              <p style="margin: 0; color: #cbd5e1; font-size: 12px;">
                &copy; ${new Date().getFullYear()} E-Commerce. All rights reserved.
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
