import { strict as assert } from "node:assert";
import test from "node:test";
import { createApiAppModule } from "../../src/app.module";

test("context + query + dashboard + export + feedback flow", async () => {
  const app = createApiAppModule({
    NODE_ENV: "test",
    GOOGLE_CLIENT_ID: "id",
    GOOGLE_CLIENT_SECRET: "secret",
    GOOGLE_CALLBACK_URL: "http://localhost/callback",
    WEB_BASE_URL: "http://localhost:5173",
    SESSION_SECRET: "session-secret"
  });

  const sessionId = "session_1";

  const saveContext = await app.context.contextController.save(sessionId, {
    teamId: "arsenal",
    opponentId: "liverpool",
    window: { matches: 5 }
  });
  assert.equal(saveContext.statusCode, 200);

  const queryResponse = await app.query.queryController.query(sessionId, {
    question: "How do teams beat their high press in the last 5 matches?",
    audienceMode: "technical"
  });
  assert.equal(queryResponse.statusCode, 200);
  const queryBody = queryResponse.body as { queryId: string; dashboardId: string; clarificationRequired: boolean };
  assert.equal(queryBody.clarificationRequired, false);

  const edited = app.dashboard.dashboardController.edit(queryBody.dashboardId, {
    instruction: "Only final 15 minutes",
    minuteFrom: 75,
    minuteTo: 90
  });
  assert.equal(edited.statusCode, 200);

  const exported = app.export.exportController.pdf(sessionId, {
    dashboardId: queryBody.dashboardId,
    queryId: queryBody.queryId,
    includeNarrative: true
  });
  assert.equal(exported.statusCode, 200);

  const rating = app.feedback.feedbackController.rating(sessionId, {
    queryId: queryBody.queryId,
    roleType: "analyst",
    score: 4
  });
  assert.equal(rating.statusCode, 201);

  const summary = app.feedback.feedbackController.summary(sessionId);
  assert.equal(summary.statusCode, 200);
});
