const { pool } = require("../config/db");

async function createAiCopilotLog(log) {
  const result = await pool.query(
    `
      INSERT INTO ai_copilot_logs (
        question,
        intent,
        answer,
        data_source_endpoint,
        row_count,
        error,
        success,
        response_time_ms,
        model,
        tokens_used
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        question,
        intent,
        answer,
        data_source_endpoint AS "dataSourceEndpoint",
        row_count AS "rowCount",
        error,
        success,
        response_time_ms AS "responseTimeMs",
        model,
        tokens_used AS "tokensUsed",
        created_at AS "createdAt"
    `,
    [
      log.question,
      log.intent || null,
      log.answer || null,
      log.dataSourceEndpoint || null,
      log.rowCount || 0,
      log.error || null,
      log.success !== false,
      log.responseTimeMs ?? null,
      log.model || null,
      log.tokensUsed ?? null
    ]
  );

  return result.rows[0];
}

async function getAiCopilotLogs(limit = 50) {
  const result = await pool.query(
    `
      SELECT
        id,
        question,
        intent,
        answer,
        data_source_endpoint AS "dataSourceEndpoint",
        row_count AS "rowCount",
        error,
        success,
        response_time_ms AS "responseTimeMs",
        model,
        tokens_used AS "tokensUsed",
        created_at AS "createdAt"
      FROM ai_copilot_logs
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}

module.exports = {
  createAiCopilotLog,
  getAiCopilotLogs
};
