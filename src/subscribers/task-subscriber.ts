import { EventSubscriber } from "typeorm";
import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";
import Task from "../entities/Task.js";
import TaskLog from "../entities/TaskLog.js";
import BaseSubscriber from "./subscriber.js";

@EventSubscriber()
export class TaskSubscriber
  extends BaseSubscriber
  implements EntitySubscriberInterface<Task>
{
  listenTo() {
    return Task;
  }

  async afterInsert(event: InsertEvent<Task>) {
    const log = event.manager.create(TaskLog, {
      task: event.entity,
      action: "INSERT",
      field_name: null,
      old_value: null,
      new_value: JSON.stringify(event.entity),
    });
    await event.manager.save(log);
  }

  async afterUpdate(event: UpdateEvent<Task>) {
    
    const { entity, databaseEntity, queryRunner } = event;
  if (!entity || !databaseEntity) return;

  const user = queryRunner?.data?.user;

  console.log("who am i ?", user);

    const ignoredFields: (keyof Task)[] = [
      "updated_at",
      "created_at",
      "deleted_at",
    ];

    const changedFields = (Object.keys(entity) as (keyof Task)[]).filter(
      (key) =>
        !ignoredFields.includes(key) && entity[key] !== databaseEntity[key]
    );

    const normalizeValue = (val: any): any => {
      if (Array.isArray(val)) {
        return val.map((v) => (v && typeof v === "object" ? v.id ?? v : v));
      } else if (val && typeof val === "object" && "id" in val) {
        return val.id;
      }
      return val;
    };

    for (const field of changedFields) {
      const oldVal = normalizeValue(databaseEntity[field]);
      const newVal = normalizeValue(entity[field]);

      if(typeof oldVal === 'object' && typeof newVal === 'object') {
        const oldStr = JSON.stringify(oldVal);
        const newStr = JSON.stringify(newVal);
        if(oldStr === newStr) {
          console.log(`Skipping log for field ${field} as values are equivalent after normalization.`);
          continue;
        }
      }

      const log = event.manager.create(TaskLog, {
        task: entity,
        action: "UPDATE",
        field_name: field as string,
        old_value: JSON.stringify(oldVal ?? null),
        new_value: JSON.stringify(newVal ?? null),
        user: user || null,
      });

      await event.manager.save(log);
    }
  }

  async afterRemove(event: RemoveEvent<Task>) {
    if (!event.entity) return;

    const log = event.manager.create(TaskLog, {
      task: event.entity,
      action: "DELETE",
      field_name: null,
      old_value: JSON.stringify(event.entity),
      new_value: null,
    });
    await event.manager.save(log);
  }
}
