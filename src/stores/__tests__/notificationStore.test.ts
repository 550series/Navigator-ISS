import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore } from "../notificationStore";

describe("notificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
  });

  it("has empty initial state", () => {
    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([]);
  });

  it("adds notification", () => {
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: "success",
      title: "Test",
      message: "Test message",
    });
    const { notifications } = useNotificationStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toBe("Test");
    expect(notifications[0].type).toBe("success");
  });

  it("removes notification", () => {
    const { addNotification } = useNotificationStore.getState();
    addNotification({ type: "info", title: "Test 1" });
    addNotification({ type: "info", title: "Test 2" });
    
    const { notifications, removeNotification } = useNotificationStore.getState();
    expect(notifications).toHaveLength(2);
    
    removeNotification(notifications[0].id);
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
  });

  it("clears all notifications", () => {
    const { addNotification, clearAll } = useNotificationStore.getState();
    addNotification({ type: "info", title: "Test 1" });
    addNotification({ type: "info", title: "Test 2" });
    addNotification({ type: "info", title: "Test 3" });
    
    expect(useNotificationStore.getState().notifications).toHaveLength(3);
    clearAll();
    expect(useNotificationStore.getState().notifications).toEqual([]);
  });

  it("limits notifications to 5", () => {
    const { addNotification } = useNotificationStore.getState();
    for (let i = 0; i < 10; i++) {
      addNotification({ type: "info", title: `Test ${i}` });
    }
    expect(useNotificationStore.getState().notifications).toHaveLength(5);
  });

  it("adds timestamp to notification", () => {
    const { addNotification } = useNotificationStore.getState();
    const before = Date.now();
    addNotification({ type: "info", title: "Test" });
    const after = Date.now();
    
    const { notifications } = useNotificationStore.getState();
    expect(notifications[0].timestamp).toBeGreaterThanOrEqual(before);
    expect(notifications[0].timestamp).toBeLessThanOrEqual(after);
  });
});
