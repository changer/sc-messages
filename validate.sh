#! /bin/bash

FILES=notifications/translations/*.json
for f in $FILES
do
  echo "Parsing ${f}"
  output=`cat $f | python -m "json.tool" 2>&1`
  if [ $? -gt 0 ]; then
    echo "Failed to Parse $f. Reason: $output"
    exit 1
  fi
done

echo "Build Passed"
exit 0
