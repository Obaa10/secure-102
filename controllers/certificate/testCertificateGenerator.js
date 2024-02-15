import forge from "node-forge";
import fs from "fs";

export async function generateCSR(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(await generateCSRFunction());
}

async function generateCSRFunction() {
  {
    const pki = forge.pki;

    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

    fs.promises.writeFile("./test-private.pem", privateKey);
    fs.promises.writeFile("./test-public.pem", publicKey);

    const prKey = pki.privateKeyFromPem(privateKey);
    const pubKey = pki.publicKeyFromPem(publicKey);

    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = pubKey;
    csr.setSubject([
      {
        name: "commonName",
        value: "example.org",
      },
    ]);
    csr.setAttributes([
      {
        name: "challengePassword",
        value: "password",
      },
    ]);

    csr.sign(prKey);

    return forge.pki.certificationRequestToPem(csr);
  }
}
