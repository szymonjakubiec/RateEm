import { Alert, BackHandler } from "react-native";
import { Resend } from "resend";
import emailjs from "@emailjs/react-native";
import { useEffect } from "react";

/**
 * Sends SMS verification - Twilio.
 * @async
 * @param {string} phone - The phone number to send verification code to.
 * @returns {Promise<boolean>} success
 */
const sendVerificationSMS = async (phone) => {
  // SendDirectSms(mobileNumber, bodySMS)
  // .then((res) => console.log("SMS sent successfully", res))
  // .catch((err) => console.error("Error sending SMS", err));
  try {
    const response = await fetch(`https://verify-5317-mnuord.twil.io/start-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phone,
        channel: "sms",
      }),
    });

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
 * Checks SMS verification - Twilio.
 * @async
 * @param {string} phone - The phone number to send verification code to.
 * @param {string} code - The verification code.
 * @returns {Promise<boolean>} success
 */
const checkVerificationSMS = async (phone, code) => {
  try {
    const response = await fetch(`https://verify-5317-mnuord.twil.io/check-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phone,
        code,
      }),
    });

    const json = await response.json();
    console.log("check");
    console.log(json);
    return json.success;
  } catch (error) {
    console.error("check error:", error);
    return false;
  }
};

/**
 * Sends e-mail verification.
 * @async
 * @param {string} mail - Mail to send verification code to.
 * @param {string} code - Code to verify.
 * @param {"verify"|"reset"} mode - e-mail mode.
 * @returns {Promise<number>} status code.
 */
const sendMail = async (mail, code, mode) => {
  // PK: Nodemailer

  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     // user: process.env.SERVER_USER,
  //     // pass: process.env.SERVER_PASSWORD,
  //     // user: global.user,
  //     // pass: global.pass,
  //     user: "noreply.rateem@gmail.com",
  //     pass: "Ochojec.123",
  //   }
  // });
  //
  // const emailHtml = await render(<Email url="https://example.com"/>);
  //
  // const info = await transporter.sendMail({
  //   from: '"RateEm" <noreply.rateem@gmail.com>',
  //   to: mail,
  //   subject: "Zweryfikuj konto RateEm",
  //   text: `Kod weryfikacyjny dla twojego konta na RateEm to:\n${ code }\nWpisz go w aplikacji RateEm.`,
  //   html: "<br>Kod weryfikacyjny dla twojego konta na RateEm to:<br><b>code</b><br>Wpisz go w aplikacji RateEm.",
  // });
  //
  // console.warn(info);
  // return info;

  // PK: Resend

  // const resend = new Resend("re_JH2d2yXA_51rTpkKZCH6iLdk8LXWyt8nD");
  //
  // const {data, error} = await resend.emails.send({
  //   from: "Updates <updates@example.com>",
  //   to: mail,
  //   subject: "Zweryfikuj konto RateEm",
  //   html: "<br>Kod weryfikacyjny dla twojego konta na RateEm to:<br><b>${code}</b><br>Wpisz go w aplikacji RateEm.",
  // });
  //
  // if (error) return console.error("bruh", {error});
  //
  // console.warn(data);
  // return data;

  // PK: Email.js
  try {
    const res = await emailjs.send(
      "service_nn7mz3o",
      mode === "verify" ? "template_za4zsi5" : "template_0x5vgf6",
      {
        mail,
        code,
      },
      {
        publicKey: "tEwluatDV5HTFU6dq",
      }
    );
    return res.status;
  } catch (error) {
    return error.status;
  }
};

/**
 * Creates custom alert box with given text.
 * @param {string} text - alert text.
 */
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

/**
 * Gets address for given coordinates.
 *
 * @async
 * @function
 * @param {number} latitude - latitude
 * @param {number} longitude - longitude
 * @returns {Promise<Object[]>} Array of EU election objects
 */
const getUserAddress = async (latitude, longitude) => {
  const googleApiKey = "AIzaSyBIHMXgF1F5nHAR8SE-W273o2C7dCjzvbQ";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${googleApiKey}&language=pl`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching EU elections:", error);
    return null;
  }
};

/**
 * Goes back in navigation.
 * @function
 * @param navigation - navigation.
 */
function goBack(navigation) {
  // Pk: Exiting app from HomeScreen
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);
}

module.exports = { sendVerificationSMS, checkVerificationSMS, sendMail, alert, goBack, getUserAddress };
