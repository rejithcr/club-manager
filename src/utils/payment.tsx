import { canOpenURL, openURL } from "expo-linking";

export const makeUpiPayment = async (amount: number, clubName: string, upiId: string) => {
  const upiUri = `https://gpay.app.goo.gl`;
  //TBD not working for personal acounts- ?pa=${upiId}&tn=${clubName}${" fee payment"}&am=${amount}&cu=INR&tid=txn1d1&tr=REF123456
  const canOpen = await canOpenURL(upiUri);

  if (canOpen) {
    openURL(upiUri);
  } else {
    alert("No UPI app found on device");
  }
};
