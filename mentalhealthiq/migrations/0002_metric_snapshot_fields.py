# Generated manually to fix migration sequence

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mentalhealthiq', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='metricsnapshot',
            name='total_assessments',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='metricsnapshot',
            name='ninety_day_total_assessments',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='metricsnapshot',
            name='ninety_day_completed_assessments',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='metricsnapshot',
            name='ninety_day_completion_rate',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='metricsnapshot',
            name='active_patients',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='metricsnapshot',
            name='capacity_utilization',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='metricsnapshot',
            name='completed_assessments',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='metricsnapshot',
            name='completion_rate',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='metricsnapshot',
            name='discharged_patients',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='metricsnapshot',
            name='inactive_patients',
            field=models.IntegerField(default=0),
        ),
    ] 
 