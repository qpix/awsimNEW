#!/bin/bash

cd src

for SERVICE_FILE in services/*/*/service-2.json; do
	SERVICE_NAME=$(echo $SERVICE_FILE | cut -f2 -d/)
	echo "awsim['$SERVICE_NAME'] = require('./$SERVICE_FILE');" >> tmp.txt
done

cp ../skeletons/awsim.js awsim.js
sort --reverse tmp.txt | sort -u -t '/' -k 3,3 >> awsim.js
bash ../populate_awsim_object_state.bash

rm -f tmp.txt
