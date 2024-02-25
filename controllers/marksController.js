import forge from "node-forge";
import User from "../models/user.js";

export async function professorAddMarks(req, res) {
  try {
    var { data, signature, hash } = req.body;

    signature = forge.util.hexToBytes(signature);
    hash = forge.util.hexToBytes(hash);

    const userId = req.user.user._id;
    const user = await User.findById(userId);

    if (user.role !== "teacher") res.status(403);

    var publicKey = user.clientPublicKey;
    publicKey = forge.pki.publicKeyFromPem(publicKey);

    const md = forge.md.sha256.create();
    md.update(data, "utf8");
    const computedHash = md.digest().getBytes();

    const isHashEqual = computedHash === hash;
    const verified = isHashEqual && publicKey.verify(computedHash, signature);
    if (verified) res.status(200).send();
    else res.status(400).send();
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
