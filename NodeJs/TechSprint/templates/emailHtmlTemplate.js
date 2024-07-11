export const generateOtpEmailHtml = (otp, otpType) => `
  <div style="font-family: 'Trebuchet MS', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #000; color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
    <h2 style="background: linear-gradient(45deg, #1a1a1a, #333); padding: 20px; text-align: center; color: #e6e6e6; border-radius: 10px 10px 0 0; font-family: 'Orbitron', sans-serif;">Your OTP Code</h2>
    <p style="font-size: 16px; color: #cfcfcf;">Dear User,</p>
    <p style="font-size: 16px; color: #cfcfcf;">We received a request to       ${otpType}
. Please use the following OTP (One Time Password) to proceed:</p>
    <div style="font-size: 36px; font-weight: bold; text-align: center; margin: 20px 0; color: #00ff00; font-family: 'Courier New', Courier, monospace;">
      ${otp}
    </div>
    <p style="font-size: 16px; color: #cfcfcf;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    <p style="font-size: 16px; color: #cfcfcf;">Thank you,<br/>MokBhaiMJ Team</p>
    <hr style="border: none; border-top: 1px solid #444;"/>
    <p style="font-size: 12px; color: #888;">If you have any questions, contact our support team at support@example.com.</p>
  </div>
`;
