# Secure-102
This project aims to create a secure communication system between the university entity and its students and professors.
The system operates on a client-server architecture, prioritizing information security through various encryption technologies. 

## Key features include:

- ### Client-Server Architecture:
  The system comprises a server responsible for handling requests from clients (students and professors).
  Concurrency Handling: The server is designed to efficiently handle multiple client connections simultaneously.
- ### Concurrency Handling:
 The server is designed to efficiently handle multiple client connections simultaneously.
- ### Information Security:
  The system employs encryption technologies to ensure confidentiality, integrity, non-repudiation, authentication, and authorization.
  ## Encryption Technologies:
  1. ## Data Encryption:
     - ### Symmetric Encryption:
      Utilized to encrypt data transmitted between clients and the server. Symmetric encryption employs a single shared key for both encryption and decryption.
     - ### Hybrid Encryption:
     A combination of symmetric and asymmetric encryption techniques. Symmetric encryption is used for data encryption, while asymmetric encryption (e.g., PGP) is utilized for key exchange.
  2. ## Digital Signatures:
     - ### Integrity Verification: Professors can digitally sign data using cryptographic algorithms to ensure the data's integrity and authenticate its origin.
     - ### Non-Repudiation: Digital signatures provide proof of the signer's identity and prevent them from denying their involvement in the signed data.
  3. ## Certificate-based Authentication:
     - ### Client Authentication: Clients and professors are authenticated using digital certificates issued by a trusted Certificate Authority (CA). These certificates verify the identities of clients and professors, enhancing the system's security.
     - ### Server Authentication: The server presents its digital certificate to clients during the authentication process, ensuring clients are connecting to the legitimate server and not a malicious entity.  
## Usage:
1. Clone the repository.
2. Run the server application.
3. Clients can connect to the server using their credentials.
4. Follow the authentication process to access the university system securely.
