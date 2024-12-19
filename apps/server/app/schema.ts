import {
  ANYONE_CAN,
  column,
  createSchema,
  createTableSchema,
  definePermissions,
} from "@rocicorp/zero";

import type { ITrackable } from "@tyl/validators/trackable";
import type { IUserSettings } from "@tyl/validators/user";

const { json } = column;

const TYL_auth_user = createTableSchema({
  tableName: "TYL_auth_user",
  columns: {
    id: { type: "string" },
    email: { type: "string" },
    username: { type: "string" },
    settings: json<IUserSettings>(),
  },
  primaryKey: "id",
});

const TYL_trackable = createTableSchema({
  tableName: "TYL_trackable",
  columns: {
    is_deleted: { type: "boolean" },
    user_id: { type: "string" },
    id: { type: "string" },
    name: { type: "string" },
    type: column.enumeration<"boolean" | "range" | "number">(false),
    attached_note: { type: "string" },
    settings: json<ITrackable["settings"]>(),
  },
  primaryKey: "id",
  relationships: {
    user: {
      sourceField: "user_id",
      destSchema: TYL_auth_user,
      destField: "id",
    },
  },
});

const TYL_trackableRecord = createTableSchema({
  tableName: "TYL_trackableRecord",
  columns: {
    date: { type: "number" },
    trackableId: { type: "string" },
    value: { type: "string" },
    user_id: { type: "string" },
  },
  primaryKey: ["trackableId", "date"],
  relationships: {
    user: {
      sourceField: "user_id",
      destSchema: TYL_auth_user,
      destField: "id",
    },
    trackable: {
      sourceField: "trackableId",
      destSchema: TYL_trackable,
      destField: "id",
    },
  },
});

export const schema = createSchema({
  version: 1,
  tables: {
    TYL_trackable,
    TYL_trackableRecord,
    TYL_auth_user,
  },
});

export type Schema = typeof schema;

export const permissions = definePermissions<any, Schema>(schema, () => {
  return {
    TYL_trackableRecord: {
      row: {
        // anyone can insert issues
        insert: ANYONE_CAN,
        // nobody can delete issues
        delete: ANYONE_CAN,
      },
    },
  };
});
