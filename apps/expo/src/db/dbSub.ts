import { PropsWithChildren, useEffect, useRef } from "react";
import {
  addDatabaseChangeListener,
  DatabaseChangeEvent,
} from "expo-sqlite/next";

import { expoDb } from "./index";
import { LDbTrackableRecordSelect, trackableRecord } from "./schema";

type SubscriptionCallback = (v: string) => void;

class SubscriptionOverlord {
  trackableSubscriptions: Record<string, Record<string, SubscriptionCallback>>;

  constructor() {
    this.trackableSubscriptions = {};

    addDatabaseChangeListener((v) => this.listener(v));
  }

  notify(trackableId: string, date: number, value: string) {
    const key = this.getKey(trackableId, date);

    if (this.trackableSubscriptions[key]) {
      Object.values(this.trackableSubscriptions[key]).forEach((cb) =>
        cb(value),
      );
    }
  }

  async listener(v: DatabaseChangeEvent) {
    if (v.tableName === "trackableRecord") {
      const u = (await expoDb.getFirstAsync(
        `SELECT * FROM trackableRecord WHERE rowid = ${v.rowId}`,
      )) as LDbTrackableRecordSelect;

      if (u && u.trackableId && u.date && typeof u.value === "string") {
        const key = this.getKey(u.trackableId, Number(u.date));

        if (this.trackableSubscriptions[key]) {
          Object.values(this.trackableSubscriptions[key]).forEach((cb) =>
            cb(u.value),
          );
        }
      }
    } else if (v.tableName === "userData") {
      const u = (await expoDb.getFirstAsync(
        `SELECT * FROM userData WHERE rowid = ${v.rowId}`,
      )) as LDbTrackableRecordSelect;
    }
  }

  subscribeToTrackableValue(
    trackableId: string,
    date: number,
    callback: SubscriptionCallback,
  ) {
    const key = this.getKey(trackableId, date);
    if (!this.trackableSubscriptions[key]) {
      this.trackableSubscriptions[key] = {};
    }
    // this should not cause collisions, probably
    let random = (Math.random() + 1).toString(36).substring(7);
    this.trackableSubscriptions[key][random] = callback;
    return random;
  }

  unsubscribeFromTrackableValue(
    trackableId: string,
    date: number,
    cbKey: string,
  ) {
    const key = this.getKey(trackableId, date);
    if (!this.trackableSubscriptions[key]) {
      return;
    }
    delete this.trackableSubscriptions[key][cbKey];
  }

  getKey(trackableId: string, date: number) {
    return `${trackableId}_${date}`;
  }
}

const dbSub = new SubscriptionOverlord();

export { dbSub };
