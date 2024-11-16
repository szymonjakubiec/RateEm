const {Alert} = require("react-native");


/**
 *
 * @param {string} phone - The phone number to send verification code to.
 * @returns {Promise<boolean>} success
 */
const sendVerificationSMS = async (phone) => {
  // SendDirectSms(mobileNumber, bodySMS)
  // .then((res) => console.log("SMS sent successfully", res))
  // .catch((err) => console.error("Error sending SMS", err));
  try {
    const response = await fetch(
      `https://verify-5317-mnuord.twil.io/start-verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phone,
          channel: "sms",
        }),
      },
    );

    const json = await response.json();
    console.log("send");
    console.log(json);
    return json.success;
  } catch (err) {
    console.error("send error:", err);
    return false;
  }
};

/**
 *
 * @async
 * @param {string} phone - The phone number to send verification code to.
 * @param {string} code - The verification code.
 * @returns {Promise<boolean>} success
 */
const checkVerification = async (phone, code) => {
  try {
    const response = await fetch(
      `https://verify-5317-mnuord.twil.io/check-verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phone,
          code,
        }),
      },
    );

    const json = await response.json();
    console.log("check");
    console.log(json);
    return json.success;
  } catch (error) {
    console.error("check error:", error);
    return false;
  }
};


const sendVerificationMail = async (mail, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // user: process.env.SERVER_USER,
      // pass: process.env.SERVER_PASSWORD,
      user: global.user,
      pass: global.pass,
    }
  });

  const info = await transporter.sendMail({
    from: '"RateEm" <noreply.rateem@gmail.com>',
    to: mail,
    subject: "Zweryfikuj konto RateEm",
    text: `Kod weryfikacyjny dla twojego konta na RateEm to:\n${ code }\nWpisz go w aplikacji RateEm.`,
    html: "<br>Kod weryfikacyjny dla twojego konta na RateEm to:<br><b>code</b><br>Wpisz go w aplikacji RateEm.",
  });

  console.log(info);
  return info;

};


const alert = (text) => {
  Alert.alert(
    "❌ Błąd ❌",
    text,
    [
      {
        text: "OK 💀",
        onPress: () => console.log("RegisterScreen.jsx:34 ~ OK kliknięty."),
      },
    ],
    {
      cancelable: true,
      onDismiss: () => console.log("RegisterScreen.jsx:38 ~ Kliknięto poza alert."),
    }
  );
};

module.exports = {sendVerificationSMS, checkVerification, sendVerificationMail, alert};
