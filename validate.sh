#! /bin/bash

FILES=notifications/translations/*
for f in $FILES
do
  output=`cat $f | python -m "json.tool" 2>&1`
  if [ $? -gt 0 ]; then
    echo "Failed to Parse $f. Reason: $output"
    exit 1
  fi
done

echo "Build Passed"
exit 0
