import * as bs58 from 'bs58';
import * as ByteBuffer from 'bytebuffer';
import {createHash} from 'crypto';
import * as secp256k1 from 'secp256k1';
import {Types} from './serializer';
import {SignedTransaction, Transaction} from './transaction';

export type KeyRole = 'owner' | 'active' | 'posting' | 'memo';

// See signature.js from steemit-js
const RECOVERY_INCREMENT = 4 /* compressed */ + 27 /* compact */;

// See elliptic_common.cpp from the steemit fc library
function isCanonical(buf: Buffer): boolean {
  // Subtract 1 from the index since we don't have the recovery number here
  return !(buf[0] & 0x80)
            && !(buf[0] === 0 && !(buf[1] & 0x80))
            && !(buf[32] & 0x80)
            && !(buf[32] === 0 && !(buf[33] & 0x80));
}

function sha256(val: Buffer|string): Buffer {
  return createHash('sha256').update(val).digest();
}

export class PrivateKey {

  private readonly role!: KeyRole;
  private readonly key: Buffer;

  public static fromWif(wif: string) {
    if (!wif) {
      throw new Error('WIF not provided');
    }
    const buf: Buffer = bs58.decode(wif);
    if (buf[0] !== 0x80) {
      throw new Error('Invalid prefix');
    }
    const checksum = buf.slice(-4);
    const key = buf.slice(0, -4);
    if (!sha256(sha256(key)).slice(0, 4).equals(checksum)) {
      throw new Error('Invalid checksum');
    }
    // Remove 0x80 from the actual key
    return new PrivateKey(key.slice(1));
  }

  public static fromSeed(seed: string) {
    return new PrivateKey(sha256(seed));
  }

  public static fromLogin(username: string, password: string, role: KeyRole) {
    const seed = username + role + password;
    return PrivateKey.fromSeed(seed);
  }

  constructor(buffer: Buffer) {
    this.key = buffer;
  }

  public signTransaction(tx: Transaction, chainId: string): SignedTransaction {
    const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY,
                                  ByteBuffer.LITTLE_ENDIAN);
    Types.transaction(buffer, tx);
    const trans: SignedTransaction = {
      ...tx,
      signatures: [],
    };

    const cid = Buffer.from(chainId, 'hex');
    const buf = Buffer.from(buffer.flip().toBuffer());
    const digest = sha256(Buffer.concat([cid, buf]));

    const signed = this.sign(digest);
    trans.signatures.push(signed.toString('hex'));
    return trans;
  }

  public sign(msg: Buffer): Buffer {
    let sr: {signature: Buffer, recovery: number};
    let nonce = 0;
    do {
      const options = {
        data: sha256(Buffer.concat([msg, Buffer.from([nonce++])])),
      };
      sr = secp256k1.sign(msg, this.key, options);
    } while (!isCanonical(sr.signature));

    const buffer = Buffer.alloc(65);
    buffer.writeUInt8(sr.recovery + RECOVERY_INCREMENT, 0);
    sr.signature.copy(buffer, 1);
    return buffer;
  }

  public createPublic() {
    return new PublicKey(secp256k1.publicKeyCreate(this.key));
  }

  public toWif(): string {
    const privKey = Buffer.concat([Buffer.from([0x80]), this.key]);
    const checksum = sha256(sha256(privKey)).slice(0, 4);
    const privWif = Buffer.concat([privKey, checksum]);
    return bs58.encode(privWif);
  }
}

export class PublicKey {

  public readonly key: Buffer;

  constructor(key: Buffer) {
    this.key = key;
  }

  public verify(msg: Buffer, signature: Buffer) {
    return secp256k1.verify(msg, signature, this.key);
  }

  public toWif(prefix: string) {
    const checksum = createHash('ripemd160').update(this.key).digest();
    const buf = Buffer.concat([this.key, checksum.slice(0, 4)]);
    return prefix + bs58.encode(buf);
  }
}
