from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

# Original imports 
from core.db_builder import load_schema, build_database, execute_sql
from core.schema_loader import SchemaLoader

# Agents
from agents.text2sql_agent import Text2SQLAgent
from agents.summarizer_agent import SummarizerAgent

# Utility for chart intent detection
from utils.intent import wants_chart


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------
# LOAD SCHEMA
# ---------------------------------------------
# Use absolute paths based on app.py location
schema = [
    {"table_name": "dc_168h_forecasts", "path": os.path.join(BASE_DIR, "datasets", "dc_168h_forecasts.csv")},
    {"table_name": "store_168h_forecasts", "path": os.path.join(BASE_DIR, "datasets", "store_168h_forecasts.csv")}
]

# Use your existing schema loader
schema_loader = SchemaLoader(schema)
loaded_schema = schema_loader.load()

# Build local SQLite DB - use absolute path
db_path = os.path.join(BASE_DIR, "local.db")
build_database(schema, db_path)

# Load schema metadata for Text2SQLAgent
schema_metadata_path = os.path.join(BASE_DIR, "schema_metadata.json")
with open(schema_metadata_path, "r") as f:
    schema_metadata = json.load(f)


# ---------------------------------------------
# Initialize agents
# ---------------------------------------------
t2s = Text2SQLAgent(db_path, loaded_schema, schema_metadata)
summarizer = SummarizerAgent()

# ---------------------------------------------
# API Endpoint
# ---------------------------------------------
@app.route("/query", methods=["POST"])
def query():
    body = request.json
    question = body.get("question", "")

    # Step 1 — Get SQL from text2sql agent
    sql = t2s.run(question)

    # Step 2 — Execute SQL
    df = execute_sql(db_path, sql)

    # Step 3 — Summarize result
    summary = summarizer.summarize(question, df)

    # Step 4 — Generate visualization ONLY if explicitly asked
    if wants_chart(question) and not df.empty:
        viz, mime = summarizer.generate_viz(question, df)
    else:
        viz, mime = None, None

    return jsonify({
        "sql": sql,
        "data": df.to_dict(orient="records"),
        "summary": summary,
        "viz": viz,
        "mime": mime
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
