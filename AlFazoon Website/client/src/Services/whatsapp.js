export const encodeMessageForWhatsApp = (phoneNumber, message) => {
  // Remove any non-numeric characters from the phone number (except the leading + sign if present)
  const cleanedPhoneNumber = phoneNumber?.replace(/[^+\d]/g, "");

  // Encode the message to make it URL-safe
  const encodedMessage = encodeURIComponent(message);

  // Construct the WhatsApp URL
  const whatsappLink = `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;

  return whatsappLink;
};

// Example usage

// export const Whats = () => {
//   const phoneNumber = "201069137667"; // Phone number in international format
//   const message =
//     "Hello, I’m interested i your services.Hello, I’m interested in your services."; // The message you want to pre-fill

//   const whatsappLink = encodeMessageForWhatsApp(phoneNumber, message);
//   console.log("WhatsApp Link:", whatsappLink);
// };
