// ✅ Email Verification Template
export const EMAIL_VERIFY_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f7;">

  <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f4f4f7; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table role="presentation" style="width:600px; max-width:90%; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(90deg,#16a34a,#065f46); padding:20px; text-align:center;">
              <h1 style="margin:0; color:#fff; font-size:24px;">✅ Verify Your Email</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
              <p>Hello <strong>{{username}}</strong>,</p>
              <p>Thanks for signing up! To complete your registration, please verify your email address by entering the OTP below:</p>

              <div style="text-align:center; margin:30px 0;">
                <p style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#15803d; background:#e6fcef; display:inline-block; padding:15px 30px; border-radius:8px;">
                  {{OTP_CODE}}
                </p>
              </div>

              <p>This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone for your account’s security.</p>

              <div style="text-align:center; margin:30px 0;">
                <a href="{{verification_link}}" 
                   style="background:#16a34a; color:#fff; text-decoration:none; padding:12px 25px; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
              <p style="word-break:break-all; color:#16a34a;">
                {{verification_link}}
              </p>

              <p>Welcome aboard! 🎉<br/>The <strong>YourApp</strong> Team</p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
              © 2025 YourApp. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

// ✅ Password Reset Template
export const PASSWORD_RESET_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f7;">

  <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f4f4f7; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table role="presentation" style="width:600px; max-width:90%; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(90deg,#6366f1,#312e81); padding:20px; text-align:center;">
              <h1 style="margin:0; color:#fff; font-size:24px;">🔒 Reset Your Password</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
              <p>Hello <strong>{{username}}</strong>,</p>
              <p>We received a request to reset your account password. Please use the OTP below to proceed:</p>

              <div style="text-align:center; margin:30px 0;">
                <p style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#4f46e5; background:#f0f2ff; display:inline-block; padding:15px 30px; border-radius:8px;">
                  {{OTP_CODE}}
                </p>
              </div>

              <p>This OTP will expire in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>

              <div style="text-align:center; margin:30px 0;">
                <a href="{{reset_link}}" 
                   style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 25px; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
                  Reset Password
                </a>
              </div>

              <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
              <p style="word-break:break-all; color:#4f46e5;">
                {{reset_link}}
              </p>

              <p>Thank you,<br/>The <strong>YourApp</strong> Team</p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
              © 2025 YourApp. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
