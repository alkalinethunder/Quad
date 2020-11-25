@echo off

REM this batch script is almost pointless
REM
REM it just runs gulp
REM
REM that's literally all it does
REM 
REM but bscode is drunk and won't let me do this easily as a task
REM without using a batch script on windows
REM
REM the bash version of this adds a local install of gulp to your
REM PATH so it can run but I casn't figure out how the bloody heck
REM to do that in batch because I hate batch with a passion just like
REM I hate Windows and just like this is a run-on sentence
REM
REM TL;DR: install gulp globally with npm damnit

gulp i18next
gulp quadweb
