import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/mysql-core';

export const uuid = customType<{ data: string; driverData: Buffer }>({
  dataType() {
    return `BINARY(16)`;
  },

  toDriver(value) {
    return sql.raw(`x'${value.replace(/-/g, '')}'`);
  },

  fromDriver(value: Buffer) {
    return value
      .toString('hex')
      .match(/.{2}/g)!
      .join('')
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
  },
});
