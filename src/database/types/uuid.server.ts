import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/mysql-core';
import shortUuid from 'short-uuid';
import { validate as validateUUID } from 'uuid';

const translator = shortUuid();

type UUID = string & {
  short?: string;
  toString: () => string;
};

export const uuid = customType<{ data: UUID; driverData: Buffer }>({
  dataType() {
    return `BINARY(16)`;
  },

  toDriver(value) {
    const uuid = translator.validate(value?.toString())
      ? translator.toUUID(value?.toString())
      : value?.toString();
    if (!validateUUID(uuid)) {
      return sql.raw('NULL');
    }

    return sql.raw(`x'${uuid.replace(/-/g, '')}'`);
  },

  fromDriver(value: Buffer) {
    const uuid = new String(
      value
        .toString('hex')
        .match(/.{2}/g)!
        .join('')
        .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'),
    );

    Object.assign(uuid, { short: translator.fromUUID(uuid.toString()) });

    return uuid as UUID;
  },
});
