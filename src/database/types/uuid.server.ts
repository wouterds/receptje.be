import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/mysql-core';
import ShortUuid from 'short-uuid';

const { fromUUID, toUUID, validate } = ShortUuid();

export const uuid = customType<{ data: string; driverData: Buffer }>({
  dataType() {
    return `BINARY(16)`;
  },

  toDriver(value) {
    if (typeof value !== 'string') {
      return sql.raw('NULL');
    }

    if (!validate(value)) {
      return sql.raw('NULL');
    }

    return sql.raw(`x'${toUUID(value).replace(/-/g, '')}'`);
  },

  fromDriver(value: Buffer) {
    const uuid = value
      .toString('hex')
      .match(/.{2}/g)!
      .join('')
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

    return fromUUID(uuid);
  },
});
