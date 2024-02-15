import forge from "node-forge";
import fs from "fs";
import { getPublicPrivateKeys } from "./../../utils/crypt.js";
import User from './../../models/user.js';


export async function verifyCSR(req, res, next) {
  const csr = forge.pki.certificationRequestFromPem(req.body.data);
  const userId = req.user.user._id;
  const isValid = await validateCSR(csr, userId);

  if (isValid) {
    const certPem = await generateValidCertificate(csr, userId);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(certPem);
  } else {
    res.status(400).json({ message: "CSR validation failed" });
  }
}

async function validateCSR(csr, userId) {
  const user = await User.findById(userId);

  let storedPublicKey = user.clientPublicKey;
  storedPublicKey = forge.pki.publicKeyFromPem(storedPublicKey)
  storedPublicKey = forge.pki.publicKeyToPem(storedPublicKey)
  const valid =
    storedPublicKey &&
    storedPublicKey === forge.pki.publicKeyToPem(csr.publicKey);
  return valid;
}

async function generateValidCertificate(csrPem, userId) {
  try {
    const csr = csrPem;

    const caCertPem = fs.readFileSync("./is-ca.pem", { encoding: "utf-8" });
    const caKeyPem = (await getPublicPrivateKeys()).privateKey;
    const caCert = forge.pki.certificateFromPem(caCertPem);
    const caKey = forge.pki.privateKeyFromPem(caKeyPem);

    if (csr.verify()) {
      console.log("Certification request (CSR) verified.");
    } else {
      throw new Error("Signature not verified.");
    }

    console.log("Creating certificate...");
    const cert = forge.pki.createCertificate();

    cert.serialNumber = userId.toString();
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    cert.setSubject(csr.subject.attributes);
    cert.setIssuer(caCert.subject.attributes);

    cert.setExtensions([
      {
        name: "basicConstraints",
        cA: true,
      },
      {
        name: "keyUsage",
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: "subjectAltName",
        altNames: [
          {
            type: 6,
            value: "http://example.org/webid#me",
          },
        ],
      },
    ]);

    cert.publicKey = csr.publicKey;

    cert.sign(caKey);
    console.log("Certificate created.");

    console.log("\nWriting Certificate");
    return forge.pki.certificateToPem(cert);
  } catch (e) {
    console.log("error");
    console.log(e);
  }
}
