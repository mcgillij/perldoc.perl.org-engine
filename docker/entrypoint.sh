#!/bin/bash

shopt -s expand_aliases

export GIT_DISCOVERY_ACROSS_FILESYSTEM=1

cd /root
git config --global user.email "autobot@opusvl.com" \
git config --global user.name "Auto Commit Bot" \
git clone git@github.com:OpusVL/perldoc.perl.org-engine.git

cd perldoc.perl.org-engine
mkdir work
cd work
git clone git@github.com:OpusVL/perldoc.perl.org-export.git output

#git clone git@github.com:OpusVL/perldoc.perl.org-export.git work
#rm -Rf output-tmp
#git clone git@github.com:OpusVL/perldoc.perl.org-export.git output-tmp
#cp -fr output-tmp/. output/
#rm -Rf output-tmp

while true
do
    cd /root/perldoc.perl.org-engine
    perl sitegen.pl
    cd /root/perldoc.perl.org-engine/work/output
    latest_perl=$(perl -MJSON -MData::Dumper -e 'local $/;open($fh,"<","versions.json");$j=decode_json(<$fh>);print join(".",5,$j->{latest}->{major},$j->{latest}->{minor})')
    ln -sf $latest_perl .default
    git add .
    git commit -am "AutoCommit"
    git push -f origin master
    echo "Sleeping for 24 hours before retrying";
    perl -e 'print "Sleeping 24 hours\n"; sleep(60*60*24)'
done
