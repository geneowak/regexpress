import { verify } from "crypto";

/**
 * This is the public key counterpart of your public/private
 * key-pair combination you use to generate the signature.
 */
const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAqRq+5izQUvWcRezMetVWPi2KPE5PCLNfNJqEhX1uTpl3TPVogQKR
ZORGqM0w5ZquRZMS6hf7gOPlvKc06ET3/zNv8SMVM5rdMmiutFOxu8/8KqK5pAMo
JByH9snek9mLvvOOQ6qdvxuw/jVe3Lt29DyvJBqxFFI3DATPyziA/AfEbPifUUxO
SjwsXGZwacIhVb22Lz3LYYSLvAokVME4iwNspN8LxQqrj7dNRbaamhCfSLlnOYdL
llpIBjKENZKG7wnga1CvJAsvCGL7rP6ZO9fHIZRz8bIVUOY4QrlzyorqJWxzHafq
PSJ7vcY6COHfwvCUz0ifQH4Kg07Z1Zmw4wIDAQAB
-----END RSA PUBLIC KEY-----`;

class LicenseManager {
    /**
     * Verify the given data and signature.
     * 
     * @param {String} signature 
     * @param {String} data 
     */
    verifyLicenseKey(signature, data) {
        return verify(
            "sha256",
            Buffer.from(data),
            publicKey,
            Buffer.from(signature, "base64")
        )
    }
}

export default new LicenseManager