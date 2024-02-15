import User from "../models/user.js";
import {
  symmetricDecryptData,
  symmetricEncryptData,
  asymmetricEncryptData,
  asymmetricDecryptData,
  getPublicPrivateKeys,
  symmetricDecryptJsonData,
} from "../utils/crypt.js";

export async function handShake(req, res) {
  const clientPublicKey = req.body.publicKey;
  const userId = req.user.user._id;
  await User.findByIdAndUpdate(userId, { clientPublicKey }, { new: true });
  res.send((await getPublicPrivateKeys()).publicKey);
}

export async function setUserSession(req, res) {
  const encryptedSession = req.body.encryptedSession;
  const session = await asymmetricDecryptData(encryptedSession);
  const userId = req.user.user._id;
  await User.findByIdAndUpdate(userId, { session }, { new: true });

  const okMessageEncrypted = symmetricEncryptData(
    "Great Work All Done!",
    session
  );

  res.send(okMessageEncrypted);
}
export async function setUserProjects(req, res) {
  const encryptedData = req.body.data;
  const userId = req.user.user._id;

  const session = (await User.findById(userId)).session;
  const { projectName, projectMark } = symmetricDecryptJsonData(
    encryptedData,
    session
  );
  await User.findByIdAndUpdate(
    userId,
    { projectName, projectMark },
    { new: true }
  );
  res.send();
}

export async function closeSession(req, res) {
  const userId = req.user.user._id;
  await User.findByIdAndUpdate(userId, { session: undefined }, { new: true });
  res.send();
}
