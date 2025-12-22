import sqlite3

# UOIONHHC

conn = sqlite3.connect("lexi.db", check_same_thread=False)
cursor = conn.cursor()

def init_db():
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        title TEXT,
        body_md TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS template_variables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id TEXT,
        key TEXT,
        label TEXT,
        description TEXT,
        example TEXT,
        required BOOLEAN
    )
    """)

    conn.commit()