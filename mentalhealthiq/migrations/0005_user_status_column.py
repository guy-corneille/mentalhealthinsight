from django.db import migrations, connection


def add_status_column(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA table_info(mentalhealthiq_user)")
        cols = [row[1] for row in cursor.fetchall()]
        if 'status' not in cols:
            cursor.execute("ALTER TABLE mentalhealthiq_user ADD COLUMN status varchar(10) NOT NULL DEFAULT 'active'")


class Migration(migrations.Migration):

    dependencies = [
        ('mentalhealthiq', '0004_sync_legacy_user_columns'),
    ]

    operations = [
        migrations.RunPython(add_status_column, reverse_code=migrations.RunPython.noop),
    ] 