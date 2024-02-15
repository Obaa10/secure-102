import crypto from "crypto-js";
import nodeForge from "node-forge";
import fs from "fs";

export async function asymmetricEncryptData(data) {
  const { publicKey } = await getPublicPrivateKeys();
  const encryptedData = nodeForge.pki
    .publicKeyFromPem(publicKey)
    .encrypt(data, "RSA-OAEP");
  return encryptedData;
}

export async function asymmetricDecryptData(encryptedData) {
  const { privateKey } = await getPublicPrivateKeys();
  const decryptedData = nodeForge.pki
    .privateKeyFromPem(privateKey)
    .decrypt(nodeForge.util.decode64(encryptedData), "RSA-OAEP");
  return decryptedData;
}

export function symmetricEncryptData(data, key) {
  const hashDigest = crypto.AES.encrypt(
    JSON.stringify(data),
    key.toString()
  ).toString();
  return hashDigest;
}

export function symmetricDecryptData(encryptedData, key) {
  var bytes = crypto.AES.decrypt(encryptedData, key.toString());
  return bytes.toString(crypto.enc.Utf8);
}

export function symmetricDecryptJsonData(encryptedData, key) {
  var bytes = crypto.AES.decrypt(encryptedData, key.toString());
  return JSON.parse(bytes.toString(crypto.enc.Utf8));
}

///JUST FOR TESTING
//const token = await asymmetricEncryptData("123456789");
//console.log(nodeForge.util.encode64(token));
//const data = await asymmetricDecryptData(token);
//console.log(data);
//console.log(symmetricEncryptData({ projectName: "E2", projectMark: 20 },"123456789"));

export async function getPublicPrivateKeys() {
  try {
    let privateKey = await fs.promises.readFile("./private.pem", {
      encoding: "utf8",
    });
    let publicKey = await fs.promises.readFile("./public.pem", {
      encoding: "utf8",
    });
    if (!privateKey || !publicKey) {
      return await generatePublicPrivateKeys();
    } else {
      return { privateKey, publicKey };
    }
  } catch (e) {
    return await generatePublicPrivateKeys();
  }
}

async function generatePublicPrivateKeys() {
  const keypair = nodeForge.pki.rsa.generateKeyPair({ bits: 2048 });
  const publicKey = nodeForge.pki.publicKeyToPem(keypair.publicKey);
  const privateKey = nodeForge.pki.privateKeyToPem(keypair.privateKey);

  fs.promises.writeFile(`./private.pem`, privateKey);
  fs.promises.writeFile(`./public.pem`, publicKey);

  return { privateKey, publicKey };
}
