import User from "../models/user.js";
import {symmetricDecryptJsonData,symmetricEncryptData} from "../utils/crypt.js";


export async function updateProfile(req, res) {
  try {
    const userId = req.user.user._id;
    const decryptedData = symmetricDecryptJsonData(req.body.data, req.user.user.idNumber);
    const { phoneNumber, gender, birthdate, telephone } = decryptedData;

    const user = await User.findByIdAndUpdate(
      userId,
      { phoneNumber, gender, birthdate, telephone },
      { new: true } // To return the updated user after the update operation
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProfile(req, res) {
  try {
    const userId = req.user.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const encryptedData = symmetricEncryptData(user, req.user.user.idNumber);
    console.log(encryptedData);
    res.status(200).json({ encryptedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
