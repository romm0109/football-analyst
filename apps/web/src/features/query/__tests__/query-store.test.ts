import { strict as assert } from "node:assert";
import test from "node:test";
import { AnalysisWorkbench } from "../../analysis/AnalysisWorkbench";

test("analysis workbench renders personalized header", () => {
  const output = AnalysisWorkbench({ id: "u1", email: "analyst@mail.com", name: "Analyst" });
  assert.equal(output, "Football Analyst Workbench for Analyst");
});
