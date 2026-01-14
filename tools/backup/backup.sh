#!/bin/bash
set -e

BACKUP_DIR="/backups"
DATE=$(date +"%Y-%m-%d")
WEEK=$(date +"%Y-W%U")
MONTH=$(date +"%Y-%m")
YEAR=$(date +"%Y")
DAY_OF_MONTH=$(date +"%d")
DAY_OF_WEEK=$(date +"%u")

mkdir -p \
  $BACKUP_DIR/daily \
  $BACKUP_DIR/weekly \
  $BACKUP_DIR/monthly \
  $BACKUP_DIR/yearly

echo "🟢 Running daily backup $DATE"

mongodump \
  --host "$MONGO_HOST" \
  --port "$MONGO_PORT" \
  --username "$MONGO_USER" \
  --password "$MONGO_PASS" \
  --authenticationDatabase admin \
  --db "$MONGO_DB" \
  --archive="$BACKUP_DIR/daily/$DATE.gz" \
  --gzip

# 🔁 keep last 7 daily
ls -1t $BACKUP_DIR/daily | tail -n +8 | xargs -I {} rm -f $BACKUP_DIR/daily/{}

# 📆 Weekly (Sunday)
if [ "$DAY_OF_WEEK" = "7" ]; then
  echo "📦 Creating weekly backup $WEEK"
  cp "$BACKUP_DIR/daily/$DATE.gz" "$BACKUP_DIR/weekly/$WEEK.gz"
  ls -1t $BACKUP_DIR/weekly | tail -n +5 | xargs -I {} rm -f $BACKUP_DIR/weekly/{}
fi

# 🗓️ Monthly (1st day)
if [ "$DAY_OF_MONTH" = "01" ]; then
  echo "🗂️ Creating monthly backup $MONTH"
  cp "$BACKUP_DIR/daily/$DATE.gz" "$BACKUP_DIR/monthly/$MONTH.gz"
  ls -1t $BACKUP_DIR/monthly | tail -n +7 | xargs -I {} rm -f $BACKUP_DIR/monthly/{}
fi

# 📦 Yearly (Jan 1st or Jul 1st)
if [ "$MONTH" = "$YEAR-01" ] || [ "$MONTH" = "$YEAR-07" ]; then
  cp "$BACKUP_DIR/daily/$DATE.gz" "$BACKUP_DIR/yearly/$YEAR-$MONTH.gz"
fi

echo "✅ Backup finished"
sleep 24h
