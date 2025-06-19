from django.db import migrations, connection


def ensure_legacy_columns(apps, schema_editor):
    """Make sure columns first_name, last_name on user and position on pendinguser exist."""
    with connection.cursor() as cursor:
        # User table columns
        cursor.execute("PRAGMA table_info(mentalhealthiq_user)")
        cols_user = [row[1] for row in cursor.fetchall()]
        if 'first_name' not in cols_user:
            cursor.execute("ALTER TABLE mentalhealthiq_user ADD COLUMN first_name varchar(150) NOT NULL DEFAULT ''")
        if 'last_name' not in cols_user:
            cursor.execute("ALTER TABLE mentalhealthiq_user ADD COLUMN last_name varchar(150) NOT NULL DEFAULT ''")

        # PendingUser table columns
        cursor.execute("PRAGMA table_info(mentalhealthiq_pendinguser)")
        cols_pending = [row[1] for row in cursor.fetchall()]
        if 'position' not in cols_pending:
            cursor.execute("ALTER TABLE mentalhealthiq_pendinguser ADD COLUMN position varchar(100) NOT NULL DEFAULT ''")


class Migration(migrations.Migration):

    dependencies = [
        ('mentalhealthiq', '0003_sync_pendinguser_status'),
    ]

    operations = [
        migrations.RunPython(ensure_legacy_columns, reverse_code=migrations.RunPython.noop),
    ] 