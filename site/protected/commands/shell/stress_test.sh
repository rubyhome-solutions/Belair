#!/bin/bash
# "c:\Program Files (x86)\Apache Software Foundation\Apache2.2\bin\ab.exe" 
ab -c 50 -n 100 -p post_content.txt -T application/json https://cheapticket.in/api3d/search