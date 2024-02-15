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

// const originalData = "Original data to sign";
// const { signature, hash } = createSignature(originalData);
// console.log("Generated Signature:", forge.util.bytesToHex(signature));
// console.log("Generated hash:", forge.util.bytesToHex(hash));
// console.log("Generated hash:", hash);
// const modifiedData = "Modified data";
// const isVerified = verifySignature(modifiedData, signature, hash);
// console.log("Is Modified Data Verified with Original Signature?", isVerified);
// Function to create an RSA signature using node-forge
// export function createSignature(data) {
//   try {
//     const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
//     var privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
//     privateKey = forge.pki.privateKeyFromPem(privateKey);

//     // Create SHA256 hash of the data
//     const md = forge.md.sha256.create();
//     md.update(data, "utf8");
//     const hash = md.digest().getBytes();

//     // Sign the hash using the private key
//     const signature = privateKey.sign(md);

//     return { signature, hash };
//   } catch (error) {
//     console.error("Signature creation error:", error);
//     return null;
//   }
// }
