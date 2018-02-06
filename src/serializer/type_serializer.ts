import {Asset, AssetUnit} from '../asset';
import * as ByteBuffer from 'bytebuffer';
import {Operation} from '../operation';
import {SteemUtil} from '../util';
import {Types} from './types';
import * as Long from 'long';

export type Serializer = (buf: ByteBuffer, value: any) => void;

export class TypeSerializer {

  public static string(buf: ByteBuffer, value: string) {
    buf.writeVString(value);
  }

  public static int16(buf: ByteBuffer, value: number) {
    buf.writeInt16(value);
  }

  public static uint16(buf: ByteBuffer, value: number) {
    buf.writeUint16(value);
  }

  public static uint32(buf: ByteBuffer, value: number) {
    buf.writeUint32(value);
  }

  public static date(buf: ByteBuffer, value: Date|number|string) {
    if (typeof(value) !== 'number') {
      if (value instanceof Date) {
        value = Math.floor(value.getTime() / 1000);
      } else if (typeof(value) === 'string') {
        value = SteemUtil.stringToDate(value);
        value = Math.floor(value.getTime() / 1000);
      } else {
        throw new Error('Unknown date type: ' + value);
      }
    }
    buf.writeUint32(value);
  }

  public static asset(buf: ByteBuffer, value: string|Asset) {
    if (typeof(value) === 'string') {
      value = SteemUtil.parseAsset(value);
    }

    let amount: string;
    if (value.unit === AssetUnit.SBD || value.unit === AssetUnit.STEEM) {
      amount = value.amount.toFixed(3);
    } else if (value.unit === AssetUnit.VESTS) {
      amount = value.amount.toFixed(6);
    } else {
      throw new Error('Unhandled asset: ' + value.unit);
    }
    buf.writeInt64(Long.fromString(amount.replace('.', '')));

    const dot = amount.indexOf('.');
    buf.writeUint8(dot === -1 ? 0 : amount.length - dot - 1);
    buf.append(value.unit.toUpperCase(), 'binary');
    for (let i = 0; i < 7 - value.unit.length; ++i) {
      buf.writeUint8(0);
    }
  }

  public static object(fields: object): Serializer {
    return (buf: ByteBuffer, value: object) => {
      Object.entries(fields).forEach(([field, func]) => {
        func(buf, value[field]);
      });
    };
  }

  public static array(serializer: Serializer): Serializer {
    return (buf: ByteBuffer, value: any[]) => {
      buf.writeVarint32(value.length);
      for (const val of value) {
        serializer(buf, val);
      }
    };
  }

  public static opData = (buf: ByteBuffer, data: Operation) => {
    const opTypeFunc = Types[data[0]];
    opTypeFunc(buf, data);
  }

  public static op = (id: number, fields: object): Serializer => {
    return (buf: ByteBuffer, data: Operation) => {
      buf.writeVarint32(id);
      TypeSerializer.object(fields)(buf, data[1]);
    };
  }

}
