#!/bin/bash
rm -r src/ target/ pom.xml || true
git add -A
git commit -am "update"