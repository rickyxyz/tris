/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../src/App.vue";

describe("App Component Test", () => {
  it("App should render", () => {
    const wrapper = mount(App);
    expect(wrapper).toBeFalsy;
  });
});
