from django.db import migrations, connection


def add_status_column(apps, schema_editor):
    """Add 'status' column to mentalhealthiq_pendinguser if missing."""
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA table_info(mentalhealthiq_pendinguser)")
        col_names = [row[1] for row in cursor.fetchall()]
        if 'status' not in col_names:
            cursor.execute("ALTER TABLE mentalhealthiq_pendinguser ADD COLUMN status varchar(10) DEFAULT 'pending' NOT NULL")


class Migration(migrations.Migration):

    dependencies = [
        ('mentalhealthiq', '0002_sync_pendinguser_display_name'),
    ]

    operations = [
        migrations.RunPython(add_status_column, reverse_code=migrations.RunPython.noop),
    ] 