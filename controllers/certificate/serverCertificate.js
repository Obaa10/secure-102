import forge from "node-forge";
import fs from "fs";
import { getPublicPrivateKeys } from "./../../utils/crypt.js";

const attrs = [
  {
    name: "commonName",
    value: "rootCA.org",
  },
  {
    name: "countryName",
    value: "SY",
  },
  {
    shortName: "ST",
    value: "SYRIA",
  },
  {
    name: "localityName",
    value: "DAMAS",
  },
  {
    name: "organizationName",
    value: "DAMASCUS UNIVERSITY",
  },
  {
    shortName: "OU",
    value: "Testy",
  },
];

export async function generateServerCertificate(req, res) {
  const fileName = "./is-ca.pem";

  if (fs.existsSync(fileName)) {
    const savedCertificate = await fs.promises.readFile("./is-ca.pem", {
      decoding: "utf-8",
    });
    if (savedCertificate) {
      res.send();
      return;
    }
  }

  const pki = forge.pki;

  const keys = await getPublicPrivateKeys();
  const RootCAPrivateKey = keys.privateKey;
  const RootCAPublicKey = keys.publicKey;

  const prKey = pki.privateKeyFromPem(RootCAPrivateKey);
  const pubKey = pki.publicKeyFromPem(RootCAPublicKey);

  const cert = pki.createCertificate();

  cert.publicKey = pubKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.sign(prKey);

  const pmCertificate = pki.certificateToPem(cert);
 
  fs.writeFileSync(fileName, pmCertificate, {
    encoding: "utf-8",
  });
  res.json({ message: "generate new certificate" });
}
